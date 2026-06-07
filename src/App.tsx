import { Suspense, useState, useTransition } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import UserList from "./components/UserList";
import { fetchData } from "./services/fetchData";
import type { Department, Resource, User } from "./utils/types";

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="error-box">
      <p>⚠️ Something went wrong</p>
      <p className="error-detail">
        {error instanceof Error ? error.message : "Unknown error"}
      </p>
      <p className="error-hint">
        Make sure json-server is running on port 3001
      </p>
    </div>
  );
}

// The departments list (same as what is in db.json)
const departments: Department[] = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
  { id: 3, name: "Design" },
];

const initialResource: Resource<User[]> = fetchData<User[]>(
  "/api/users?departmentId=1",
);

export default function App() {
  const [resource, setResource] = useState<Resource<User[]>>(initialResource);

  const [selectedDept, setSelectedDept] = useState<number>(1);

  const [isPending, startTransition] = useTransition();

  function handleDepartmentChange(deptId: number): void {
    const url = `/api/users?departmentId=${deptId}`;

    const newResource = fetchData<User[]>(url);

    startTransition(() => {
      setSelectedDept(deptId);
      setResource(newResource);
    });
  }

  return (
    <div className="app">
      <h1>Company Directory</h1>
      <p className="subtitle">Browse employees by department</p>

      {/* Department filter buttons */}
      <div className="dept-buttons">
        {departments.map((dept) => {
          const isCurrent =
            new URL(window.location.href).searchParams.get("department") ==
            dept.name;
          return (
            <button
              key={dept.id}
              onClick={() => {
                handleDepartmentChange(dept.id);
              }}
              disabled={isCurrent}
              className={selectedDept === dept.id ? "active" : ""}
            >
              {dept.name}
            </button>
          );
        })}
      </div>

      {/* isPending indicator — shows while new data loads without hiding old UI */}
      {isPending && <p className="pending-msg">⏳ Loading department...</p>}

      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<p className="loading">⏳ Loading employees...</p>}>
          <UserList resource={resource} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
