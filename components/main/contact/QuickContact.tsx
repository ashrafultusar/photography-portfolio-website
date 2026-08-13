import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const contacts = [
    {
        icon: Phone,
        label: 'Phone',
        value: '+880 1700-000000',
        href: 'tel:+8801700000000',
    },
    {
        icon: Mail,
        label: 'Email',
        value: 'hello@thestory.com.bd',
        href: 'mailto:hello@thestory.com.bd',
    },
    {
        icon: MapPin,
        label: 'Studio',
        value: 'Gulshan-1, Dhaka, Bangladesh',
        href: 'https://maps.google.com/?q=Gulshan+Dhaka',
    },
];

const QuickContact = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-sm tracking-[0.25em] uppercase text-red-500 font-sans mb-6">
                Quick Contact
            </h3>
            {contacts.map(({ icon: Icon, label, value, href }) => (
                <a
                    key={label}
                    href={href}
                    target={label === 'Studio' ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex items-start gap-4 group p-4 border border-white/10 bg-white/5 hover:border-red-700/40 hover:bg-red-900/10 rounded-sm transition-all duration-300"
                >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full border border-red-700/30 bg-red-900/20 text-red-500 shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={16} />
                    </span>
                    <div>
                        <p className="text-xs tracking-widest uppercase text-gray-500 font-sans">{label}</p>
                        <p className="text-white font-sans text-sm mt-0.5 group-hover:text-red-300 transition-colors duration-300">
                            {value}
                        </p>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default QuickContact;
