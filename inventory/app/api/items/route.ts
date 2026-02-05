import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import next from 'next';

const prisma = new PrismaClient();

// Fetch all items from the inventory
export async function GET() {
    try {
        const items = await prisma.item.findMany(); // Fetch all items from the database
        return new Response(JSON.stringify(items), { status: 200 });
    } catch (error) {
        console.error("Error fetching items:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch items" }), { status: 500 });
    }
}


// Add a new item to the inventory
export async function POST(request:Request) {
    try{
        const body = await request.json();  //Reads the category from the incoming request
        const {name, quantity, category} = body;

        const newItem = await prisma.item.create({
            data: {
                name,
                quantity: Number(quantity),
                category: category,
            }
        });
        return new Response(JSON.stringify(newItem), { status: 201 });
    } catch (error) {
        console.error("Error creating item:", error);
        return new Response(JSON.stringify({ error: "Failed to create item" }), { status: 500 });
    }
}

// Delete an item from the inventory
export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        await prisma.item.delete({
            where: { id: Number(id) }
        });
        return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
    }   catch (error) {
        console.error("Error deleting item:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
    
}

// Update an existing item in the inventory
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, quantity} = body;

        //update the item in the database
        const updatedItem = await prisma.item.update({
            where: { id: Number(id) },
            data: { quantity: Number(quantity) }
        });
        return new Response(JSON.stringify(updatedItem), { status: 200 });
    } catch (error) {
        console.error("Error updating item:", error);
        return new Response(JSON.stringify({ error: "Failed to update item" }), { status: 500 });
    }
}