import React, { useState } from 'react';
import { Globe, Search, X, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const COUNTRIES = ['USA', 'China', 'India', 'Germany', 'UK', 'France', 'Japan', 'Brazil', 'Canada', 'Australia', 'South Korea', 'Spain', 'Italy', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia', 'Turkey', 'Switzerland', 'Poland', 'Russia', 'South Africa', 'Nigeria', 'Egypt', 'UAE'];

export default function CountrySelectModal({ 
    isOpen, 
    onClose, 
    selectedCountry, 
    onSelect,
    title = "Select Country"
}) {
    const [search, setSearch] = useState('');

    if (!isOpen) return null;

    const filteredCountries = COUNTRIES.filter(country => 
        country.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (country) => {
        onSelect(country);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">{title}</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search countries..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Country List */}
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredCountries.map(country => (
                        <button
                            key={country}
                            onClick={() => handleSelect(country)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                                selectedCountry === country 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'hover:bg-gray-50 text-gray-700'
                            }`}
                        >
                            <span className="font-medium">{country}</span>
                            {selectedCountry === country && (
                                <Check className="w-5 h-5 text-purple-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
                    <Button onClick={onClose} variant="outline" className="w-full">
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}