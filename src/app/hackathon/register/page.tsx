"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, XCircle } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center space-y-6"
            >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4">
                    <XCircle className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-white">Registrations Closed</h2>
                <p className="text-neutral-400">
                    Thank you for your interest in DevForge! Unfortunately, registrations for this hackathon have now closed.
                </p>
                <p className="text-sm text-neutral-500 mt-2">
                    Follow us on social media to stay updated on future events and opportunities.
                </p>
                <Link
                    href="/hackathon"
                    className="inline-flex items-center gap-2 w-full justify-center py-3 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Hackathon
                </Link>
            </motion.div>
        </div>
    );
}
