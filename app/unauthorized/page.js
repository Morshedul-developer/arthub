import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <section className="section">
      <div className="card mx-auto max-w-xl p-8 text-center">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-rose-100 text-4xl">403</div>
        <h1 className="mt-6 text-3xl font-black">Not Authorized</h1>
        <p className="mt-2 text-stone-600">You don&apos;t have access to this dashboard.</p>
        <Link href="/" className="btn btn-dark mt-6">Go Home</Link>
      </div>
    </section>
  );
}
