import InventoryLists from "./components/InventoryLists";

export default function HomePage() {
  return (
      <main className="min-h-screen p-8 bg-black-50">
        {/* This renders your custom component */}
        <InventoryLists />
      </main>
  );
}