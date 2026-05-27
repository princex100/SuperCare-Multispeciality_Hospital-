import React, { useContext, useState } from "react";
import axios from "axios";
import { DoctorContext } from "../context/DoctorContext";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DoctorLogin = () => {

  const navigate = useNavigate();

  const { backendUrl } = useContext(AppContext);
  const { setDToken } = useContext(DoctorContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      const { data } = await axios.post(
  backendUrl + "/api/doctor/login",
  {
    email,
    password
  }
);

if (!data.success) {
  toast.error(data.message);
  return;
}

localStorage.setItem("dToken", data.token);
setDToken(data.token);

toast.success("Doctor Login Successful");

navigate("/doctor-dashboard");

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">

      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white border rounded-2xl shadow-md p-8"
      >

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Doctor Login
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Access your dashboard
        </p>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter email"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            className="w-full border rounded-lg px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default DoctorLogin;
