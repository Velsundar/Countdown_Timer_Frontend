"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/app/lib/api-client";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

interface Props {
    eventKey: "engagement" | "marriage";
}

interface Remaining {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isOver: boolean;
}

export default function CountdownTimer({ eventKey }: Props) {
    const [eventName, setEventName] = useState("");
    const [targetDate, setTargetDate] = useState<Date | null>(null);
    const [remaining, setRemaining] = useState<Remaining | null>(null);
    const { width, height } = useWindowSize();

    useEffect(() => {
        const fetchData = async () => {
            const res = await apiClient(`/countdown/${eventKey}`);
            setEventName(res.event);
            setTargetDate(new Date(res.date));
            setRemaining(res.remaining);
        };
        fetchData();
    }, [eventKey]);

    useEffect(() => {
        if (!targetDate) return;

        const interval = setInterval(() => {
            const diff = targetDate.getTime() - new Date().getTime();
            const isOver = diff <= 0;
            const absDiff = Math.abs(diff);

            const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
            const seconds = Math.floor((absDiff / 1000) % 60);

            setRemaining({ days, hours, minutes, seconds, isOver });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (!remaining) return <p className="text-center text-gray-500">Loading…</p>;

    const isOver = remaining.isOver;


    return (
        <>
            {isOver && <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />}

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center justify-center text-center space-y-6"
            >
                <h1 className="text-3xl md:text-5xl font-serif text-roseGold capitalize">
                    {eventName === "engagement" ? "Our Engagement 💍" : "Our Wedding Day 💒"}
                </h1>

                <p className="text-charcoal text-lg">
                    {isOver
                        ? "Since the special day ✨"
                        : "Counting down to the celebration 🎉"}
                </p>

                <motion.div
                    className="flex gap-3 md:gap-6 text-3xl md:text-5xl font-mono text-deepRed"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <span>{remaining.days}d</span>:
                    <span>{remaining.hours}h</span>:
                    <span>{remaining.minutes}m</span>:
                    <span>{remaining.seconds}s</span>
                </motion.div>

                <button
                    onClick={() => history.back()}
                    className="mt-6 bg-roseGold text-white px-4 py-2 rounded-lg hover:bg-deepRed transition"
                >
                    ← Back to Dashboard
                </button>
            </motion.div>
        </>
    );
}
