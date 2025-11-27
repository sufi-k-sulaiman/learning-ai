import React, { useState, useEffect } from 'react';
import { Users, Mail, Linkedin, Twitter, Star, Award, Briefcase, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import ColoredMetricCard from '@/components/dashboard/ColoredMetricCard';
import CountryVisitorsCard from '@/components/dashboard/CountryVisitorsCard';

export default function Teams() {
    const [bannerUrl, setBannerUrl] = useState('');
    const [loadingBanner, setLoadingBanner] = useState(true);

    useEffect(() => {
        generateBanner();
    }, []);

    const generateBanner = async () => {
        try {
            const result = await base44.integrations.Core.GenerateImage({
                prompt: "Diverse professional team collaboration in modern creative office space, people working together at standing desks, natural lighting, plants, innovative startup culture, teamwork and success, photorealistic, horizontal banner 16:9"
            });
            setBannerUrl(result.url);
        } catch (error) {
            console.error('Banner generation failed:', error);
        } finally {
            setLoadingBanner(false);
        }
    };

    const leadership = [
        { name: 'Sarah Chen', role: 'CEO & Founder', bio: 'Visionary leader with 15+ years in tech innovation', avatar: '👩‍💼', color: 'from-purple-500 to-indigo-600' },
        { name: 'Michael Roberts', role: 'CTO', bio: 'Former Google engineer, AI/ML expert', avatar: '👨‍💻', color: 'from-blue-500 to-cyan-600' },
        { name: 'Emily Watson', role: 'COO', bio: 'Operations excellence, scaled 3 unicorns', avatar: '👩‍🔬', color: 'from-emerald-500 to-teal-600' },
        { name: 'David Kim', role: 'CFO', bio: 'Strategic finance leader, IPO specialist', avatar: '👨‍💼', color: 'from-amber-500 to-orange-600' },
    ];

    const departments = [
        { name: 'Engineering', count: 45, icon: '💻', growth: '+12' },
        { name: 'Product', count: 18, icon: '🎨', growth: '+5' },
        { name: 'Sales', count: 32, icon: '📈', growth: '+8' },
        { name: 'Marketing', count: 15, icon: '📣', growth: '+3' },
        { name: 'Customer Success', count: 22, icon: '🤝', growth: '+6' },
        { name: 'Operations', count: 12, icon: '⚙️', growth: '+2' },
    ];

    const teamLocations = [
        { label: 'United States', percentage: 35, color: '#EC4899' },
        { label: 'United Kingdom', percentage: 22, color: '#6B4EE6' },
        { label: 'Germany', percentage: 14, color: '#50C8E8' },
        { label: 'Singapore', percentage: 17, color: '#F59E0B' },
    ];

    const values = [
        { Icon: Star, title: 'Excellence', desc: 'We strive for the best' },
        { Icon: Users, title: 'Collaboration', desc: 'Together we achieve more' },
        { Icon: Award, title: 'Innovation', desc: 'We push boundaries' },
        { Icon: Briefcase, title: 'Integrity', desc: 'We do what\'s right' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
                {loadingBanner ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                ) : bannerUrl && (
                    <img src={bannerUrl} alt="Our Team" className="w-full h-full object-cover opacity-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-purple-900/70" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <Users className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
                        <p className="text-lg text-white/80">Meet the people building the future of publishing</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 -mt-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <ColoredMetricCard title="Team Size" change="+36 this year" changeType="positive" bgColor="#8B5CF6"
                        metric1={{ value: '144', label: 'Employees' }} metric2={{ value: '12', label: 'Countries' }} />
                    <ColoredMetricCard title="Experience" change="Industry Leaders" changeType="positive" bgColor="#10B981"
                        metric1={{ value: '850+', label: 'Combined Years' }} metric2={{ value: '15', label: 'Avg Years' }} />
                    <ColoredMetricCard title="Culture Score" change="Great Place to Work" changeType="positive" bgColor="#3B82F6"
                        metric1={{ value: '4.8', label: 'Glassdoor' }} metric2={{ value: '92%', label: 'Recommend' }} />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-6">Leadership Team</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {leadership.map((person, i) => (
                        <Card key={i} className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow">
                            <div className={`h-24 bg-gradient-to-r ${person.color} flex items-center justify-center`}>
                                <span className="text-5xl">{person.avatar}</span>
                            </div>
                            <div className="p-5 text-center">
                                <h3 className="font-bold text-gray-900 text-lg">{person.name}</h3>
                                <p className="text-purple-600 text-sm font-medium mb-2">{person.role}</p>
                                <p className="text-gray-500 text-sm mb-4">{person.bio}</p>
                                <div className="flex justify-center gap-3">
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Linkedin className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Twitter className="w-4 h-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><Mail className="w-4 h-4" /></Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <Card className="p-6 bg-white shadow-lg">
                        <div className="flex items-center gap-2 mb-6">
                            <Briefcase className="w-5 h-5 text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-900">Departments</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {departments.map((dept, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{dept.icon}</span>
                                        <div>
                                            <p className="font-medium text-gray-900">{dept.name}</p>
                                            <p className="text-sm text-gray-500">{dept.count} people</p>
                                        </div>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{dept.growth}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <CountryVisitorsCard 
                        title="Team Locations" 
                        subtitle="Our global presence"
                        countries={teamLocations}
                    />
                </div>

                <Card className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {values.map((value, i) => (
                            <div key={i} className="text-center">
                                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
                                    <value.Icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold mb-1">{value.title}</h3>
                                <p className="text-sm text-white/80">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-8 mt-8 bg-white shadow-lg text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Team</h2>
                    <p className="text-gray-600 mb-6">We're always looking for talented individuals to join our mission</p>
                    <Button className="bg-purple-600 hover:bg-purple-700 px-8">View Open Positions</Button>
                </Card>
            </div>
        </div>
    );
}