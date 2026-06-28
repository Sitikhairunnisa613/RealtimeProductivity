import { useNavigate } from "react-router-dom";
import { Trash2, FileText, Clock, User } from "lucide-react";

export default function DocumentCard({ document, onDelete }) {

    const navigate = useNavigate();

    return (

    <div
    className="
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        border
        border-transparent
        hover:border-blue-500
        p-6
        relative
    "
>

        {/* Delete */}

        <button
            onClick={(e) => {
                e.stopPropagation();
                onDelete(document.id);
            }}
            className="absolute top-5 right-5 text-red-500 hover:text-red-600 transition"
        >

            <Trash2 size={20} />

        </button>

        {/* Klik */}

        <div
            onClick={() => navigate(`/editor/${document.id}`)}
            className="cursor-pointer p-6"
        >

            {/* Icon */}

            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">

                <FileText
                    size={35}
                    className="text-blue-600"
                />

            </div>

            {/* Title */}

            <h2 className="font-bold text-2xl line-clamp-2">

                {document.title}

            </h2>

            {/* Preview */}

            <p className="text-gray-500 text-sm line-clamp-2 mt-2">

                {document.content
                    ? document.content.replace(/<[^>]+>/g, "")
                    : "Dokumen masih kosong."}

            </p>

            <hr className="my-4 border-gray-200" />

            {/* Footer */}

            <div className="space-y-2 text-gray-500 text-sm">

                <div className="flex items-center gap-2">

                    <User size={16}/>

                    {document.owner_name || "Unknown"}

                </div>

                <div className="flex items-center gap-2">

                    <Clock size={16}/>

                    {document.last_edited || "-"}

                </div>

            </div>

        </div>

    </div>

);

}