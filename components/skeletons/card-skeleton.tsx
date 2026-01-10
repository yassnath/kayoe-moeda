const CardSkeleton = () => {
  return (
    <div className="relative min-h-[240px] sm:min-h-[320px] lg:min-h-[360px] bg-white/5 ring-1 ring-white/10 animate-pulse overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/10 to-white/20" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
        <div className="h-3 w-24 rounded bg-white/20" />
        <div className="h-5 w-2/3 rounded bg-white/20" />
        <div className="h-4 w-1/2 rounded bg-white/15" />
      </div>
    </div>
  );
};

export default CardSkeleton;
