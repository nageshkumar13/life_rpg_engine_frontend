export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="panel h-32 animate-pulse bg-white/[0.03]" />
      ))}
    </div>
  );
}
