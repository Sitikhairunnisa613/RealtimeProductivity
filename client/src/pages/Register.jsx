import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Register Berhasil");

      navigate("/dashboard");

    } catch (error) {
      console.log(error.response);

      if (error.response?.data?.errors) {
        alert(Object.values(error.response.data.errors)[0][0]);
      } else {
        alert("Register gagal");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">

      <div className="bg-white shadow-xl rounded-xl p-10 w-[420px]">

        <h1 className="text-4xl font-bold text-center text-blue-600">
          SyncDocs
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Create Account
        </p>

        <div className="mt-8">

          <input
            className="border w-full rounded-lg p-3 mb-4"
            placeholder="Nama"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border w-full rounded-lg p-3 mb-4"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border w-full rounded-lg p-3"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={register}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full rounded-lg py-3 mt-6"
          >
            Register
          </button>

          <p className="text-center mt-5">

            Sudah punya akun?

            <Link
              className="text-blue-600 ml-2"
              to="/"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}