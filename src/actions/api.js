// Base URL for the API endpoint
const BASE_URL = "https://v1.appbackend.io/v1/rows/6lqd5EErN0qA";

// Function to fetch all items from the API
const getItem = async () => {
  try {
    const response = await fetch(BASE_URL); // Send a GET request to the API
    const data = await response.json(); // Parse the response as JSON
    return data.data; // Return the data property from the response
  } catch (error) {
    console.error("Error fetching items:", error); // Log any errors
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Function to add a new item to the API
const addItem = async (item) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST", // Send a POST request
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify([item]), // Convert the item to JSON and send it in the request body
    });
    const data = await response.json(); // Parse the response as JSON
    return data; // Return the response data
  } catch (error) {
    console.error("Error adding item:", error); // Log any errors
    throw error; // Re-throw the error to handle it in the calling function
  }
};

const updateItem = async (id, itemData) => {
  try {
    // AppBackend expects the request without the ID in the URL
    const response = await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: id, // Include the ID in the body instead
        nama: itemData.nama,
        kategori: itemData.kategori,
        jumlah: Number(itemData.jumlah),
        satuan: itemData.satuan,
        tanggal_kadaluarsa: itemData.tanggal_kadaluarsa || null,
      }),
    });

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

const deleteItem = async (id) => {
  try {
    if (!id) {
      throw new Error("Item ID is required for deletion");
    }

    // Send array of IDs directly as the body
    const payload = [id];

    console.log("Deleting item with payload:", payload); // Debug log

    const response = await fetch(BASE_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload), // Send the array directly
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    } else {
      const text = await response.text();
      console.error("Received non-JSON response:", text);
      throw new Error("Received non-JSON response from server");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    throw error;
  }
};

// Export the API functions as an object
export const api = {
  getItem,
  addItem,
  updateItem,
  deleteItem,
};
