import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request:Request) {
    try {
        const { searchParams } = new URL(request.url);
        const itemId = searchParams.get("id");

        if (!itemId) {
            return new Response ("Missing item ID", { status: 400 });
        }

        await prisma.item.update({
            where: { id: Number(itemId) },
            data: { isReordered: true }
        });

        return new Response(`
            <html>
                <body style="background-color: #f3f4f6; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
                    <div style="background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center;">
                        <h1 style="color: #16a34a; margin-bottom: 10px;">✅ Alarm Muted!</h1>
                        <p style="color: #4b5563; font-size: 18px;">The item has been marked as reordered.</p>
                        <p style="color: #9ca3af; margin-top: 20px;">You can safely close this window.</p>
                    </div>
                </body>
            </html>
        `, { 
            status: 200, 
            headers: { 'Content-Type': 'text/html' } 
        });

    } catch (error) {
        console.error("Error muting alarm:", error);
        return new Response("Failed to mute alarm", { status: 500 });
    }
}
