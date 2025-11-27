import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Globe, Sparkles, BarChart3, Gamepad2, Settings, Radio, Brain, FileText, GraduationCap, ListTodo, StickyNote, Lightbulb, ScrollText } from 'lucide-react';

const menuItems = [
    { label: 'Home', icon: Globe, href: createPageUrl('Home') },
    { label: 'Qwirey', icon: Sparkles, href: createPageUrl('Qwirey') },
    { label: 'MindMap', icon: Brain, href: createPageUrl('MindMap') },
    { label: 'SearchPods', icon: Radio, href: createPageUrl('SearchPods') },
    { label: 'Markets', icon: BarChart3, href: createPageUrl('Markets') },
    { label: 'Learning', icon: GraduationCap, href: createPageUrl('Learning') },
    { label: 'Geospatial', icon: Globe, href: createPageUrl('Geospatial') },
    { label: 'Intelligence', icon: Lightbulb, href: createPageUrl('Intelligence') },
    { label: 'Resume Builder', icon: FileText, href: createPageUrl('ResumeBuilder') },
    { label: 'Tasks', icon: ListTodo, href: createPageUrl('Tasks') },
    { label: 'Notes', icon: StickyNote, href: createPageUrl('Notes') },
    { label: 'Games', icon: Gamepad2, href: createPageUrl('Games') },
    { label: 'Terms of Use', icon: ScrollText, href: createPageUrl('TermsOfUse') },
    { label: 'Settings', icon: Settings, href: createPageUrl('Settings') },
];

export default function Sidebar({ isOpen, activePage, onClose }) {
    // Only close on mobile when clicking overlay or a menu item
    const handleMobileClose = () => {
        if (window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
            <aside className={`${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex-shrink-0 fixed md:relative z-50 md:z-auto h-[calc(100vh-72px)] md:h-auto`}>
                <nav className="p-4 space-y-2">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.href}
                            onClick={handleMobileClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                item.label === activePage
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                            }`}
                        >
                            <item.icon className="w-5 h-5 text-purple-600" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}