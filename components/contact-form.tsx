"use client";
import clsx from "clsx";
// import { useFormState } from "react-dom";
// import { ContactMessage } from "@/lib/actions";
// import { ContactButton } from "@/components/button";

const ContactForm = () => {
  //   const [state, formAction] = useFormState(ContactMessage, null);
  return (
    <div className="border border-white/10 bg-white/5 p-8">
      {/* Alert */}
      {/* {state?.message ? (
        <div
          className="p-4 mb-4 text-sm text-gray-800 rounded-lg bg-green-50"
          role="alert"
        >
          <div className="font-medium">{state?.message}</div>
        </div>
      ) : null} */}
      {/* End Alert */}
      <form action="">
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <input
              type="text"
              name="name"
              className="w-full rounded-sm bg-white/5 p-3 text-sm text-white placeholder:text-white/40
                         border border-white/10 focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="Name*"
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-300 mt-2"></p>
            </div>
          </div>
          <div>
            <input
              type="email"
              name="email"
              className="w-full rounded-sm bg-white/5 p-3 text-sm text-white placeholder:text-white/40
                         border border-white/10 focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="johndoe@example.com*"
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-300 mt-2"></p>
            </div>
          </div>
          <div className="md:col-span-2">
            <input
              type="text"
              name="subject"
              className="w-full rounded-sm bg-white/5 p-3 text-sm text-white placeholder:text-white/40
                         border border-white/10 focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="Subject*"
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-300 mt-2">
                {/* {state?.error?.subject} */}
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <textarea
              name="message"
              rows={5}
              className="w-full rounded-sm bg-white/5 p-3 text-sm text-white placeholder:text-white/40
                         border border-white/10 focus:outline-none focus:ring-2 focus:ring-km-brass/60"
              placeholder="Your message*"
            ></textarea>
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-300 mt-2">
                {/* {state?.error?.message} */}
              </p>
            </div>
          </div>
        </div>
        {/* button submit */}
        <button
          type="submit"
          className={clsx(
            "mt-6 w-full rounded-sm px-10 py-4 text-center text-sm font-semibold bg-km-brass text-km-wood",
            "ring-1 ring-white/20 hover:opacity-90 transition"
            // {
            //   "opacity-50 cursor-progress animate-pulse": pending,
            // }
          )}
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
