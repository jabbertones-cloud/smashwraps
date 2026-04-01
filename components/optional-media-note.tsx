/**
 * Optional v2: replace hero with lifestyle / macro video or short loop.
 * See plan todo content-media.
 */
export function OptionalMediaNote() {
  return (
    <p className="mt-4 text-[11px] text-zinc-600">
      <span className="text-zinc-500">Media note:</span> Hero uses{" "}
      <code className="text-zinc-400">AllCaseBoxesChops.png</code> in{" "}
      <code className="text-zinc-400">public/images/</code>. Replace the committed
      placeholder PNG with your final art (same filename).
    </p>
  );
}
