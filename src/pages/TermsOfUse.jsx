import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle2, AlertTriangle, Scale, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { base44 } from '@/api/base44Client';
import AreaChartWithMarkers from '@/components/dashboard/AreaChartWithMarkers';

export default function TermsOfUse() {
    const [bannerUrl, setBannerUrl] = useState('');
    const [loadingBanner, setLoadingBanner] = useState(true);

    useEffect(() => {
        generateBanner();
    }, []);

    const generateBanner = async () => {
        try {
            const result = await base44.integrations.Core.GenerateImage({
                prompt: "Legal documents and contracts on elegant wooden desk, pen signing agreement, professional law office atmosphere, warm golden lighting, trust and partnership concept, photorealistic, horizontal banner 16:9"
            });
            setBannerUrl(result.url);
        } catch (error) {
            console.error('Banner generation failed:', error);
        } finally {
            setLoadingBanner(false);
        }
    };

    const sections = [
        { title: '1. Acceptance of Terms', content: 'By accessing and using 1cPublishing platform, you agree to be bound by these Terms of Use and all applicable laws and regulations.' },
        { title: '2. Use License', content: 'Permission is granted to temporarily access the materials on 1cPublishing for personal, non-commercial transitory viewing only.' },
        { title: '3. User Accounts', content: 'When you create an account with us, you must provide accurate, complete, and current information.' },
        { title: '4. Intellectual Property', content: 'The Service and its original content, features, and functionality are and will remain the exclusive property of 1cPublishing.' },
        { title: '5. User Content', content: 'You retain ownership of any content you submit, post, or display on or through the Service.' },
        { title: '6. Prohibited Activities', content: 'You may not access or use the Service for any purpose other than that for which we make it available.' },
        { title: '7. Limitation of Liability', content: 'In no event shall 1cPublishing be liable for any indirect, incidental, special, consequential, or punitive damages.' },
        { title: '8. Termination', content: 'We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever.' },
    ];

    const updateHistory = [
        { name: 'Jan', value: 2 },
        { name: 'Mar', value: 5, marker: 'Privacy Update' },
        { name: 'May', value: 3 },
        { name: 'Jul', value: 8, marker: 'Major Revision' },
        { name: 'Sep', value: 4 },
        { name: 'Nov', value: 6, marker: 'Current' },
    ];

    const keyPoints = [
        { Icon: CheckCircle2, text: 'You must be 18+ to use our services', color: 'text-green-600' },
        { Icon: CheckCircle2, text: 'Your data is protected under our privacy policy', color: 'text-green-600' },
        { Icon: AlertTriangle, text: 'Misuse may result in account termination', color: 'text-amber-600' },
        { Icon: CheckCircle2, text: 'You retain ownership of your content', color: 'text-green-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-amber-600 to-orange-600 overflow-hidden">
                {loadingBanner ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                ) : bannerUrl && (
                    <img src={bannerUrl} alt="Terms of Use" className="w-full h-full object-cover opacity-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 to-orange-900/70" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <Scale className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Use</h1>
                        <p className="text-lg text-white/80">Please read these terms carefully before using our services</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6 -mt-16 relative z-10">
                <Card className="p-6 mb-8 bg-white shadow-lg">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Key Points Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {keyPoints.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <item.Icon className={`w-5 h-5 ${item.color}`} />
                                <span className="text-sm text-gray-700">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-6 mb-8 bg-white shadow-lg">
                    <AreaChartWithMarkers
                        title="Terms Update History"
                        data={updateHistory}
                        color="#F59E0B"
                    />
                </Card>

                <Card className="p-6 bg-white shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <FileText className="w-6 h-6 text-amber-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Full Terms and Conditions</h2>
                    </div>
                    
                    <div className="space-y-6">
                        {sections.map((section, i) => (
                            <div key={i} className="pb-6 border-b border-gray-100 last:border-0">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 bg-amber-50 rounded-lg">
                        <p className="text-sm text-amber-800">
                            <strong>Effective Date:</strong> November 1, 2025<br />
                            <strong>Last Updated:</strong> November 27, 2025<br />
                            If you have any questions about these Terms, please contact us at legal@1cpublishing.com
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}