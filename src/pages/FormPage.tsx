import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Userschema } from "../utils/Uschema";
import type { User } from "../utils/types";
import { AddData } from "../services/addData";
import { useNavigate } from "react-router-dom";

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
    console.log(data);
    const userInput: User = { ...data, departmentId: null };
    if (
      userInput.role === "Frontend Dev" ||
      userInput.role === "Backend Dev" ||
      userInput.role === "DevOps"
    ) {
      userInput.departmentId = 1;
    } else if (
      userInput.role === "UI Designer" ||
      userInput.role === "Brand Designer"
    ) {
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

  return (
    <div className="form-page">
      <h2>Add new staff</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label>Full name</label>
          <input
            type="text"
            placeholder="e.g. Chidi Okeke"
            {...register("name")}
          />
        </div>
        <div className="field">
          <label>Role</label>
          <select {...register("role")}>
            <option value="Frontend Dev">Frontend Dev</option>
            <option value="Backend Dev">Backend Dev</option>
            <option value="UI Designer">UI Designer</option>
            <option value="Marketing Lead">Marketing Lead</option>
            <option value="DevOps">DevOps</option>
            <option value="Brand Designer">Brand Designer</option>
            <option value="SEO Specialist">SEO Specialist</option>
          </select>
        </div>
        <div className="field">
          <label>Email address</label>
          <input
            type="email"
            placeholder="name@company.io"
            {...register("email")}
          />
        </div>
        <button type="submit" className="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add staff member"}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
