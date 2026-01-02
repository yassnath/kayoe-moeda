const CardSkeleton = () => {
  return (
    <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-md animate-pulse overflow-hidden">
      <div className="h-[220px] w-full bg-black/[0.06]" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-3/4 rounded bg-black/[0.06]" />
        <div className="h-4 w-full rounded bg-black/[0.06]" />
        <div className="h-4 w-2/3 rounded bg-black/[0.06]" />

        <div className="pt-2 flex items-center justify-between">
          <div className="h-5 w-28 rounded bg-black/[0.06]" />
          <div className="h-4 w-16 rounded bg-black/[0.06]" />
        </div>

        <div className="h-10 w-full rounded-2xl bg-black/[0.08]" />
      </div>
    </div>
  );
};

export default CardSkeleton;
