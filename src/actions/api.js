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
    // Construct the payload with id and item data
    const payload = {
      _id: id,
      nama: itemData.nama,
      kategori: itemData.kategori,
      jumlah: itemData.jumlah,
      satuan: itemData.satuan,
      ...(itemData.tanggal_kadaluarsa && {
        tanggal_kadaluarsa: itemData.tanggal_kadaluarsa,
      }),
    };

    // Validate required fields
    const requiredFields = ["_id", "nama", "kategori", "jumlah", "satuan"];
    const missingFields = requiredFields.filter((field) => !payload[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    console.log("Sending payload:", payload); // Debug log

    const response = await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
    console.error("Error updating item:", error);
    throw error;
  }
};

// Function to delete an item from the API
const deleteItem = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE", // Send a DELETE request
    });
    const data = await response.json(); // Parse the response as JSON
    return data; // Return the response data
  } catch (error) {
    console.error("Error deleting item:", error); // Log any errors
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Export the API functions as an object
export const api = {
  getItem,
  addItem,
  updateItem,
  deleteItem,
};
