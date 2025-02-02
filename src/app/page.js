export default function Home() {
  return (
    <div>
      {/* Header Sections */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Inventory List</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Add New Item
        </button>
      </div>

      {/* Table Sections */}
      <div className="bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          \
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expire Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-500">
            <tr>
              <td
                colSpan="5"
                className="px-6 py-4 text-center text-xs text-gray-500"
              >
                No items found. Click "Add New Item" to add
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
