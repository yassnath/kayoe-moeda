import Image from "next/image";

const TitleSection = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  return (
    <section className="relative w-full overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Background Image"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061610] via-[#0b2a22]/80 to-transparent" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-6 py-20">
        <p className="text-xs uppercase tracking-[0.32em] text-white/55">
          {subTitle}
        </p>
        <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight text-white">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default TitleSection;
