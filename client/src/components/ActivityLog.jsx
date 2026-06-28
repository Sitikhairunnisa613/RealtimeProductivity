import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ActivityLog({ documentId }) {

    const [logs, setLogs] = useState([]);

    const loadLogs = async () => {

        try {

            const res = await api.get(
                `/documents/${documentId}/logs`
            );

            setLogs(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        if (documentId) {

            loadLogs();

        }

    }, [documentId]);

    return (

        <div className="mt-10">

            <h2 className="text-xl font-bold mb-4">

                Activity Log

            </h2>

            <div className="border rounded-xl bg-white p-4">

                {logs.length === 0 ? (

                    <p className="text-gray-500">

                        Belum ada aktivitas.

                    </p>

                ) : (

                    logs.map((log) => (

                        <div
                            key={log.id}
                            className="border-b py-2"
                        >

                            <p>

                                <b>{log.user_name}</b>

                                {" "}

                                {log.activity}

                            </p>

                            <small className="text-gray-500">

                                {new Date(
                                    log.created_at
                                ).toLocaleString()}

                            </small>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}