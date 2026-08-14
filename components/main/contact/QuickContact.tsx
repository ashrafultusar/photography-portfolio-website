import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

interface QuickContactProps {
    phone: string;
    phoneHref: string;
    email: string;
    emailHref: string;
    studioAddress: string;
    studioMapsUrl: string;
}

const QuickContact = ({
    phone,
    phoneHref,
    email,
    emailHref,
    studioAddress,
    studioMapsUrl,
}: QuickContactProps) => {
    const contacts = [
        {
            icon: Phone,
            label: 'Phone',
            value: phone,
            href: phoneHref,
            isExternal: false,
        },
        {
            icon: Mail,
            label: 'Email',
            value: email,
            href: emailHref,
            isExternal: false,
        },
        {
            icon: MapPin,
            label: 'Studio',
            value: studioAddress,
            href: studioMapsUrl,
            isExternal: true,
        },
    ];

    return (
        <div className="space-y-4">
            <h3 className="text-sm tracking-[0.25em] uppercase text-amber-600 font-sans font-bold mb-6">
                Quick Contact
            </h3>
            {contacts.map(({ icon: Icon, label, value, href, isExternal }) => (
                <a
                    key={label}
                    href={href}
                    target={isExternal ? '_blank' : undefined}
                    rel="noreferrer"
                    className="flex items-start gap-4 group p-4 border border-slate-300 bg-white hover:border-amber-500 hover:bg-amber-500/5 rounded-sm transition-all duration-300 shadow-sm"
                >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full border border-amber-500/40 bg-amber-400/20 text-amber-700 shrink-0 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
                        <Icon size={16} />
                    </span>
                    <div>
                        <p className="text-xs tracking-widest uppercase text-slate-500 font-sans font-bold">{label}</p>
                        <p className="text-slate-900 font-sans text-sm mt-0.5 font-bold group-hover:text-amber-700 transition-colors duration-300">
                            {value}
                        </p>
                    </div>
                </a>
            ))}
        </div>
    );
};

export default QuickContact;
