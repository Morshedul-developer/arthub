import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="card mx-auto max-w-xl p-8 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-amber-100 text-4xl">404</div>
        <h1 className="mt-6 text-3xl font-black">Page Not Found</h1>
        <p className="mt-2 text-stone-600">The page you are looking for does not exist.</p>
        <Link href="/" className="btn btn-dark mt-6">Go Home</Link>
      </div>
    </section>
  );
}
