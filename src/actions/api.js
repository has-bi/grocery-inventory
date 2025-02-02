const BASE_URL = "https://v1.appbackend.io/v1/rows/6lqd5EErN0qA";

export const api = {
  // Get all items
  getItems: async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching items", error);
      throw error;
    }
  },

  addItem: async (item) => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([item]),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error adding item", error);
      throw error;
    }
  },

  updateItems: async (id, item) => {
    try {
      const response = await fetch(`${BASE_URL}/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating item", error);
      throw error;
    }
  },

  deleteItem: async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error deleting item", error);
      throw error;
    }
  },
};
