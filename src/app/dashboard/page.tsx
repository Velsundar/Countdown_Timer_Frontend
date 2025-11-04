"use client";

import EventCard from "@/components/EventCard";
import HeartAnimation from "@/components/HeartAnimation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [email, setEmail] = useState("");
    useEffect(() => {
        const storedUser = localStorage.getItem("weddingUser");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setEmail(user.email);
        }
    }, []);
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-serif text-roseGold mb-6 text-center"
            >
                Sundaravel & Ranjitha
            </motion.h1>

            <p className="text-charcoal text-lg mb-10 text-center">
                Our Journey Begins — pick an event to explore 💞
            </p>

            <div className="flex flex-col md:flex-row gap-6 items-center">
                <EventCard title="Our Engagement" eventKey="engagement" />
                <EventCard title="Our Wedding Day" eventKey="marriage" />
            </div>
            {email && <HeartAnimation email={email} />}
        </main>
    );
}
