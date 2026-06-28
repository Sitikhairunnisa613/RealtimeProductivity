import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function DocumentLogs() {

    const { id } = useParams();

    const [logs, setLogs] = useState([]);

    useEffect(() => {

        loadLogs();

    }, []);

    const loadLogs = async () => {

        try {

            const res = await api.get(`/documents/${id}/logs`);

            setLogs(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    return (

        <>
            <Navbar />

            <div className="max-w-4xl mx-auto mt-10">

                <h1 className="text-3xl font-bold mb-6">
                    Riwayat Aktivitas
                </h1>

                <div className="bg-white rounded-xl shadow">

                    {logs.length === 0 ? (

                        <div className="p-6 text-gray-500">

                            Belum ada aktivitas.

                        </div>

                    ) : (

                        logs.map((log) => (

                            <div
                                key={log.id}
                                className="border-b p-5"
                            >

                                <div className="font-semibold">

                                    {log.user_name}

                                </div>

                                <div className="text-gray-600">

                                    {log.activity}

                                </div>

                                <div className="text-sm text-gray-400 mt-1">

                                    {new Date(
                                        log.created_at
                                    ).toLocaleString()}

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </>

    );

}