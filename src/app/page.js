"use client"; // This tells Next.js that this component will run in the browser where we can use interactive features

// Importing the tools we need from React
// useState: Helps us create variables that can change (like a light switch that can be on/off)
// useEffect: Helps us run code at specific times (like when the page first loads)
import { useState, useEffect } from "react";

// Importing my custom modal components that I made for adding and editing items
// These are popup windows that appear when we want to add or edit something
import AddItemModal from "@/components/modals/AddItemModal";
import EditItemModal from "@/components/modals/EditItemModal";

// Getting my API functions that help talk to the backend (server)
// This is like having a messenger that carries information back and forth
import { api } from "@/actions/api";

import ExpiryAlert from "@/components/ExpiryAlert";
import { formatDate } from "@/actions/dateFormatter";

// This is my main component for the Home page
export default function Home() {
  // Setting up my variables that can change (state variables)
  // Think of these like containers that can hold different values
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls if the Add popup is showing
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls if the Edit popup is showing
  const [items, setItems] = useState([]); // Holds my list of items, starts as empty array
  const [loading, setLoading] = useState(true); // Tells us if we're still loading data
  const [selectedItem, setSelectedItem] = useState(null); // Keeps track of which item we're editing

  // This runs when the page first loads
  // It's like saying "hey, get my items as soon as the page opens"
  useEffect(() => {
    fetchItems();
  }, []); // The empty [] means run this only once when the page loads

  // Function that gets my items from the server
  const fetchItems = async () => {
    try {
      const data = await api.getItem(); // Ask the server for items
      setItems(data); // Save the items we got
    } catch (error) {
      console.error("Failed to fetch items:", error); // If something goes wrong, log the error
    } finally {
      setLoading(false); // Whether it worked or not, we're done loading
    }
  };

  // Function that handles adding a new item
  // This runs when we submit the Add Item form
  const handleAddItem = async (itemData) => {
    try {
      await api.addItem(itemData); // Send the new item to the server
      await fetchItems(); // Get the updated list of items
      setIsModalOpen(false); // Close the Add popup
    } catch (error) {
      console.error("Failed to add item:", error); // Log any errors that happen
    }
  };

  // Function that runs when we click the Edit button
  const handleEditClick = (item) => {
    setSelectedItem(item); // Remember which item we're editing
    setIsEditModalOpen(true); // Show the Edit popup
  };

  // Function that handles saving edited item changes
  const handleEditSubmit = async (updatedData) => {
    try {
      // Make sure we have an item selected to edit
      if (!selectedItem?._id) {
        console.error("No item selected for edit");
        return;
      }

      // Log what we're about to update (helpful for debugging)
      console.log("Updating item:", {
        id: selectedItem._id,
        currentData: selectedItem,
        newData: updatedData,
      });

      // Check if we have all the required information
      if (!updatedData.nama || !updatedData.kategori || !updatedData.satuan) {
        throw new Error("Missing required fields");
      }

      await api.updateItem(selectedItem._id, updatedData); // Send updates to server
      await fetchItems(); // Get fresh list of items
      setIsEditModalOpen(false); // Close the Edit popup
      setSelectedItem(null); // Clear the selected item
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  // Function that handles deleting an item
  const handleDelete = async (id) => {
    // Show a confirmation popup before deleting
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      try {
        console.log("Attempting to delete item with ID:", id);
        await api.deleteItem(id); // Tell server to delete the item
        await fetchItems(); // Get updated list without the deleted item
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert("Gagal menghapus item. Silakan coba lagi.");
      }
    }
  };

  // The actual HTML structure that shows up on the page

  // Render the component
  return (
    <div className="container mx-auto px-4">
      {/* Header section with a button to add new items */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Daftar Inventori
        </h2>
        <button
          onClick={() => setIsModalOpen(true)} // Open the Add Item modal
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Tambah Item
        </button>
      </div>

      {/* Table to display the list of items */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Kadaluarsa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Conditional rendering based on loading state and items availability */}
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Belum ada item. Klik "Tambah Item" untuk menambahkan
                    inventori.
                  </td>
                </tr>
              ) : (
                // Map through the items and render each row
                items.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {item.nama}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {item.kategori}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {item.jumlah}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {item.satuan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {formatDate(item.tanggal_kadaluarsa)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-x-2">
                        {/* Edit button */}
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ExpiryAlert items={items} />

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isModalOpen} // Controlled by isModalOpen state
        onClose={() => setIsModalOpen(false)} // Close the modal
        onSubmit={handleAddItem} // Handle form submission
      />

      {/* Edit Item Modal */}
      <EditItemModal
        isOpen={isEditModalOpen} // Controlled by isEditModalOpen state
        onClose={() => {
          setIsEditModalOpen(false); // Close the modal
          setSelectedItem(null); // Clear the selected item
        }}
        onSubmit={handleEditSubmit} // Handle form submission
        item={selectedItem} // Pass the selected item to the modal
      />
    </div>
  );
}
