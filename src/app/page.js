"use client"; // This tells Next.js that we want to use browser features like clicking buttons and showing popups

// Getting the tools we need from React
// Think of useState like a box where we can put things and change them later
// And useEffect is like setting an alarm to do something at specific times
import { useState, useEffect } from "react";

// Getting my popup windows (modals) that I made for adding and editing items
// These are like those forms that pop up when you click "edit profile" on social media
import AddItemModal from "@/components/modals/AddItemModal";
import EditItemModal from "@/components/modals/EditItemModal";

// Getting my helper functions that talk to my database
// Think of this like having a waiter that goes between the kitchen (database) and the customers (users)
import { api } from "@/actions/api";

// Import the component that shows a warning when items are about to expire
import ExpiryAlert from "@/components/ExpiryAlert";

// Import the function that formats dates nicely
import { formatDate } from "@/actions/dateFormatter";

// Import icons for edit and delete buttons
import { FiEdit2, FiTrash2 } from "react-icons/fi";

// Import the Button component from HeroUI
import { Button } from "@heroui/react";

// This is like the blueprint for my main page
export default function Home() {
  // Setting up my "boxes" (variables) that can change
  // Imagine these like switches that can be turned on/off
  const [isModalOpen, setIsModalOpen] = useState(false); // For showing/hiding the Add Item popup
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For showing/hiding the Edit Item popup
  const [items, setItems] = useState([]); // Like a shopping list that starts empty
  const [loading, setLoading] = useState(true); // Like a "busy" sign while we're getting stuff
  const [selectedItem, setSelectedItem] = useState(null); // Remember which item we're editing
  const [pending, setPending] = useState(false);

  // When the page first opens, get our items
  // Like checking your inventory when you first open your store
  useEffect(() => {
    fetchItems();
  }, []); // The empty [] means "only do this when the page first loads"

  // Function to get items from our database
  // Like asking the warehouse what items we have
  const fetchItems = async () => {
    try {
      const data = await api.getItem(); // Ask database for items
      setItems(data); // Put items in our "box"
    } catch (error) {
      console.error("Failed to fetch items:", error); // If something goes wrong, write it down
    } finally {
      setLoading(false); // Turn off the "busy" sign
    }
  };

  // When someone adds a new item
  // Like when a new product arrives at your store
  const handleAddItem = async (itemData) => {
    try {
      await api.addItem(itemData); // Tell database about new item
      await fetchItems(); // Get fresh list of all items
      setIsModalOpen(false); // Close the Add Item popup
    } catch (error) {
      console.error("Failed to add item:", error); // Write down if something goes wrong
    }
  };

  // When someone clicks Edit button
  // Like picking an item off the shelf to change its price tag
  const handleEditClick = (item) => {
    setSelectedItem(item); // Remember which item we're editing
    setIsEditModalOpen(true); // Show the Edit popup
  };

  // When someone saves their edits
  // Like updating the price tag on that item
  const handleEditSubmit = async (updatedData) => {
    try {
      // Make sure we actually picked an item to edit
      if (!selectedItem?._id) {
        console.error("No item selected for edit");
        return;
      }

      // Write down what we're changing (helps us find problems later)
      console.log("Updating item:", {
        id: selectedItem._id,
        currentData: selectedItem,
        newData: updatedData,
      });

      // Make sure we have all the important information
      // Like checking if we have both price AND name when updating a product
      if (!updatedData.nama || !updatedData.kategori || !updatedData.satuan) {
        throw new Error("Missing required fields");
      }

      await api.updateItem(selectedItem._id, updatedData); // Tell database about changes
      await fetchItems(); // Get fresh list of items
      setIsEditModalOpen(false); // Close the Edit popup
      setSelectedItem(null); // Forget which item we were editing
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  // When someone wants to delete an item
  // Like removing a product you don't sell anymore
  const handleDelete = async (id) => {
    // Double check if they really want to delete
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      try {
        console.log("Attempting to delete item with ID:", id);
        await api.deleteItem(id); // Tell database to remove the item
        await fetchItems(); // Get fresh list without deleted item
      } catch (error) {
        console.error("Failed to delete item:", error);
        alert("Gagal menghapus item. Silakan coba lagi.");
      }
    }
  };

  // The part that shows up on the screen
  // Think of this like arranging shelves in your store
  return (
    <div className="container mx-auto px-4">
      {/* The top part with title and Add button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Daftar Barang</h2>
        <Button
          onPress={() => setIsModalOpen(true)} // Show Add Item popup when clicked
          disabled={pending}
          color="primary"
          type="button"
        >
          {pending ? "Loading..." : "Tambah Item"}
        </Button>
      </div>

      {/* The table that shows all our items */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table headers - like labels on store shelves */}
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
            {/* Table body - where all our items are listed */}
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Show different things based on what's happening:
                  - If loading: show "Loading..."
                  - If no items: show "No items yet"
                  - If has items: show all items in rows */}
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
                // For each item in our list, make a row in the table
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
                        {/* Buttons for each row */}
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                          title="Edit item"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100 p-1.5 rounded-full transition-colors"
                          title="Hapus item"
                        >
                          <FiTrash2 size={18} />
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

      {/* Our popup windows (modals) */}
      {/* Add Item popup */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
      />

      {/* Edit Item popup */}
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedItem(null);
        }}
        onSubmit={handleEditSubmit}
        item={selectedItem}
      />
    </div>
  );
}
