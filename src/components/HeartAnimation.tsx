"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { apiClient } from "@/app/lib/api-client";
import { Heart } from "react-feather";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { showSuccess, showError, showInfo } from "@/components/NotificationToast";


interface HeartData {
    currentStreak: number;
    longestStreak: number;
    totalTaps: number;
    heartFillPercentage: number;
    milestones: string[];
}

export default function HeartAnimation({ email }: { email: string }) {
    const [heart, setHeart] = useState<HeartData | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [justTapped, setJustTapped] = useState(false);
    const { width, height } = useWindowSize();
    const [showMiniConfetti, setShowMiniConfetti] = useState(false);

    const loadData = async () => {
        try {
            const res = await apiClient(`/streaks/${email}`);
            setHeart(res.data);
        } catch (err: unknown) {
            console.error("Error fetching heart data:", err);
        }
    };
/* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        loadData();
    }, [email]);
    /* eslint-disable react-hooks/exhaustive-deps */

    const handleTap = async () => {
        if (loading || justTapped) return;
        setLoading(true);
        try {
            const res = await apiClient("/streaks/tap", {
                method: "POST",
                body: JSON.stringify({ email }),
            });
            if (res.success) {
                setHeart(res.data);
                setMessage(res.message);
                setJustTapped(true);
                showSuccess(res.message);
                // 🎉 milestone celebration
                const milestones = res.data.milestones || [];
                const newMilestone = milestones[milestones.length - 1];
                if (["7days", "14days", "21days", "30days"].includes(newMilestone)) {
                    showInfo(`🎊 You've reached a ${newMilestone} streak!`);
                    setTimeout(() => setShowMiniConfetti(true), 300);
                }
                if (res.data.heartFillPercentage >= 100) {
                    showSuccess("💯 Your heart is completely filled with love!");
                }
            } else {
                showError(res.error);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            showError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fillLevel = heart?.heartFillPercentage || 0;
    const currentStreak = heart?.currentStreak || 0;
    const fullHeart = fillLevel >= 100;
    const adjustedClip = 100 - (fillLevel * 0.85);

    return (
        <div className="flex flex-col items-center justify-center space-y-4 mt-10">
            {showMiniConfetti && (
                <Confetti
                    width={width}
                    height={height}
                    numberOfPieces={150}
                    recycle={false}
                    onConfettiComplete={() => setShowMiniConfetti(false)}
                />
            )}
            {fullHeart && (
                <Confetti width={width} height={height} recycle={false} numberOfPieces={400} />
            )}
            <motion.div
                className="relative w-40 h-40 flex items-center justify-center cursor-pointer"
                whileTap={{ scale: 0.95 }}
                onClick={handleTap}
            >
                <Heart
                    size={130}
                    className="absolute text-roseGold"
                    fill="none"
                    strokeWidth={2}
                />

                <motion.div
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={{ clipPath: `inset(${adjustedClip}% 0 0 0)` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <Heart
                        size={130}
                        fill="#B76E79"
                        stroke="#B76E79"
                        strokeWidth={2}
                    />
                </motion.div>
            </motion.div>

            <div className="text-center">
                <p className="font-semibold text-charcoal">
                    {fullHeart ? "💯 Your heart is full of love!" : `Streak: ${currentStreak} days`}
                </p>
                {message && <p className="text-sm text-gray-600 mt-1">{message}</p>}
            </div>

            <button
                disabled={loading || justTapped}
                onClick={handleTap}
                className={`mt-2 px-5 py-2 rounded-lg text-white font-semibold transition
          ${loading || justTapped
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-roseGold hover:bg-deepRed"
                    }`}
            >
                {loading ? "Saving..." : justTapped ? "Come back tomorrow 💌" : "Add Love 💖"}
            </button>
        </div>
    );
}