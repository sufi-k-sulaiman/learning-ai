import React, { useState, useEffect } from 'react';
import { Shield, Users, Scale, FileCheck, Eye, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { base44 } from '@/api/base44Client';
import SemiCircleProgress from '@/components/dashboard/SemiCircleProgress';
import BudgetDonutCard from '@/components/dashboard/BudgetDonutCard';

export default function Governance() {
    const [bannerUrl, setBannerUrl] = useState('');
    const [loadingBanner, setLoadingBanner] = useState(true);

    useEffect(() => {
        generateBanner();
    }, []);

    const generateBanner = async () => {
        try {
            const result = await base44.integrations.Core.GenerateImage({
                prompt: "Corporate governance boardroom meeting, elegant modern interior, executives at long table, professional atmosphere, glass walls with city skyline, warm lighting, trust and leadership theme, photorealistic, horizontal banner 16:9"
            });
            setBannerUrl(result.url);
        } catch (error) {
            console.error('Banner generation failed:', error);
        } finally {
            setLoadingBanner(false);
        }
    };

    const principles = [
        { Icon: Shield, title: 'Integrity', desc: 'We uphold the highest ethical standards in all our operations and decision-making processes.' },
        { Icon: Users, title: 'Accountability', desc: 'Clear responsibility chains ensure every action is traceable and stakeholders are informed.' },
        { Icon: Scale, title: 'Fairness', desc: 'We treat all stakeholders equitably and make decisions based on merit and objective criteria.' },
        { Icon: Eye, title: 'Transparency', desc: 'Open communication about our policies, procedures, and performance metrics.' },
        { Icon: Lock, title: 'Security', desc: 'Robust measures protect user data and ensure system integrity at all times.' },
        { Icon: FileCheck, title: 'Compliance', desc: 'Full adherence to applicable laws, regulations, and industry best practices.' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-slate-700 to-slate-900 overflow-hidden">
                {loadingBanner ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                ) : bannerUrl && (
                    <img src={bannerUrl} alt="Governance" className="w-full h-full object-cover opacity-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/80" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Governance</h1>
                        <p className="text-lg text-white/80">Our commitment to ethical leadership and accountability</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 -mt-16 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <BudgetDonutCard title="Data Protection" percentage={98} label="Compliant" color1="#10B981" color2="#34D399" />
                    <BudgetDonutCard title="Security Audits" percentage={100} label="Passed" color1="#3B82F6" color2="#60A5FA" />
                    <BudgetDonutCard title="Policy Adherence" percentage={96} label="Score" color1="#8B5CF6" color2="#A78BFA" />
                    <BudgetDonutCard title="Training Complete" percentage={94} label="Staff" color1="#F59E0B" color2="#FBBF24" />
                </div>

                <Card className="p-6 mb-8 bg-white shadow-lg">
                    <SemiCircleProgress
                        title="Governance Framework"
                        steps={[
                            { name: 'Policy', value: 20, color: '#8B5CF6' },
                            { name: 'Review', value: 20, color: '#3B82F6' },
                            { name: 'Approval', value: 20, color: '#10B981' },
                            { name: 'Implementation', value: 20, color: '#F59E0B' },
                            { name: 'Monitoring', value: 20, color: '#EF4444' },
                        ]}
                    />
                </Card>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Governance Principles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {principles.map((p, i) => (
                        <Card key={i} className="p-6 bg-white shadow-sm hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                                <p.Icon className="w-6 h-6 text-slate-700" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                            <p className="text-gray-600 text-sm">{p.desc}</p>
                        </Card>
                    ))}
                </div>

                <Card className="p-6 bg-white shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Board Structure</h2>
                    <div className="space-y-4">
                        {[
                            { role: 'Board of Directors', desc: 'Strategic oversight and major decision approval', members: 7 },
                            { role: 'Audit Committee', desc: 'Financial reporting and internal controls', members: 3 },
                            { role: 'Risk Committee', desc: 'Risk assessment and mitigation strategies', members: 4 },
                            { role: 'Ethics Committee', desc: 'Code of conduct and compliance monitoring', members: 3 },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.role}</p>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-slate-200 rounded-full text-sm font-medium">{item.members} members</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}