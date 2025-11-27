
import { Sparkles, Radio, Brain, Settings, FileText, BarChart3, GraduationCap, ListTodo, Lightbulb, StickyNote, Gamepad2, Globe } from 'lucide-react';
import { createPageUrl } from '@/utils';

export const LOGO_URL = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/868a98750_1cPublishing-logo.png";

export const menuItems = [
    { icon: Sparkles, label: "AI Hub", href: createPageUrl('AIHub') },
    { icon: Radio, label: "SearchPods", href: createPageUrl('SearchPods') },
    { icon: Brain, label: "MindMap", href: createPageUrl('MindMap') },
    { icon: FileText, label: "Resume Builder", href: createPageUrl('ResumeBuilder') },
    { icon: BarChart3, label: "Markets", href: createPageUrl('Markets') },
    { icon: Lightbulb, label: "Intelligence", href: createPageUrl('Intelligence') },
    { icon: Globe, label: "Geospatial", href: createPageUrl('Geospatial') },
    { icon: GraduationCap, label: "Learning", href: createPageUrl('Learning') },
    { icon: ListTodo, label: "Tasks", href: createPageUrl('Tasks') },
    { icon: StickyNote, label: "Notes", href: createPageUrl('Notes') },
    { icon: Gamepad2, label: "Games", href: createPageUrl('Games') },
    { icon: Settings, label: "Settings", href: createPageUrl('Settings') },
];

export const footerLinks = [
    { label: "Contact Us", href: createPageUrl('ContactUs') },
    { label: "Governance", href: createPageUrl('Governance') },
    { label: "Cookie Policy", href: createPageUrl('CookiePolicy') },
    { label: "Terms of Use", href: createPageUrl('TermsOfUse') },
    { label: "Teams", href: createPageUrl('Teams') },
];
