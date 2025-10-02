export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const res = await fetch("/api/today", { cache: "no-store" });
  const data = await res.json();

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Today’s Puzzle</h1>
      {!data?.available ? (
        <p className="text-gray-500">Come back at noon PT for the drop.</p>
      ) : (
        <>
          <h2 className="text-xl font-medium">{data.puzzle.title}</h2>
          <p className="text-gray-700 mb-4">{data.puzzle.summary}</p>
          <a className="inline-block rounded border px-4 py-2" href={data.puzzle.downloadUrl}>
            Download Puzzle (.zip)
          </a>
        </>
      )}
    </main>
  );
}
