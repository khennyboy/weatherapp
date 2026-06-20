import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import StaffList from "../components/deleteData";
import UserList from "../components/UserList";
import { fetchData } from "../services/fetchData";
import type { Department, Resource, User } from "../utils/types";



const departments: Department[] = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
  { id: 3, name: "Design" },
];

export default function Homepage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedDept, setSelectedDept] = useState<number>(
    departments.find((d) => d.name === searchParams.get("department"))?.id || 1,
  );

  const [resource, setResource] = useState<Resource<User[]>>(
    fetchData<User[]>(`/api/users?departmentId=${selectedDept}`),
  );

  const [isPending, startTransition] = useTransition();

  function handleDepartmentChange(deptId: number): void {
    const dept = departments.find((d) => d.id === deptId);
    const url = `/api/users?departmentId=${deptId}`;
    const newResource = fetchData<User[]>(url);
    setSearchParams({ department: dept?.name as string });
    startTransition(() => {
      setSelectedDept(deptId);
      setResource(newResource);
    });
  }

  const refreshUsers = useCallback(() => {
    const url = `/api/users?departmentId=${selectedDept}`;
    const newResource = fetchData<User[]>(url);
    startTransition(() => {
      setResource(newResource);
    });
  }, [selectedDept]);

  useEffect(() => {
    if (location.state?.refresh) {
      refreshUsers();
    }
  }, [location.state?.refresh, refreshUsers]);

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Company Directory
          </h1>
          <p className="mt-1 text-slate-400">Browse employees by department</p>
        </div>

        <div className="mb-6 flex gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
          {departments.map((dept) => {
            const isActive = selectedDept === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => handleDepartmentChange(dept.id)}
                disabled={isActive}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm shadow-teal-900"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {dept.name}
              </button>
            );
          })}
        </div>

        {isPending && (
          <p className="mb-4 text-sm text-teal-400/80">
            ⏳ Loading department...
          </p>
        )}

        <Suspense
          fallback={
            <p className="py-10 text-center text-sm text-slate-500">
              ⏳ Loading employees...
            </p>
          }
        >
          <UserList resource={resource} />
        </Suspense>

        <div className="mt-10 flex justify-end">
          <Link
            to="/addStaff"
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 active:scale-95"
          >
            + Add Staff
          </Link>
        </div>
      </div>
      <Suspense
        fallback={
          <p className="py-10 text-center text-sm text-slate-500">
            ⏳ Loading staff list
          </p>
        }
      >
        <StaffList staff={resource} />
      </Suspense>
    </div>
  );
}
