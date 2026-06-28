import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, User, Mail } from "lucide-react";

export default function Navbar() {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };

    return (

        <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">

            <h1 className="text-2xl font-bold text-blue-600">
                CollabDocs
            </h1>

            <div className="relative">

                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl"
                >

                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                        {user?.name?.charAt(0).toUpperCase()}

                    </div>

                    <span className="font-medium">

                        {user?.name}

                    </span>

                    <ChevronDown size={18} />

                </button>

                {open && (

                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border overflow-hidden z-50">

                        <div className="p-5">

                            <div className="flex items-center gap-3">

                                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">

                                    {user?.name?.charAt(0).toUpperCase()}

                                </div>

                                <div>

                                    <div className="font-bold">

                                        {user?.name}

                                    </div>

                                    <div className="text-sm text-gray-500">

                                        {user?.email}

                                    </div>

                                </div>

                            </div>

                        </div>

                        <hr />

                        <button
                            onClick={logout}
                            className="flex items-center gap-3 w-full px-5 py-4 hover:bg-red-50 text-red-600"
                        >

                            <LogOut size={18} />

                            Logout

                        </button>

                    </div>

                )}

            </div>

        </nav>

    );

}