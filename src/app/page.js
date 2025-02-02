"use client"; // Indicates that this is a Client Component in Next.js

// Importing necessary hooks and components
import { useState, useEffect } from "react"; // useState for state management, useEffect for side effects
import AddItemModal from "@/components/modals/AddItemModal"; // Modal for adding items
import EditItemModal from "@/components/modals/EditItemModal"; // Modal for editing items
import { api } from "@/actions/api"; // API functions for CRUD operations

// Main component for the Home page
export default function Home() {
  // State variables
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls the visibility of the Add Item modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls the visibility of the Edit Item modal
  const [items, setItems] = useState([]); // Stores the list of items
  const [loading, setLoading] = useState(true); // Indicates if data is still being fetched
  const [selectedItem, setSelectedItem] = useState(null); // Stores the item selected for editing

  // useEffect hook to fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []); // Empty dependency array means this runs once on mount

  // Function to fetch items from the API
  const fetchItems = async () => {
    try {
      const data = await api.getItem(); // Fetch items from the API
      setItems(data); // Update the state with the fetched items
    } catch (error) {
      console.error("Failed to fetch items:", error); // Log any errors
    } finally {
      setLoading(false); // Set loading to false after fetching (whether successful or not)
    }
  };

  // Function to handle adding a new item
  const handleAddItem = async (itemData) => {
    try {
      await api.addItem(itemData); // Add the new item via the API
      await fetchItems(); // Refresh the list of items
      setIsModalOpen(false); // Close the Add Item modal
    } catch (error) {
      console.error("Failed to add item:", error); // Log any errors
    }
  };

  // Function to handle clicking the Edit button
  const handleEditClick = (item) => {
    setSelectedItem(item); // Set the selected item for editing
    setIsEditModalOpen(true); // Open the Edit Item modal
  };

  // Function to handle submitting the edited item
  const handleEditSubmit = async (updatedData) => {
    try {
      if (!selectedItem?._id) return; // Ensure there's a selected item with an ID

      // Debug log
      console.log("Submitting update with:", {
        id: selectedItem._id,
        updatedData,
      });

      await api.updateItem(selectedItem._id, updatedData); // Pass id and data separately
      await fetchItems(); // Refresh the list of items
      setIsEditModalOpen(false); // Close the Edit Item modal
      setSelectedItem(null); // Clear the selected item
    } catch (error) {
      console.error("Failed to update item:", error); // Log any errors
    }
  };

  // Function to handle deleting an item
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      // Confirm deletion
      try {
        await api.deleteItem(id); // Delete the item via the API
        await fetchItems(); // Refresh the list of items
      } catch (error) {
        console.error("Failed to delete item:", error); // Log any errors
      }
    }
  };

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
                  Satuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Kadaluarsa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
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
                      {item.satuan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {item.jumlah}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                      {item.tanggal_kadaluarsa || "-"}
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
