"use client";
import { useState } from "react";
import clsx from "clsx";

const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setMessage(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const requiredFields = ["name", "email", "subject", "message"];
    const missing = requiredFields.some(
      (key) => !String(data.get(key) || "").trim()
    );

    if (missing) {
      setStatus("error");
      setMessage("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }

    setStatus("success");
    setMessage("Pesan berhasil dikirim. Kami akan segera menghubungi Anda.");
    form.reset();
  };

  return (
    <div className="rounded-3xl border border-km-line bg-white p-8 shadow-soft">
      {message && (
        <div
          className={clsx(
            "mb-5 rounded-2xl border px-4 py-3 text-sm",
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          )}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold text-km-ink">Name</label>
            <input
              type="text"
              name="name"
              className="mt-2 w-full rounded-2xl border border-km-line bg-white p-3 text-sm text-km-ink
                         placeholder:text-km-ink/50 focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="Name*"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-km-ink">Email</label>
            <input
              type="email"
              name="email"
              className="mt-2 w-full rounded-2xl border border-km-line bg-white p-3 text-sm text-km-ink
                         placeholder:text-km-ink/50 focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="johndoe@example.com*"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-km-ink">Subject</label>
            <input
              type="text"
              name="subject"
              className="mt-2 w-full rounded-2xl border border-km-line bg-white p-3 text-sm text-km-ink
                         placeholder:text-km-ink/50 focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="Subject*"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-km-ink">Message</label>
            <textarea
              name="message"
              rows={5}
              className="mt-2 w-full rounded-2xl border border-km-line bg-white p-3 text-sm text-km-ink
                         placeholder:text-km-ink/50 focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="Your message*"
            ></textarea>
          </div>
        </div>

        <button
          type="submit"
          className={clsx(
            "mt-6 w-full rounded-2xl px-6 py-3 text-sm font-semibold",
            "bg-km-wood text-white ring-1 ring-km-wood hover:opacity-90 transition"
          )}
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
