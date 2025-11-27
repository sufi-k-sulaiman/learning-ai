import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Settings, BarChart3, Users, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import StackedBarChart from '../components/dashboard/StackedBarChart';

export default function CookiePolicy() {
    const [bannerUrl, setBannerUrl] = useState('');
    const [loadingBanner, setLoadingBanner] = useState(true);
    const [expandedSection, setExpandedSection] = useState(null);
    const [preferences, setPreferences] = useState({
        essential: true,
        analytics: true,
        marketing: false,
        personalization: true
    });

    useEffect(() => {
        generateBanner();
    }, []);

    const generateBanner = async () => {
        try {
            const result = await base44.integrations.Core.GenerateImage({
                prompt: "Digital privacy and data protection concept, abstract visualization of cookies and data flow, blue and purple gradient, secure network nodes, modern tech aesthetic, clean design, horizontal banner 16:9"
            });
            setBannerUrl(result.url);
        } catch (error) {
            console.error('Banner generation failed:', error);
        } finally {
            setLoadingBanner(false);
        }
    };

    const cookieTypes = [
        { id: 'essential', Icon: Shield, title: 'Essential Cookies', desc: 'Required for basic site functionality. Cannot be disabled.', required: true,
          details: 'These cookies are necessary for the website to function and cannot be switched off.' },
        { id: 'analytics', Icon: BarChart3, title: 'Analytics Cookies', desc: 'Help us understand how visitors interact with our site.', required: false,
          details: 'These cookies allow us to count visits and traffic sources so we can measure and improve performance.' },
        { id: 'marketing', Icon: Users, title: 'Marketing Cookies', desc: 'Used to deliver personalized advertisements.', required: false,
          details: 'These cookies may be set through our site by our advertising partners.' },
        { id: 'personalization', Icon: Settings, title: 'Personalization Cookies', desc: 'Remember your preferences and settings.', required: false,
          details: 'These cookies enable the website to provide enhanced functionality and personalization.' },
    ];

    const usageData = [
        { name: 'Jan', value1: 45, value2: 30, value3: 15, value4: 10 },
        { name: 'Feb', value1: 48, value2: 32, value3: 12, value4: 8 },
        { name: 'Mar', value1: 52, value2: 28, value3: 14, value4: 6 },
        { name: 'Apr', value1: 50, value2: 35, value3: 10, value4: 5 },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-cyan-600 overflow-hidden">
                {loadingBanner ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                ) : bannerUrl && (
                    <img src={bannerUrl} alt="Cookie Policy" className="w-full h-full object-cover opacity-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-cyan-900/70" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <Cookie className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
                        <p className="text-lg text-white/80">How we use cookies to improve your experience</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6 -mt-16 relative z-10">
                <Card className="p-6 mb-8 bg-white shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Cookie Preferences</h2>
                    <p className="text-gray-600 mb-6">Choose which cookies you want to accept.</p>
                    
                    <div className="space-y-4">
                        {cookieTypes.map((cookie) => (
                            <div key={cookie.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between p-4 bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <cookie.Icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{cookie.title}</h3>
                                            <p className="text-sm text-gray-500">{cookie.desc}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={preferences[cookie.id]}
                                            onCheckedChange={(checked) => setPreferences({...preferences, [cookie.id]: checked})}
                                            disabled={cookie.required}
                                        />
                                        <button onClick={() => setExpandedSection(expandedSection === cookie.id ? null : cookie.id)}
                                            className="text-gray-400 hover:text-gray-600">
                                            {expandedSection === cookie.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                                {expandedSection === cookie.id && (
                                    <div className="p-4 bg-white border-t border-gray-200">
                                        <p className="text-sm text-gray-600">{cookie.details}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button className="bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
                        <Button variant="outline" onClick={() => setPreferences({ essential: true, analytics: true, marketing: true, personalization: true })}>
                            Accept All
                        </Button>
                    </div>
                </Card>

                <Card className="p-6 mb-8 bg-white shadow-lg">
                    <StackedBarChart
                        title="Cookie Usage Statistics"
                        description="Distribution of cookie types across our platform"
                        data={usageData}
                        colors={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']}
                        legend={[
                            { name: 'Essential', color: '#3B82F6' },
                            { name: 'Analytics', color: '#10B981' },
                            { name: 'Marketing', color: '#F59E0B' },
                            { name: 'Personalization', color: '#8B5CF6' },
                        ]}
                    />
                </Card>

                <Card className="p-6 bg-white shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Policy</h2>
                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 mb-4">This Cookie Policy explains what cookies are and how we use them.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">What Are Cookies?</h3>
                        <p className="text-gray-600 mb-4">Cookies are small text files that are stored on your computer or mobile device when you visit a website.</p>
                        <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Your Rights</h3>
                        <p className="text-gray-600">You have the right to decide whether to accept or reject cookies.</p>
                    </div>
                    <p className="text-sm text-gray-400 mt-6">Last updated: November 2025</p>
                </Card>
            </div>
        </div>
    );
}