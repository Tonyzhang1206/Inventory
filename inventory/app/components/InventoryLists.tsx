'use client';                                   // Tell Next.js this is for phone/browser
import {useState, useEffect} from 'react';      // Importing necessary hooks from React

// Define the Item interface to type the inventory items
interface Item {
    id: number;
    name: string;
    quantity: number;
    category: string;
}

// Define and export the InventoryLists component
export default function InventoryLists() {   

    // State to hold the list of inventory items
    const [items, setItems] = useState<Item[]>([]);

    const [loading, setLoading] = useState(true);

    // useEffect to fetch data when the component mounts
    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchInventoryItems();
                setItems(data);  //save data to state
                    
            } catch (error) {
                console.error("Error fetching inventory items:", error); 
            }
            finally {
                setLoading(false); //stop the loading spinner
            }
        }
        loadData(); //run it itmediately
    }, []); //run only once on mount

    // ... all your logic above ...

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                My Inventory
            </h1>

            {/* 1. Show Loading State */}
            {loading && <p>Loading items...</p>}

            {/* 2. Show Empty State (If loaded but no items) */}
            {!loading && items.length === 0 && (
                <p>No items found. Add some!</p>
            )}

            {/* 3. The Grid of Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map((item : Item) => (
                    <div 
                        key={item.id} 
                        style={{ 
                            border: '1px solid #ccc', 
                            borderRadius: '8px', 
                            padding: '16px',
                            backgroundColor: '#fff' 
                        }}
                    >
                        {/* Top Row: Name and Category */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                {item.name}
                            </span>
                            <span style={{ 
                                backgroundColor: '#eee', 
                                padding: '4px 8px', 
                                borderRadius: '12px', 
                                fontSize: '12px' 
                            }}>
                                {item.category}
                            </span>
                        </div>

                        {/* Bottom Row: Quantity */}
                        <div style={{ color: '#666' }}>
                            Quantity: <strong>{item.quantity}</strong>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}







// Function to fetch inventory items from an API
async function fetchInventoryItems() {
    
    const response = await fetch('/api/items'); // Replace with your API endpoint

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    
    return response.json();
}

