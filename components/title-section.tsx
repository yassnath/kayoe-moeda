import Image from "next/image";

const TitleSection = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  return (
    <section className="relative w-full overflow-hidden border-b border-km-line bg-[var(--km-bg)]">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Background Image"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white/70" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 md:px-6 py-16">
        <p className="text-xs uppercase tracking-[0.32em] text-km-ink/50">
          {subTitle}
        </p>
        <h1 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight text-km-ink">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default TitleSection;
