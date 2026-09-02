export default function ProductSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[.76] bg-fitique-paper" />
          <div className="mt-3 h-3 w-2/5 bg-fitique-lilac" />
          <div className="mt-2 h-4 w-4/5 bg-fitique-sand" />
          <div className="mt-2 h-3 w-1/3 bg-fitique-paper" />
        </div>
      ))}
    </div>
  );
}
