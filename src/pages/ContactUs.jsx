import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { base44 } from '@/api/base44Client';
import ColoredMetricCard from '@/components/dashboard/ColoredMetricCard';

export default function ContactUs() {
    const [bannerUrl, setBannerUrl] = useState('');
    const [loadingBanner, setLoadingBanner] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        generateBanner();
    }, []);

    const generateBanner = async () => {
        try {
            const result = await base44.integrations.Core.GenerateImage({
                prompt: "Professional modern office workspace with team collaboration, warm lighting, plants, large windows with city view, people shaking hands, customer service atmosphere, photorealistic, high resolution, horizontal banner 16:9 aspect ratio"
            });
            setBannerUrl(result.url);
        } catch (error) {
            console.error('Banner generation failed:', error);
        } finally {
            setLoadingBanner(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        await new Promise(r => setTimeout(r, 1500));
        setSending(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
        alert('Message sent successfully!');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-purple-600 to-indigo-600 overflow-hidden">
                {loadingBanner ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                ) : bannerUrl && (
                    <img src={bannerUrl} alt="Contact Us" className="w-full h-full object-cover opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-indigo-900/70" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                        <p className="text-lg text-white/80">We'd love to hear from you</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6 -mt-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <ColoredMetricCard title="Response Time" change="< 24hrs" changeType="positive" bgColor="#8B5CF6"
                        metric1={{ value: '2hrs', label: 'Avg Reply' }} metric2={{ value: '98%', label: 'Satisfaction' }} />
                    <ColoredMetricCard title="Support Team" change="24/7" changeType="positive" bgColor="#10B981"
                        metric1={{ value: '50+', label: 'Agents' }} metric2={{ value: '12', label: 'Languages' }} />
                    <ColoredMetricCard title="Tickets Resolved" change="+15% this month" changeType="positive" bgColor="#3B82F6"
                        metric1={{ value: '10K+', label: 'Monthly' }} metric2={{ value: '99.2%', label: 'Success' }} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-6 bg-white shadow-lg">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                <Input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                            </div>
                            <Input placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
                            <Textarea placeholder="Your Message" rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required />
                            <Button type="submit" disabled={sending} className="w-full bg-purple-600 hover:bg-purple-700">
                                {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                Send Message
                            </Button>
                        </form>
                    </Card>

                    <div className="space-y-6">
                        <Card className="p-6 bg-white shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-900">support@1cpublishing.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Address</p>
                                        <p className="font-medium text-gray-900">123 Innovation Drive, Tech City, TC 10001</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Hours</p>
                                        <p className="font-medium text-gray-900">Mon-Fri: 9AM - 6PM EST</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
                            <MessageSquare className="w-10 h-10 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Live Chat Support</h3>
                            <p className="text-white/80 mb-4">Get instant help from our support team</p>
                            <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">Start Chat</Button>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}