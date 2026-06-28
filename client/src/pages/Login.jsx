import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const login = async () => {

    try {

        const res = await api.post("/login", {
            email,
            password,
        });

        localStorage.setItem(
            "token",
            res.data.token
        );

        // Ambil data user dari backend
        const userRes = await api.get("/user", {
            headers: {
                Authorization: `Bearer ${res.data.token}`
            }
        });

        localStorage.setItem(
            "user",
            JSON.stringify(userRes.data)
        );

        navigate("/dashboard");

    } catch (err) {

        alert("Email atau Password salah");

    }

    };

    return (

        <div className="min-h-screen bg-slate-100 flex justify-center items-center">

            <div className="bg-white p-10 rounded-xl shadow-xl w-[420px]">

                <h1 className="text-4xl font-bold text-center text-blue-600">

                    SyncDocs

                </h1>

                <p className="text-center text-gray-500 mt-2">

                    Productivity Apps

                </p>

                <div className="mt-8">

                    <input
                        className="border w-full rounded-lg p-3 mb-4"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="border w-full rounded-lg p-3"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={login}
                        className="bg-blue-600 w-full text-white rounded-lg py-3 mt-6"
                    >
                        Login
                    </button>

                    <p className="text-center mt-5">

                        Belum punya akun?

                        <Link className="text-blue-600 ml-2" to="/register">

                            Daftar

                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );

}