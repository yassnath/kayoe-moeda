import Image from "next/image";

const TitleSection = ({
  title,
  subTitle,
}: {
  title: string;
  subTitle: string;
}) => {
  return (
    <div className="relative h-60 overflow-hidden rounded-3xl ring-1 ring-km-line">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="Background Image"
          fill
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-km-cream/85 via-km-sand/80 to-km-brass/70"></div>
      </div>
      <div className="relative flex flex-col justify-center items-center h-60 text-center pt-14">
        <div className="rounded-2xl km-tile px-6 py-4">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight capitalize text-km-ink">
            {title}
          </h1>
          <p className="text-lg text-km-ink/70">{subTitle}</p>
        </div>
      </div>
    </div>
  );
};

export default TitleSection;
