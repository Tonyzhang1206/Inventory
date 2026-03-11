import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import next from 'next';
import { Resend} from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

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
        const { id, name, category, quantity , threshold} = body;

        const updateData: any = {}; // create an object to only the things that are being updated

        // Only add fields to updateData if they are provided in the request
        if (name !== undefined) updateData.name = name;
        if (category !== undefined) updateData.category = category;
        if (quantity !== undefined) updateData.quantity = Number(quantity);
        if (threshold !== undefined) updateData.threshold = Number(threshold);

        //update the item in the database
        const updatedItem = await prisma.item.update({
            where: { id: Number(id) },
            data: updateData
        });

        console.log("---Alarm check");
        console.log(`Item: ${updatedItem.name} | Qty: ${updatedItem.quantity} | Threshold: ${updatedItem.threshold}`);
        console.log(`Is Reordered?: ${updatedItem.isReordered}`);

        // ==========================================
        // 🚨 THE LOW STOCK ALARM SYSTEM
        // ==========================================
        if (updatedItem.quantity <= updatedItem.threshold) {
            if (updatedItem.isReordered === false) {
try {
                    const { data, error } = await resend.emails.send({
                        from: 'onboarding@resend.dev', 
                        to: 'tonyzhang122001@gmail.com', // 👉 KEEP YOUR ACTUAL EMAIL HERE
                        subject: `🚨 Low Stock Alert: ${updatedItem.name}`,
                        html: `
                            <div style="font-family: sans-serif; padding: 20px;">
                                <h2 style="color: #d97706;">Low Stock Warning</h2>
                                <p>Your inventory for <strong>${updatedItem.name}</strong> has dropped to <strong>${updatedItem.quantity}</strong>.</p>
                                <p>It's time to reorder!</p>
                                <br/>
                                <a href="http://localhost:3000/api/reorder?id=${updatedItem.id}" style="background-color: #2563eb; color: white; padding: 10px 18px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    I Ordered It (Mute Alarm)
                                </a>
                            </div>
                        `
                    });

                    // 👉 If Resend returns an error, print it loud and clear!
                    if (error) {
                        console.error("❌ RESEND REJECTED THE EMAIL:", error);
                    } else {
                        console.log("✅ EMAIL ACTUALLY SENT! ID:", data);
                    }

                } catch (emailError) {
                    console.error("❌ FATAL EMAIL CRASH:", emailError);
                }
            }
        }
        // ==========================================

        return new Response(JSON.stringify(updatedItem), { status: 200 });
    } catch (error) {
        console.error("Error updating item:", error);
        return new Response(JSON.stringify({ error: "Failed to update item" }), { status: 500 });
    }
}