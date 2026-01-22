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

    return (
        <div>
            <h1>Inventory Lists Component</h1>
        </div>
    );
}

