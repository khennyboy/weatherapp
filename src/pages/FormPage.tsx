import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Userschema } from "../utils/Uschema";
import type { User } from "../utils/types";
import { AddData } from "../services/addData";
import { Link, useNavigate } from "react-router-dom";

type TUserSchema = z.infer<typeof Userschema>;

const UserForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TUserSchema>({
    resolver: zodResolver(Userschema),
  });

  async function onSubmit(data: TUserSchema) {
    const userInput: User = { ...data, departmentId: null };
    if (["Frontend Dev", "Backend Dev", "DevOps"].includes(userInput.role)) {
      userInput.departmentId = 1;
    } else if (["UI Designer", "Brand Designer"].includes(userInput.role)) {
      userInput.departmentId = 2;
    } else {
      userInput.departmentId = 3;
    }

    try {
      await AddData("http://localhost:3001/users", userInput);
      alert("User added successfully!");
      navigate("/", { state: { refresh: true } });
    } catch (error) {
      alert("Failed: " + error);
    }
  }

  const labelClass = "block mb-1.5 text-sm font-medium text-slate-300";
  const inputClass =
    "w-full  rounded-lg border border-slate-700 bg-slate-800/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-md ">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-teal-400"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Add new staff
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Fill in the details below to onboard a team member.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className={labelClass}>Full name</label>
              <input
                type="text"
                placeholder="e.g. Chidi Okeke"
                className={inputClass}
                {...register("name")}
              />
            </div>

            <div>
              <label className={labelClass}>Role</label>
              <select className={inputClass} {...register("role")}>
                <option value="Frontend Dev">Frontend Dev</option>
                <option value="Backend Dev">Backend Dev</option>
                <option value="UI Designer">UI Designer</option>
                <option value="Marketing Lead">Marketing Lead</option>
                <option value="DevOps">DevOps</option>
                <option value="Brand Designer">Brand Designer</option>
                <option value="SEO Specialist">SEO Specialist</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Email address</label>
              <input
                type="email"
                placeholder="name@company.io"
                className={inputClass}
                {...register("email")}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Adding..." : "Add staff member"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
