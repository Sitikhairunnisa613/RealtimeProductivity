import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect, useRef } from "react";

export default function TextEditor({
    content,
    onChange,
    editorRef
}) {

    const isRemoteUpdate = useRef(false);
    const editor = useEditor({

        extensions: [

            StarterKit,
            Underline

        ],

        content,

        onUpdate: ({ editor }) => {

        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }

        onChange(editor.getHTML());

        }

    });

    useEffect(() => {

        if (editor && editorRef) {

            editorRef.current = editor;

        }

    }, [editor]);

    useEffect(() => {

        if (!editor) return;

        if (content !== editor.getHTML()) {

            isRemoteUpdate.current = true;
            editor.commands.setContent(content, false);

        }

    }, [content, editor]);

    if (!editor) return null;

    return (

        <div className="border rounded-xl bg-white overflow-hidden">

            {/* Toolbar */}

            <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-100">

                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1 rounded ${
                        editor.isActive("bold")
                            ? "bg-blue-600 text-white"
                            : "bg-white border"
                    }`}
                >
                    <b>B</b>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1 rounded ${
                        editor.isActive("italic")
                            ? "bg-blue-600 text-white"
                            : "bg-white border"
                    }`}
                >
                    <i>I</i>
                </button>

                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`px-3 py-1 rounded ${
                        editor.isActive("underline")
                            ? "bg-blue-600 text-white"
                            : "bg-white border"
                    }`}
                >
                    <u>U</u>
                </button>

                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className="px-3 py-1 rounded border bg-white"
                >
                    H1
                </button>

                <button
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className="px-3 py-1 rounded border bg-white"
                >
                    H2
                </button>

                <button
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    className="px-3 py-1 rounded border bg-white"
                >
                    • List
                </button>

                <button
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className="px-3 py-1 rounded border bg-white"
                >
                    1. List
                </button>

                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    className="px-3 py-1 rounded border bg-white"
                >
                    Undo
                </button>

                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    className="px-3 py-1 rounded border bg-white"
                >
                    Redo
                </button>

            </div>

            {/* Editor */}

            <div className="p-5 min-h-[500px]">

                <EditorContent editor={editor} />

            </div>

        </div>

    );

}