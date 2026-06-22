import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserForm from "./pages/FormPage";
import Homepage from "./pages/Homepage";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/addStaff" element={<UserForm />} />
      </Routes>
    </BrowserRouter>
  );
}
