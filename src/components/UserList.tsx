import type { Resource, User } from "../utils/types";

interface Props {
  resource: Resource<User[]>;
}

export default function UserList({ resource }: Props) {
  const users: User[] = resource.read();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-teal-700 hover:bg-slate-900"
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-600/20 text-lg font-bold text-teal-400 ring-1 ring-teal-500/30">
              {user.name.charAt(0)}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {user.name}
              </h3>

              <p className="mt-1 inline-flex rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-teal-300">
                {user.role}
              </p>

              <p className="mt-3 text-sm text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>
      ))}

      {/* Empty state */}
      {users.length === 0 && (
        <div className="col-span-full rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
          <p className="text-sm text-slate-400">
            No employees found for this department.
          </p>
        </div>
      )}
    </div>
  );
}
