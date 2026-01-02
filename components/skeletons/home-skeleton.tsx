import CardSkeleton from "@/components/skeletons/card-skeleton";

const HomeSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 md:px-6 py-6 pb-16">
      <div className="grid gap-6 md:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
};

export default HomeSkeleton;
