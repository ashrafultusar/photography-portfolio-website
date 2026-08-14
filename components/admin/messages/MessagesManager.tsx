"use client";

import React from "react";
import { Mail, Clock } from "lucide-react";

export default function MessagesManager() {
    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Title Header */}
            <div>
                <h1 className="text-2xl font-serif text-slate-900 font-medium">Messages</h1>
                <p className="text-slate-500 font-sans text-xs mt-1">
                    Manage and view messages sent from the public contact form.
                </p>
            </div>

            {/* Placeholder Content */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-12 text-center max-w-xl mx-auto shadow-sm mt-8">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-5 shadow-inner">
                    <Mail size={28} />
                </div>
                <h2 className="text-lg font-serif text-slate-800 font-semibold mb-2">
                    Messages Storage Coming Soon
                </h2>
                <p className="text-slate-500 font-sans text-xs leading-relaxed max-w-sm mx-auto mb-6">
                    The public contact form submissions are currently client-side. Live database storage and email integrations will be configured here.
                </p>
                <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4.5 py-1.5 text-xs text-slate-600 font-sans font-medium">
                    <Clock size={14} className="text-slate-400" />
                    Under active development
                </div>
            </div>
        </div>
    );
}
