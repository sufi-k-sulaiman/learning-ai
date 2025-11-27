import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/a1a505225_1cPublishing-logo.png';

const footerLinks = [
    { label: 'Terms of Use', href: createPageUrl('TermsOfUse') },
    { label: 'Privacy Policy', href: createPageUrl('PrivacyPolicy') },
    { label: 'Cookie Policy', href: createPageUrl('CookiePolicyPage') },
    { label: 'Contact Us', href: createPageUrl('ContactUs') },
];

export default function Footer() {
    return (
        <footer className="py-6 bg-white border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain grayscale" />
                    <nav className="flex flex-wrap justify-center gap-6 text-sm">
                        {footerLinks.map((link, i) => (
                            <Link key={i} to={link.href} className="text-gray-600 hover:text-purple-600 transition-colors">{link.label}</Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                    © 2025 1cPublishing.com
                </div>
            </div>
        </footer>
    );
}