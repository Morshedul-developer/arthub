"use client";

export default function Error({ reset }) {
  return (
    <section className="section">
      <div className="card mx-auto max-w-xl p-8 text-center">
        <h1 className="text-3xl font-black">Something went wrong</h1>
        <p className="mt-2 text-stone-600">Reload the page or try again.</p>
        <button className="btn btn-dark mt-6" onClick={reset}>Reload</button>
      </div>
    </section>
  );
}
