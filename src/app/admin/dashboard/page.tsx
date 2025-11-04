"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/app/lib/api-client";
import { showError, showSuccess } from "@/components/NotificationToast";

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    totalVisits: number;
    createdAt: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState({ name: "engagement", date: "", description: "" });

    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : "";

    const fetchData = async () => {
        try {
            const statsRes = await apiClient("/admin/stats", {
                headers: { "x-admin-token": token! },
            });
            setStats(statsRes.data);

            const usersRes = await apiClient("/admin/users", {
                headers: { "x-admin-token": token! },
            });
            setUsers(usersRes.data);
        } catch (err: any) {
            showError("Error fetching dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const updateEvent = async () => {
        try {
            const res = await apiClient("/admin/events", {
                method: "PUT",
                headers: { "x-admin-token": token!, "Content-Type": "application/json" },
                body: JSON.stringify(event),
            });
            showSuccess("Event updated successfully!");
        } catch {
            showError("Error updating event.");
        }
    };

    // 1. New Logout Handler
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin";
    };

    useEffect(() => {
        if (!token) {
            window.location.href = "/admin";
            return;
        }
        fetchData();
    }, []);

    if (loading) return <p className="text-center mt-20">Loading Dashboard...</p>;

    return (
        <main className="min-h-screen bg-cream px-6 py-8">
            {/* 2. Modified structure for Title and Logout Button */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-serif text-roseGold text-center flex-grow">
                    Admin Dashboard 💍
                </h1>
                <button
                    onClick={handleLogout}
                    className="bg-gray-200 text-charcoal px-4 py-2 rounded-md hover:bg-gray-300 transition duration-150 ease-in-out whitespace-nowrap"
                >
                    Logout
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <h3 className="text-sm text-gray-500">Total Users</h3>
                    <p className="text-2xl font-semibold">{stats?.totalUsers || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <h3 className="text-sm text-gray-500">Total Taps</h3>
                    <p className="text-2xl font-semibold">{stats?.totalTaps || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <h3 className="text-sm text-gray-500">Avg Heart Fill (%)</h3>
                    <p className="text-2xl font-semibold">
                        {stats?.avgHeartFill ? parseFloat(stats.avgHeartFill).toFixed(1) : "0.0"}
                    </p>
                </div>
            </div>

            {/* Event Editor */}
            <div className="bg-white rounded-lg shadow p-5 mb-8">
                <h2 className="text-xl font-semibold text-roseGold mb-3">
                    Update Event Date
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        className="border p-2 rounded-md"
                        value={event.name}
                        onChange={(e) => setEvent({ ...event, name: e.target.value })}
                    >
                        <option value="engagement">Engagement</option>
                        <option value="marriage">Marriage</option>
                    </select>
                    <input
                        type="datetime-local"
                        className="border p-2 rounded-md flex-1"
                        value={event.date}
                        onChange={(e) => setEvent({ ...event, date: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Optional description"
                        className="border p-2 rounded-md flex-1"
                        onChange={(e) => setEvent({ ...event, description: e.target.value })}
                    />
                    <button
                        onClick={updateEvent}
                        className="bg-roseGold text-white px-4 py-2 rounded-md hover:bg-deepRed"
                    >
                        Save
                    </button>
                </div>
            </div>

            {/* User List */}
            <div className="bg-white rounded-lg shadow p-5 overflow-x-auto">
                <h2 className="text-xl font-semibold text-roseGold mb-3">Registered Users</h2>
                <table className="min-w-full text-left border">
                    <thead className="bg-champagneGold text-charcoal">
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Phone</th>
                            <th className="p-2 border">Visits</th>
                            <th className="p-2 border">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="hover:bg-cream">
                                <td className="p-2 border">{u.name}</td>
                                <td className="p-2 border">{u.email}</td>
                                <td className="p-2 border">{u.phone || "-"}</td>
                                <td className="p-2 border text-center">{u.totalVisits}</td>
                                <td className="p-2 border text-sm text-gray-500">
                                    {new Date(u.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}