import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LOGO_URL, footerLinks } from '../NavigationConfig';

export default function Footer() {
    return (
        <footer className="py-6 bg-white border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <Link to={createPageUrl('Intelligence')} className="flex items-center gap-2">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain" />
                        <span className="text-sm font-bold text-gray-900">1cPlatform</span>
                    </Link>
                    <nav className="flex flex-wrap justify-center gap-6 text-sm">
                        {footerLinks.map((link, i) => (
                            <a key={i} href={link.href} className="text-gray-600 transition-colors" style={{ '--hover-color': '#6209e6' }} onMouseEnter={(e) => e.currentTarget.style.color = '#6209e6'} onMouseLeave={(e) => e.currentTarget.style.color = ''}>{link.label}</a>
                        ))}
                    </nav>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                    Copyright © 2025 <a href="https://1cplatform.com/" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: '#6209e6' }} onMouseEnter={(e) => e.currentTarget.style.color = '#5507C8'} onMouseLeave={(e) => e.currentTarget.style.color = '#6209e6'}>1cPlatform</a>. All rights reserved.
                </div>
            </div>
        </footer>
    );
}