const CardSkeleton = () => {
  return (
    <div className="rounded-3xl border border-km-line bg-white p-4 shadow-soft animate-pulse">
      <div className="h-36 rounded-2xl bg-km-surface-alt" />
      <div className="mt-4 h-4 w-3/4 rounded-full bg-km-surface-alt" />
      <div className="mt-2 h-3 w-1/2 rounded-full bg-km-surface-alt" />
      <div className="mt-4 h-9 w-full rounded-full bg-km-surface-alt" />
    </div>
  );
};

export default CardSkeleton;
