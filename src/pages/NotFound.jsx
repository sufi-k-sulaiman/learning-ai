import React from 'react';
import PageMeta from '@/components/PageMeta';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { menuItems, LOGO_URL } from '@/components/NavigationConfig';
import { createPageUrl } from '@/utils';

export default function NotFound() {
    return (
        <>
            <PageMeta 
                title="404 - Page Not Found"
                description="The page you're looking for doesn't exist. Browse our available pages and features."
                keywords="404, page not found, 1cPublishing"
            />
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="text-center max-w-2xl">
                <img 
                    src={LOGO_URL} 
                    alt="Logo" 
                    className="w-20 h-20 mx-auto mb-6 rounded-xl"
                />
                
                <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
                <p className="text-gray-500 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                    <Button 
                        onClick={() => window.history.back()} 
                        variant="outline" 
                        className="gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </Button>
                    <Link to={createPageUrl('Qwirey')}>
                        <Button className="bg-purple-600 hover:bg-purple-700 gap-2 w-full">
                            <Home className="w-4 h-4" />
                            Go to Home
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {menuItems.slice(0, 12).map((item) => (
                            <Link 
                                key={item.label}
                                to={item.href}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}