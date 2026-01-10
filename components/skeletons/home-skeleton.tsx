import CardSkeleton from "@/components/skeletons/card-skeleton";

const HomeSkeleton = () => {
  return (
    <div className="mx-auto w-full max-w-none px-4 md:px-6 py-6 pb-16">
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
