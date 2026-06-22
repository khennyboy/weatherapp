import type { FallbackProps } from "react-error-boundary";

export default function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-red-800/50 bg-red-950/30 px-6 py-5 text-sm">
      <p className="font-semibold text-red-400">⚠️ Something went wrong</p>
      <p className="mt-1 text-red-400">
        {error instanceof Error ? error.message : "Unknown error"}
      </p>
      <p className="mt-3 text-slate-500">
        Make sure json-server is running on port 3001
      </p>
    </div>
  );
}
