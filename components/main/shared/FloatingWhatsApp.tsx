'use client';

import React from 'react';

interface FloatingWhatsAppProps {
    phoneNumber?: string;
    message?: string;
}

export default function FloatingWhatsApp({
    phoneNumber = "8801700000000",
    message = "Hello! I'm interested in booking The Story photography. Can we discuss?",
}: FloatingWhatsAppProps) {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    return (
        <>
            <style jsx global>{`
                @keyframes whatsapp-ripple {
                    0% {
                        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6), 0 0 0 0 rgba(37, 211, 102, 0.3);
                    }
                    50% {
                        box-shadow: 0 0 0 16px rgba(37, 211, 102, 0), 0 0 0 32px rgba(37, 211, 102, 0);
                    }
                    100% {
                        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0), 0 0 0 0 rgba(37, 211, 102, 0);
                    }
                }
                @keyframes whatsapp-wiggle {
                    0%, 100% { transform: rotate(0deg) scale(1); }
                    10% { transform: rotate(14deg) scale(1.1); }
                    20% { transform: rotate(-12deg) scale(1.1); }
                    30% { transform: rotate(10deg) scale(1.05); }
                    40% { transform: rotate(-8deg) scale(1.02); }
                    50% { transform: rotate(4deg) scale(1); }
                    60% { transform: rotate(0deg) scale(1); }
                }
                .wa-wave-btn {
                    animation: whatsapp-ripple 2.4s infinite ease-in-out;
                }
                .wa-wave-icon {
                    animation: whatsapp-wiggle 3s infinite ease-in-out;
                }
            `}</style>

            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="wa-wave-btn fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] rounded-full shadow-2xl transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
                {/* Speech Bubble Icon matching screenshot */}
                <div className="wa-wave-icon flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 text-white drop-shadow-sm"
                        aria-hidden="true"
                    >
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.954.558 3.778 1.524 5.32L2.053 21.45a.75.75 0 0 0 .912.912l4.13-1.471A9.943 9.943 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                </div>
            </a>
        </>
    );
}
