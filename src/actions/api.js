// This is the web address where our data lives
// Think of it like the address of our storage warehouse
const BASE_URL = "https://v1.appbackend.io/v1/rows/6lqd5EErN0qA";

// Function to get all our items from storage
// Like sending someone to check what's in the warehouse and make a list
const getItem = async () => {
  try {
    // fetch is like sending a messenger to get information
    const response = await fetch(BASE_URL); // Go to the warehouse and look around
    const data = await response.json(); // Convert the messenger's notes into something we can read
    return data.data; // Give us just the list of items (that's in the 'data' part)
  } catch (error) {
    // If something goes wrong (like messenger got lost)
    console.error("Error fetching items:", error); // Write down what went wrong
    throw error; // Tell others there was a problem
  }
};

// Function to add a new item to storage
// Like sending someone to put a new product in the warehouse
const addItem = async (item) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST", // Tell the messenger this is a new item to add
      headers: {
        "Content-Type": "application/json", // Tell them it's written in JSON format
      },
      body: JSON.stringify([item]), // Convert our item into JSON language and wrap it in []
    });
    const data = await response.json(); // Get back confirmation in readable format
    return data; // Send back the confirmation
  } catch (error) {
    console.error("Error adding item:", error); // Write down if something went wrong
    throw error; // Tell others about the problem
  }
};

// Function to update an existing item
// Like sending someone to change details about a product in the warehouse
const updateItem = async (id, itemData) => {
  try {
    // Send update request to our storage
    const response = await fetch(BASE_URL, {
      method: "PUT", // Tell the messenger we want to change something
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id, // Which item to update (like shelf number)
        nama: itemData.nama, // New name
        kategori: itemData.kategori, // New category
        jumlah: Number(itemData.jumlah), // New quantity (make sure it's a number)
        satuan: itemData.satuan, // New unit
        tanggal_kadaluarsa: itemData.tanggal_kadaluarsa || null, // New expiry date (or none)
      }),
    });

    // Check if the update worked
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

// Function to delete an item
// Like sending someone to remove a product from the warehouse
const deleteItem = async (id) => {
  try {
    // Make sure we know which item to delete
    if (!id) {
      throw new Error("Item ID is required for deletion");
    }

    // Our warehouse expects a list of IDs to delete
    const payload = [id];

    // Write down what we're about to delete (helps us track problems)
    console.log("Deleting item with payload:", payload);

    // Send delete request
    const response = await fetch(BASE_URL, {
      method: "DELETE", // Tell the messenger to remove something
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Send the ID of what to delete
    });

    // Check if deletion worked
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check what kind of response we got back
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      // If it's JSON, convert it to readable format
      const data = await response.json();
      return data;
    } else {
      // If it's not JSON, something might be wrong
      const text = await response.text();
      console.error("Received non-JSON response:", text);
      throw new Error("Received non-JSON response from server");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

// Pack all our functions into one neat package to export
// Like putting all our tools in one toolbox
export const api = {
  getItem,
  addItem,
  updateItem,
  deleteItem,
};
