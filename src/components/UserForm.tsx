import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Userschema } from "../utils/Uschema";
import type { User } from "../utils/types";
import { AddData } from "../services/addData";

type TUserSchema = z.infer<typeof Userschema>;
interface Props {
  onUserAdded: () => void;
}

const UserForm = ({ onUserAdded }: Props) => {
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
      onUserAdded();
    } catch (error) {
      alert("Failed: " + error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" placeholder="name" {...register("name")} />
        </div>
        <div>
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
        <div>
          <input type="email" {...register("email")} placeholder="Email" />
        </div>

        <button
          type="submit"
          className="disabled:cursor-not-allowed cursor-pointer"
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserForm;
