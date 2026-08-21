import React from "react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-900 transition-opacity duration-300">
            <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin" />
            </div>
        </div>
    );
}
