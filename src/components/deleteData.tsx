import { useOptimistic, useTransition } from "react";
import type { Resource, User } from "../utils/types";

function StaffList({ staff }: { staff: Resource<User[]> }) {
  const users: User[] = staff.read();
  const [isPending, startTransition] = useTransition();
  const [optimisticStaff, removeOptimistic] = useOptimistic(
    users,
    (current, idToRemove: string) =>
      current.filter((person) => person.id !== idToRemove),
  );

  function handleDelete(id: string) {
    console.log(id);
    startTransition(async () => {
      removeOptimistic(id);
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      console.log(res);
      const data = await res.json();
      console.log(data);
    });
  }

  return (
    <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white shadow-sm">
      {optimisticStaff.map((person) => (
        <li
          key={person.id}
          className={`flex items-center justify-between px-4 py-3 transition-opacity duration-200 ${
            isPending ? "opacity-60" : "opacity-100"
          }`}
        >
          <span className="text-sm font-medium text-gray-900">
            {person.name}
          </span>
          <button
            onClick={() => handleDelete(person.id as string)}
            disabled={isPending}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

export default StaffList;
