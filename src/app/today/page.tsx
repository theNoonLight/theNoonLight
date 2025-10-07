import TodayClient from "@/components/TodayClient";

export const dynamic = "force-dynamic";

export default function TodayPage() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Today&apos;s Puzzle</h1>
      <TodayClient />
    </main>
  );
}
