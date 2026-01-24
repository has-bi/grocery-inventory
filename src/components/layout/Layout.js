import Image from "next/image";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/images/Logo.png"
                alt="Isi Kulkas Logo"
                width={28}
                height={28}
                className="object-contain"
              />
              <h1 className="text-xl font-light text-black">
                BarangXLupa
              </h1>
            </div>
            <span className="text-xs text-gray-400">Beta</span>
          </div>
        </nav>
      </header>

      <main>
        {children}
      </main>

      <footer className="border-t border-gray-200 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-gray-400">
          <p>© 2025 BarangXLupa · Created by Hasbi</p>
        </div>
      </footer>
    </div>
  );
}
