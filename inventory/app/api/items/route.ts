import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const items = await prisma.item.findMany(); // Fetch all items from the database
        return new Response(JSON.stringify(items), { status: 200 });
    } catch (error) {
        console.error("Error fetching items:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch items" }), { status: 500 });
    }
}

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