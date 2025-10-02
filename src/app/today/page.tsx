import { createClient } from "@supabase/supabase-js";

const BUCKET = "puzzles";

export default async function TodayPage() {
  const supa = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // MVP: latest published puzzle
  const { data: rows, error } = await supa
    .from("puzzles")
    .select("*")
    .eq("published", true)
    .order("date_utc", { ascending: false })
    .limit(1);

  if (error || !rows?.length) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Today&apos;s Puzzle</h1>
        <p className="text-gray-500">Come back at noon PT for the drop.</p>
      </main>
    );
  }

  const p = rows[0];

  const { data: signed, error: signErr } = await supa.storage
    .from(BUCKET)
    .createSignedUrl(p.storage_path, 300); // 5 min

  if (signErr || !signed?.signedUrl) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <h1 className="text-2xl font-semibold mb-4">Today&apos;s Puzzle</h1>
        <p className="text-gray-500">Come back at noon PT for the drop.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Today&apos;s Puzzle</h1>
      <h2 className="text-xl font-medium">{p.title}</h2>
      <p className="text-gray-700 mb-4">{p.summary}</p>
      <a className="inline-block rounded border px-4 py-2" href={signed.signedUrl}>
        Download Puzzle (.zip)
      </a>
    </main>
  );
}
  