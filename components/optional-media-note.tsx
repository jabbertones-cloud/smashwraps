/**
 * Optional v2: replace hero with lifestyle / macro video or short loop.
 */
export function OptionalMediaNote() {
  return (
    <p className="mt-4 text-[11px] text-zinc-600">
      <span className="text-zinc-500">Product art:</span> Pack shots and chop renders live in{" "}
      <code className="text-zinc-400">public/images/</code>. Replace any file to update the
      site — filenames must stay the same (see{" "}
      <code className="text-zinc-400">ASSET-FILENAMES.txt</code>).
    </p>
  );
}
