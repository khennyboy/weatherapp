import { useOptimistic, useTransition } from "react";
import { delay } from "../utils/delay";
import type { Resource, User } from "../utils/types";

function StaffList({
  staff,
  onDeleted,
}: {
  staff: Resource<User[]>;
  onDeleted: () => void;
}) {
  const users: User[] = staff.read();
  const [isPending, startTransition] = useTransition();
  const [optimisticStaff, removeOptimistic] = useOptimistic(
    users,
    (current, idToRemove: string) =>
      current.filter((person) => person.id !== idToRemove),
  );

  function handleDelete(id: string) {
    startTransition(async () => {
      removeOptimistic(id);
      await delay(2000);
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        onDeleted();
      }
    });
  }

  return (
    <div className="mx-auto mt-10 max-w-3xl">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Staff
      </h2>
      <ul className="divide-y divide-slate-800 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-sm">
        {optimisticStaff.length === 0 && (
          <li className="px-4 py-6 text-center text-sm text-slate-500">
            No staff members left.
          </li>
        )}
        {optimisticStaff.map((person) => {
          return (
            <li
              key={person.id}
              className={`flex items-center justify-between px-4 py-3 transition-opacity duration-200 ${
                isPending ? "opacity-60" : "opacity-100"
              }`}
            >
              <span className="text-sm font-medium text-slate-100">
                {person.name}
              </span>
              <button
                onClick={() => handleDelete(person.id as string)}
                className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300 disabled:cursor-not-allowed disabled:text-slate-600 disabled:hover:bg-transparent"
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default StaffList;
