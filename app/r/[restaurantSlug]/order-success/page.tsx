export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 text-center text-xs">
        <h1 className="text-lg font-semibold">Order received</h1>
        <p className="mt-2 text-[11px] text-zinc-400">
          Thank you. The restaurant has received your order and will begin
          preparing it shortly.
        </p>
      </div>
    </div>
  );
}


