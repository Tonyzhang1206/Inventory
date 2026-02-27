'use client';                                   // Tell Next.js this is for phone/browser
import {useState, useEffect} from 'react';      // Importing necessary hooks from React

// Define the Item interface to type the inventory items
interface InventoryItem {
    id: number;
    name: string;
    quantity: number;
    category: string;
    threshold?: number; // Optional threshold for low stock alerts
}

// Define and export the InventoryLists component
export default function InventoryLists() {   

    // State to hold the list of inventory items
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [newItem, setNewItem] = useState({name: '', category: '', quantity: ''});
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null); // Track which item is being edited
    const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null); // Track which item is being deleted
    const [showLowStockOnly, setShowLowStockOnly] = useState(false); // State to toggle low stock filter

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

    //Delete function
    const deleteItem = async (id: number) => {
        try {
            const response = await fetch('/api/items', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                fetchInventoryItems(); // Refresh the list after deletion
            }
        } catch (error) {
            console.error("Error deleting inventory item:", error);
        }
    }

    //Update Function
    const updateQuantity = async (id: number, quantity: number, change: number) => {
      const newQuantity = quantity + change;
      if (newQuantity < 0) return; // Prevent negative quantities

      try {
          const response = await fetch('/api/items', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, quantity: newQuantity }),
          });

          if (response.ok) {
              fetchInventoryItems(); // Refresh the list after update
          }
      } catch (error) {
          console.error("Error updating inventory item:", error);
      }
    };

    // Save edits function (for future use when implementing inline editing)
    const saveEdit = async () => {
      if (!editingItem) return;
      try {
          const response = await fetch('/api/items', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(editingItem),
          });
          if (response.ok) {
              setEditingItem(null); // Exit edit mode
              fetchInventoryItems(); // Refresh the list after update
          } else {
              console.error("Failed to save changes");
          }
      } catch (error) {
          console.error("Error saving inventory item:", error);
      }
    };

    const displayItems = showLowStockOnly
      ? items.filter(item => item.quantity <= (item.threshold ?? 0))
      : items;
    
    return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Inventory</h1>

      {/* LOW STOCK FILTER BUTTON */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
            showLowStockOnly 
              ? "bg-red-100 text-red-800 border-2 border-red-300 shadow-inner" 
              : "bg-white text-gray-600 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
          }`}
        >
          {/* A little warning icon */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {showLowStockOnly ? "Showing Low Stock" : "Filter Low Stock"}
        </button>
      </div>

      {/* --- FORM SECTION --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Item</h2>
        <form onSubmit={addItem} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-600 mb-1">Item Name</label>
            <input
              type="text"
              placeholder="e.g. Widget A"
              className="w-full p-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
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

      {/* --- LIST SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading your items...</div>
        ) : (
          <div className="w-full">
            
            {/* DESKTOP TABLE (Hidden on Mobile) */}
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No items found. Use the form above to add one!
                    </td>
                  </tr>
                ) : (
                  displayItems.map((item) => {
                    // LOGIC: Check for Low Stock
                    const isLowStock = item.quantity <= (item.threshold || 5);

                    return (
                      <tr 
                        key={item.id} 
                        className={`transition-colors ${
                          isLowStock ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                          <div className="flex items-center gap-2">
                            {item.name}
                            {/* Low Stock Badge */}
                            {isLowStock && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold border border-red-200">
                                LOW STOCK
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity, -1)} className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-bold flex items-center justify-center">-</button>
                          <span className="font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity, 1)} className="w-6 h-6 bg-blue-100 rounded hover:bg-blue-200 text-blue-700 font-bold flex items-center justify-center">+</button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                          {/*EDIT BUTTON */}
                            <button
                              onClick={() => setEditingItem(item)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors mr-2"
                            >
                              Edit
                            </button>

                          { /* DELETE BUTTON */}
                          <button
                            onClick={() => setDeletingItem(item)}
                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* MOBILE CARDS (Visible on Mobile) */}
            <div className="md:hidden flex flex-col divide-y divide-gray-200">
              {items.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No items found. Use the form above to add one!
                </div>
              ) : (
                displayItems.map((item) => {
                  // 1. LOGIC: Check if this specific item is running low
                  // If we don't have a specific threshold set, use 5 as the default rule.
                  const isLowStock = item.quantity <= (item.threshold || 5);

                  return (
                    <div 
                      key={item.id} 
                      // 2. STYLE: If isLowStock is true, turn the background RED. If not, keep it WHITE.
                      className={`p-4 flex justify-between items-center border-b ${
                        isLowStock ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'
                      }`}
                    >
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                          {item.name}
                          
                          {/* 3. BADGE: Show a "LOW STOCK" warning tag if needed */}
                          {isLowStock && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold border border-red-200">
                              LOW STOCK
                            </span>
                          )}
                        </h3>

                        <div className="mt-1 mb-2">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">
                            {item.category}
                          </span>
                        </div>
                        
                        {/* Mobile Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-sm text-gray-500">Qty:</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 text-gray-700 font-bold"
                          >
                            -
                          </button>
                          <span className="font-bold text-gray-800 w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity, 1)}
                            className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full hover:bg-blue-200 text-blue-700 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Mobile Action Buttons (Edit + Delete) */}
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-blue-600 bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
                          aria-label="Edit item"
                        >
                          {/* Pencil Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => setDeletingItem(item)}
                          className="text-red-600 bg-red-50 p-3 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center"
                          aria-label="Delete item"
                        >
                          {/* Trash Icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}
      </div>
      {/* ========================================== */}
      {/* EDIT MODAL (Appears only when editingItem is not null) */}
      {/* ========================================== */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          {/* Modal Container: Auto-sizes for mobile and desktop */}
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all">
            <h2 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-2">Edit Item</h2>
            
            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>

              {/* Category Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                />
              </div>

              {/* Threshold Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Low Stock Alert Threshold
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingItem.threshold || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, threshold: Number(e.target.value) })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setEditingItem(null)} // Cancel closes the modal
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit} // Save calls your new function
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ========================================== */}
      {deletingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 transform transition-all text-center">
            {/* Warning Icon */}
            <svg className="mx-auto mb-4 text-red-500 w-12 h-12" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>
            
            <h3 className="mb-2 text-xl font-bold text-gray-900">Are you sure?</h3>
            <p className="mb-6 text-gray-500 font-medium">
              Do you really want to delete <span className="font-bold text-gray-900">"{deletingItem.name}"</span>? This process cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeletingItem(null)} // Cancel closes the modal
                className="py-2.5 px-5 text-sm font-bold text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 transition-colors"
              >
                No, cancel
              </button>
              <button
                onClick={() => {
                  deleteItem(deletingItem.id); // Run the actual delete function
                  setDeletingItem(null); // Close the modal
                }}
                className="py-2.5 px-5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-colors"
              >
                Yes, delete it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}