import CardSkeleton from "@/components/skeletons/card-skeleton";

const produkSkeleton = () => {
  return (
    <div className="max-w-none py-6 pb-20 px-4 mx-auto">
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

export default produkSkeleton;
