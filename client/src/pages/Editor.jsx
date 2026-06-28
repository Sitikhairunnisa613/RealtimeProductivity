import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TextEditor from "../components/TextEditor";
import api from "../api/axios";
import socket from "../socket/socket";
import ActivityLog from "../components/ActivityLog";
import toast from "react-hot-toast";
import Cursor from "../components/Cursor";
import { Share2, Copy } from "lucide-react";
import html2pdf from "html2pdf.js";
import { FileText } from "lucide-react";

export default function Editor() {

    const { id } = useParams();

    const editorRef = useRef(null);
    const pdfRef = useRef(null);
    const timer = useRef(null);
    const typingTimeout = useRef(null);

    const [doc, setDoc] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("Saved");

    const [typingUser, setTypingUser] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [cursors, setCursors] = useState({});

    const loadDocument = async () => {
        try {
            const res = await api.get(`/documents/${id}`);
            setDocument(res.data);
            setTitle(res.data.title);
            setContent(res.data.content || "");
        } catch (err) {
            console.log(err);
        }
    };

    const exportPDF = () => {
        console.log("EXPORT DIKLIK");

    if (!editorRef.current) return;

    const element = window.document.createElement("div");

    element.style.padding = "30px";
    element.style.background = "white";

    element.innerHTML = `
        <h1 style="font-size:28px;margin-bottom:20px;">
            ${title}
        </h1>

        ${editorRef.current.getHTML()}
    `;

    const opt = {
        margin: 0.5,
        filename: `${title}.pdf`,
        image: {
            type: "jpeg",
            quality: 1
        },
        html2canvas: {
            scale: 3
        },
        jsPDF: {
            unit: "in",
            format: "a4",
            orientation: "portrait"
        }
    };

    html2pdf().set(opt).from(element).save();
    console.log(element.innerHTML);
    toast.success("PDF berhasil diunduh");
};

    console.log("EDITOR MOUNT");
    useEffect(() => {
        loadDocument();

        const currentUser = JSON.parse(localStorage.getItem("user"));

        console.log("JOIN DOCUMENT");
        socket.emit("join-document", {
            documentId: id,
            user: currentUser.name
        });

        socket.on("receive-changes", (newContent) => {

            console.log("Receive perubahan");

            setContent(newContent);

        });

        socket.on("typing", (data) => {
            console.log("Menerima typing :", data);
            if (data.sender === socket.id) return;

            setTypingUser(data.user);

            if (typingTimeout.current) {
                clearTimeout(typingTimeout.current);
            }

            typingTimeout.current = setTimeout(() => {
                setTypingUser("");
            }, 1000);
        });

        socket.on("online-users", (users) => {
            setOnlineUsers(users);
        });

        socket.on("cursor-move", (data) => {
            setCursors((prev) => ({
            ...prev,
            [data.id]: data
    }));

});

        return () => {

    socket.emit("leave-document", {
        documentId: id
    });

    socket.off("receive-changes");
    socket.off("typing");
    socket.off("online-users");
    socket.off("cursor-move");

};

    }, [id]);

    useEffect(() => {
        if (!document) return;

        if (timer.current) clearTimeout(timer.current);

        setStatus("Saving...");

        timer.current = setTimeout(async () => {
            try {
                await api.put(`/documents/${id}`, {
                    title,
                    content
                });
                setStatus("Saved");
            } catch (err) {
                console.log(err);
                setStatus("Failed");
            }
        }, 1500);

    }, [title, content, id, document]);

    const shareDocument = async () => {
        const email = prompt("Masukkan email teman");
        if (!email) return;

        try {
            const res = await api.post(`/documents/${id}/share`, { email });
            alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || "Gagal share dokumen");
        }
    };

    if (!document) {
        return (
            <>
                <Navbar />
                <div className="text-center mt-20">Loading...</div>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div
                className="max-w-5xl mx-auto mt-10"
                onMouseMove={(e) => {

                    const currentUser = JSON.parse(localStorage.getItem("user"));

                    socket.emit("cursor-move", {
                    documentId: id,
                    x: e.clientX,
                    y: e.clientY,
                    name: currentUser.name,
                    color: "#2563eb"
             });

         }}
    >

                <div className="flex items-center gap-3 w-full">

                    <FileText className="text-blue-600" size={34} />

                    <input
                        type="text"
                        placeholder="Untitled Document"
                        className="
                            w-full
                            text-4xl
                            font-bold
                            outline-none
                            border-b-2
                            border-gray-200
                            focus:border-blue-500
                            pb-2
                            placeholder:text-gray-300
                        "
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                    />

                <div className="flex gap-3 mr-5">

                    <button
                        onClick={shareDocument}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                <Share2 size={18}/>
                 Share
                </button>

                    <button
                        onClick={()=>{
                        navigator.clipboard.writeText(window.location.href);
                    toast.success("Link berhasil disalin!");
            }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                 >
                <Copy size={18}/>
                Copy Link
                </button>

                <button
                onClick={exportPDF}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                📄 Export PDF
                </button>

                </div>

                    <span className="text-gray-500">{status}</span>

                </div>

                <div className="flex justify-between mb-4">
                    <div className="text-green-600">
                        👥 Online : {onlineUsers.length > 0 ? onlineUsers.join(", ") : "-"}
                    </div>

                    <div className="text-blue-600">
                        {typingUser && `✍️ ${typingUser} sedang mengetik...`}
                    </div>
                </div>

                <div className="bg-gray-50 border rounded-xl p-4 mb-6 flex justify-between">

                <div>
                    <p className="text-sm text-gray-500">
                        Owner
                    </p>

                    <p className="font-semibold">
                        {document.owner_name}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">
                        Last Edited
                    </p>

                    <p className="font-semibold">
                        {document.last_edited}
                    </p>
                </div>

            </div>

                <TextEditor
                    editorRef={editorRef}
                    content={content}
                    onChange={(value) => {

                setContent(value);

                    const currentUser = JSON.parse(localStorage.getItem("user"));

                    socket.emit("typing", {
                    documentId: id,
                    user: currentUser.name
             });
                    socket.emit("send-changes", {
                    documentId: id,
                    content: value
             });

        }}
    />
                <ActivityLog documentId={id} />

            </div>

            {Object.values(cursors).map((cursor, index) => (
                <Cursor
                    key={index}
                    x={cursor.x}
                    y={cursor.y}
                    name={cursor.name}
                    color={cursor.color}
                />
            ))}
        </>
    );
}
