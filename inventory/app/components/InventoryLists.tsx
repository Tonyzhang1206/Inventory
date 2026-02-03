'use client';                                   // Tell Next.js this is for phone/browser
import {useState, useEffect} from 'react';      // Importing necessary hooks from React

// Define the Item interface to type the inventory items
interface InventoryItem {
    id: number;
    name: string;
    quantity: number;
    category: string;
}

// Define and export the InventoryLists component
export default function InventoryLists() {   

    // State to hold the list of inventory items
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [newItem, setNewItem] = useState({name: '', category: '', quantity: ''});

    const [loading, setLoading] = useState(true);

    // useEffect to fetch data when the component mounts
    useEffect(() => {
        fetchInventoryItems();
    }, []); //run only once on mount

    const fetchInventoryItems = async () => {
        try {
            const response = await fetch('/api/items'); // Replace with your API endpoint
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            }
        } catch (error) {
            console.error("Error fetching inventory items:", error);
        } finally {
            setLoading(false);
        }
    };

    // Function to handle adding a new item
    const addItem = async (e: React.FormEvent) => {
        e.preventDefault(); // stop the page from reloading
        if (!newItem.name || !newItem.quantity) return; // simple validation)

        // Create the new item object
        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });

            if (response.ok) {
                setNewItem({name: '', category: '', quantity: ''}); // Clear the form
                fetchInventoryItems(); // Refresh the list
            }
        } catch (error) {
            console.error("Error adding inventory item:", error);
        }
    };
  
    return (
        <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Inventory</h1>

      {/* --- SECTION A: THE ORDER FORM --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Item</h2>
        
        {/* The form calls 'addItem' when you hit Submit */}
        <form onSubmit={addItem} className="flex gap-4 items-end flex-wrap">
          
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Item Name</label>
            <input
              type="text"
              placeholder="e.g. Widget A"
              className="w-full p-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              // This connects the input box to the 'newItem' sticky note
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <input
              type="text"
              placeholder="e.g. Electronics"
              className="w-full p-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            />
          </div>

          <div className="w-[100px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Qty</label>
            <input
              type="number"
              placeholder="0"
              className="w-full p-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium h-[42px] transition-colors"
          >
            Add Item
          </button>
        </form>
      </div>

      {/* --- SECTION B: THE DISPLAY LIST --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading your items...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No items found. Use the form above to add one!
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{item.quantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
