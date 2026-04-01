import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-32 text-center">
      <h1 className="font-display text-4xl text-white">Page not found</h1>
      <p className="mt-4 text-zinc-400">
        That URL does not exist. Try the shop or home.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-smash-yellow underline hover:text-yellow-300"
      >
        Back home
      </Link>
    </div>
  );
}
