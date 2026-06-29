import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DocumentCard from "../components/DocumentCard";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

export default function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [sharedDocuments, setSharedDocuments] = useState([]);
    const [search, setSearch] = useState("");

    // ==========================
    // Load My Documents
    // ==========================

    const loadDocuments = async () => {

    try {

        const res = await api.get("/documents");

        setDocuments(res.data);

    } catch (err) {
    console.log(err);
    console.log(err.response);
    console.log(err.response?.data);

    toast.error("Gagal membuat dokumen");
    }

};

    // ==========================
    // Load Shared Documents
    // ==========================

    const loadSharedDocuments = async () => {

    try {

        const res = await api.get("/shared-documents");

        setSharedDocuments(res.data);

    } catch (err) {

        console.log(err);

        toast.error("Gagal memuat shared document");

    }

};

    // ==========================
    // Create Document
    // ==========================

    const createDocument = async () => {
    try {

        const res = await api.post("/documents");

        console.log("SUCCESS", res.data);

        loadDocuments();

        toast.success("Dokumen berhasil dibuat");

    } catch (err) {

        console.log("ERROR");
        console.log(err);
        console.log(err.response);
        console.log(err.response?.status);
        console.log(err.response?.data);

        toast.error("Gagal membuat dokumen");
    }
};

    // ==========================
    // Delete Document
    // ==========================

    const deleteDocument = async (id) => {

    const confirmDelete = window.confirm(
        "Yakin ingin menghapus dokumen?"
    );

    if (!confirmDelete) return;

    try {

        await api.delete(`/documents/${id}`);

        loadDocuments();

        toast.success("Dokumen berhasil dihapus");

    } catch (err) {

        console.log(err);

        toast.error("Gagal menghapus dokumen");

    }

};

    // ==========================
    // First Load
    // ==========================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {

            navigate("/");

            return;

        }

        const userData = JSON.parse(
            localStorage.getItem("user")
        );

        setUser(userData);

        loadDocuments();

        loadSharedDocuments();

    }, []);

    // ==========================
    // Search
    // ==========================

    const filteredDocuments = documents.filter((doc) =>
        doc.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const filteredSharedDocuments = sharedDocuments.filter((doc) =>
        doc.title
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (

        <>
            <Toaster position="top-right" />
            <Navbar />

            <div className="max-w-7xl mx-auto mt-10 px-6">

                <div className="flex justify-between items-center mb-10">

                    <div>

                        <h1 className="text-3xl font-bold">

                            Dashboard

                        </h1>

                        <p className="text-gray-500 mt-2">

                            <div className="grid grid-cols-3 gap-5 mt-8 mb-10">

                            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center">
                        <p className="text-gray-500 text-sm">My Documents</p>

                            <h2 className="text-4xl font-bold text-blue-600 mt-3">
                                {documents.length}
                        </h2>
                    </div>

                            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center">
                        <p className="text-gray-500 text-sm">Shared With Me</p>

                        <h2 className="text-4xl font-bold text-green-600 mt-3">
                                 {sharedDocuments.length}
                        </h2>
                    </div>

                            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 text-center">
                        <p className="text-gray-500 text-sm">User</p>

                        <h2 className="text-2xl font-bold mt-3">
                                {user?.name}
                        </h2>
                    </div>

                    </div>

                            Selamat datang,

                            <span className="text-blue-600 font-semibold">

                                {" "}
                                {user?.name}

                            </span>

                        </p>

                    </div>

                    <div>

                        <button
                                onClick={createDocument}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
                        >
                                + New Document
                        </button>

                    </div>

                </div>

                {/* SEARCH */}

                <div className="mb-8">

                    <input
                        type="text"
                        placeholder="🔍 Cari dokumen..."
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)}
                        className="w-full rounded-2xl border bg-white p-4 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                </div>

                {/* MY DOCUMENT */}

                <div className="flex justify-between items-center mb-5">

                    <h2 className="text-2xl font-bold">

                        My Documents

                    </h2>

                </div>
                <div className="grid grid-cols-4 gap-5 mb-12">

                    {

                        filteredDocuments.length === 0 ? (

                            <p className="text-gray-500">

                                Tidak ada dokumen.

                            </p>

                        ) : (

                            filteredDocuments.map((doc) => (

                                <DocumentCard
                                    key={doc.id}
                                    document={doc}
                                    onDelete={deleteDocument}
                                />

                            ))

                        )

                    }

                </div>

                {/* SHARED DOCUMENT */}

                <h2 className="text-2xl font-bold mb-5">

                    Shared With Me

                </h2>

                <div className="grid grid-cols-4 gap-5">

                    {

                        filteredSharedDocuments.length === 0 ? (

                            <p className="text-gray-500">

                                Belum ada dokumen yang dibagikan.

                            </p>

                        ) : (

                            filteredSharedDocuments.map((doc) => (

                                <DocumentCard
                                    key={doc.id}
                                    document={doc}
                                    onDelete={() => {}}
                                />

                            ))

                        )

                    }

                </div>

            </div>

        </>

    );

}