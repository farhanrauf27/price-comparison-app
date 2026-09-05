export default function LoadingSkeleton() {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm animate-pulse">
      <div className="aspect-square w-full rounded-lg bg-slate-200" />
      <div className="mt-4 space-y-3">
        <div className="h-3 w-1/4 rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200 pt-2" />
      </div>
    </div>
  );
}