/**
 * Scores a finished session out of 100 and picks the flavour text.
 *
 * Four things get points, and the sheet shows the split so the number is never
 * a black box:
 *   selesai     40  did you finish what was programmed
 *   naik        30  volume against the last time you ran this same session
 *   rekor       20  personal bests set today
 *   ngegas      10  average RPE landing in the productive 7–9 band
 *
 * Everything here is deterministic. Reopening the summary must show the same
 * words, so the flavour line is chosen by hashing date+session rather than at
 * random.
 */

const TIERS = [
  {
    min: 90,
    title: "Sekuat Doraemon",
    tagline: "Kantong ajaibnya isi pelat semua.",
    lines: [
      "Barbel-nya yang minta ampun, bukan kamu.",
      "Gravitasi baru aja ngajuin surat pengunduran diri.",
      "Ini bukan latihan, ini pameran kekuatan.",
    ],
  },
  {
    min: 78,
    title: "Beban Hidup Kalah Berat",
    tagline: "Yang di pundak tadi lebih ringan dari tanggungan bulanan.",
    lines: [
      "Rak besinya mulai kenal namamu.",
      "Otot bertambah, overthinking berkurang. Adil.",
      "Sesi model begini yang bikin grafiknya naik.",
    ],
  },
  {
    min: 62,
    title: "Kuli Panggul Bersertifikat",
    tagline: "Rapi, konsisten, nggak drama.",
    lines: [
      "Nggak spektakuler, tapi justru ini yang bikin progres.",
      "Datang, angkat, pulang. Resep yang kelihatan membosankan tapi manjur.",
      "Tubuhmu nggak butuh heboh, cuma butuh diulang.",
    ],
  },
  {
    min: 45,
    title: "Ayam Geprek",
    tagline: "Sempat digeprek, tapi tetap bangkit.",
    lines: [
      "Setengah jalan tetap lebih jauh dari nol.",
      "Hari ini seri lawan kasur. Lumayan.",
      "Nggak semua sesi harus jadi highlight.",
    ],
  },
  {
    min: 25,
    title: "Pemanasan Bumi",
    tagline: "Naik sih, dikit.",
    lines: [
      "Keringat tetap keringat, walaupun malu-malu.",
      "Badanmu nyatet kok, walau dikit.",
      "Besok tambahin satu set, udah beda cerita.",
    ],
  },
  {
    min: 0,
    title: "Numpang Absen",
    tagline: "Tapi absen tetap dihitung.",
    lines: [
      "Dateng aja udah ngalahin versi dirimu yang rebahan.",
      "Sesi terjelek tetap mengalahkan sesi yang nggak pernah terjadi.",
      "Streak selamat. Itu dulu yang penting.",
    ],
  },
];

/** Small stable hash so the same session always gets the same line. */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Work done. Loaded sets count weight × reps; unloaded sets count reps, so a
 * bodyweight session can still show progression instead of scoring a flat zero
 * on both sides of the comparison. Units are mixed, but the number is only ever
 * compared against the same session, so the ratio stays meaningful.
 */
function volumeOf(sets) {
  return sets.reduce(
    (sum, l) => sum + (l.weight > 0 ? l.weight * (l.reps || 0) : l.reps || 0),
    0
  );
}

/**
 * @param todaySets  every set logged today for this session
 * @param priorSets  sets from the last day this same session was trained
 * @param targetSets total sets the program asks for
 * @param prCount    exercises where today beat the previous best
 */
export function scoreSession({ todaySets, priorSets = [], targetSets = 0, prCount = 0 }) {
  const done = todaySets.length;
  const volume = volumeOf(todaySets);
  const priorVolume = volumeOf(priorSets);

  // Nothing logged is nothing earned — no neutral credit for an empty session.
  if (done === 0) {
    return {
      total: 0,
      done: 0,
      targetSets,
      volume: 0,
      priorVolume,
      volumeDelta: null,
      prCount: 0,
      avgRpe: null,
      breakdown: [
        { label: "Nyelesaiin program", value: 0, max: 40 },
        { label: "Naik dari sesi lalu", value: 0, max: 30 },
        { label: "Rekor baru", value: 0, max: 20 },
        { label: "Ngegas pas takarannya", value: 0, max: 10 },
      ],
    };
  }

  // 1. Completion — the biggest slice, because finishing the plan is the job.
  const completionRatio = targetSets > 0 ? clamp(done / targetSets, 0, 1) : done > 0 ? 1 : 0;
  const completion = Math.round(completionRatio * 40);

  // 2. Progression against the same session last time. With nothing to compare
  //    against, award the neutral middle rather than punishing a first run.
  let progression;
  let volumeDelta = null;
  if (priorVolume > 0 && volume > 0) {
    const ratio = volume / priorVolume;
    volumeDelta = ratio - 1;
    if (ratio >= 1.1) progression = 30;
    else if (ratio >= 1) progression = Math.round(20 + (ratio - 1) * 100);
    else if (ratio >= 0.9) progression = Math.round(10 + (ratio - 0.9) * 100);
    else progression = Math.round(clamp(ratio / 0.9, 0, 1) * 10);
  } else {
    progression = 20;
  }

  // 3. Personal bests.
  const records = clamp(prCount * 10, 0, 20);

  // 4. Effort. RPE 7–9 is where the work actually happens; sandbagging and
  //    grinding every set to failure both score lower.
  const rpes = todaySets.filter((l) => l.rpe > 0).map((l) => l.rpe);
  const avgRpe = rpes.length ? rpes.reduce((a, b) => a + b, 0) / rpes.length : null;
  let intensity = 5;
  if (avgRpe !== null) {
    if (avgRpe >= 7 && avgRpe <= 9) intensity = 10;
    else if (avgRpe > 9) intensity = 7;
    else if (avgRpe >= 6) intensity = 7;
    else intensity = 4;
  }

  const total = clamp(completion + progression + records + intensity, 0, 100);

  return {
    total,
    done,
    targetSets,
    volume,
    priorVolume,
    volumeDelta,
    prCount,
    avgRpe,
    breakdown: [
      { label: "Nyelesaiin program", value: completion, max: 40 },
      { label: "Naik dari sesi lalu", value: progression, max: 30 },
      { label: "Rekor baru", value: records, max: 20 },
      { label: "Ngegas pas takarannya", value: intensity, max: 10 },
    ],
  };
}

export function tierFor(total, seed = "") {
  const tier = TIERS.find((t) => total >= t.min) ?? TIERS[TIERS.length - 1];
  const line = tier.lines[hash(seed + tier.title) % tier.lines.length];
  return { ...tier, line };
}
