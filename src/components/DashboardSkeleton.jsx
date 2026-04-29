function SkeletonBlock({ className }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[320px_1fr]">
      <aside className="min-h-screen border-r border-slate-200 bg-white/80 px-5 py-6">
        <SkeletonBlock className="h-14 w-40" />
        <SkeletonBlock className="mt-8 h-28 w-full rounded-3xl" />
        <div className="mt-6 space-y-3">
          <SkeletonBlock className="h-24 w-full rounded-3xl" />
          <SkeletonBlock className="h-24 w-full rounded-3xl" />
          <SkeletonBlock className="h-24 w-full rounded-3xl" />
        </div>
        <SkeletonBlock className="mt-6 h-12 w-full" />
      </aside>

      <main className="p-6 lg:p-8">
        <div className="rounded-[36px] border border-slate-200 bg-white/92 p-6 shadow-xl shadow-slate-200/80 backdrop-blur-xl">
          <div className="border-b border-slate-200 pb-6">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="mt-4 h-12 w-96 max-w-full" />
            <SkeletonBlock className="mt-3 h-4 w-full max-w-3xl" />
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-5">
              <div className="rounded-[30px] border border-slate-200 bg-white p-6">
                <div className="grid gap-4 lg:grid-cols-3">
                  <SkeletonBlock className="h-32 w-full" />
                  <SkeletonBlock className="h-32 w-full" />
                  <SkeletonBlock className="h-32 w-full" />
                </div>
                <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                  <SkeletonBlock className="h-72 w-full" />
                  <SkeletonBlock className="h-72 w-full" />
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                <SkeletonBlock className="h-72 w-full rounded-[28px]" />
                <SkeletonBlock className="h-72 w-full rounded-[28px]" />
                <SkeletonBlock className="h-72 w-full rounded-[28px]" />
              </div>
              <div className="rounded-[30px] border border-slate-200 bg-white p-6">
                <div className="grid gap-4 xl:grid-cols-3">
                  <SkeletonBlock className="h-80 w-full rounded-[28px]" />
                  <SkeletonBlock className="h-80 w-full rounded-[28px]" />
                  <SkeletonBlock className="h-80 w-full rounded-[28px]" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <SkeletonBlock className="h-80 w-full rounded-[30px]" />
              <SkeletonBlock className="h-96 w-full rounded-[30px]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardSkeleton;
