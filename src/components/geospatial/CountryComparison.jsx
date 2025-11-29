import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Award, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';
import CountryDetailModal from './CountryDetailModal';

const CATEGORY_LABELS = {
    carbon: 'Carbon & Climate',
    airwater: 'Air & Water Quality',
    forests: 'Forests & Biodiversity',
    resources: 'Natural Resources',
    sustainability: 'Sustainability',
    health: 'Environmental Health',
    treasures: 'National Treasures & Protected Areas',
    coastal: 'Coastal & Coral Ecosystem',
    ocean: 'Ocean Sustainability',
    wildlife: 'Endangered Wildlife',
    biomass: 'Biomass',
    produce: 'Produce & Crops',
    dairy: 'Milk & Dairy',
    livestock: 'Livestock & Protein',
    power: 'Power Consumption',
    wellness: 'Wellness & Health',
    elements: 'Earth Elements',
    airpollution: 'Air Pollution',
    waterpollution: 'Water Pollution',
    soilpollution: 'Soil Pollution',
    plasticpollution: 'Plastic Pollution',
    noisepollution: 'Noise Pollution',
    lightpollution: 'Light Pollution',
    thermalpollution: 'Thermal Pollution',
    radioactive: 'Radioactive Pollution',
    chemical: 'Chemical Pollution',
    climatepollution: 'Climate-Linked Pollution',
};

const CATEGORY_SPECIFIC_PROMPTS = {
    coastal: `Focus ONLY on coastal and coral ecosystem metrics:
- Coral reef health percentage
- Coastal erosion rates
- Marine protected areas coverage
- Sea level rise vulnerability
- Mangrove forest coverage`,

    ocean: `Focus ONLY on ocean sustainability metrics:
- Ocean plastic concentration
- Fish stock sustainability
- Marine biodiversity index
- Shipping pollution levels
- Ocean dead zone areas`,

    wildlife: `Focus ONLY on endangered wildlife metrics:
- Number of endangered species
- Habitat protection percentage
- Anti-poaching effectiveness
- Species recovery programs
- Wildlife corridor connectivity`,

    carbon: `Focus ONLY on carbon emissions and climate metrics:
- CO2 emissions per capita (tons)
- Total emissions (gigatons)
- Renewable energy % of grid
- Carbon intensity of economy
- Net zero commitments and progress`,

    forests: `Focus ONLY on forests and biodiversity metrics:
- Forest coverage % of land
- Deforestation rate (hectares/year)
- Protected area % of territory
- Reforestation programs`,

    resources: `Focus ONLY on natural resource management:
- Mining sustainability practices
- Resource extraction rates
- Environmental damage from extraction`,

    sustainability: `Focus ONLY on sustainability metrics:
- Renewable energy capacity (GW)
- Circular economy adoption
- Waste recycling rates`,

    default: `Focus on environmental performance metrics with specific numerical data.`
};

export default function CountryComparison({ selectedCategories = [] }) {
    const [topCountries, setTopCountries] = useState([]);
    const [bottomCountries, setBottomCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastCategories, setLastCategories] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isTopPerformer, setIsTopPerformer] = useState(true);

    useEffect(() => {
        const categoriesKey = selectedCategories.sort().join(',');
        if (categoriesKey !== lastCategories && selectedCategories.length > 0) {
            setLastCategories(categoriesKey);
            fetchCountryData();
        }
    }, [selectedCategories]);

    const fetchCountryData = async () => {
        setLoading(true);
        setError(null);
        setTopCountries([]);
        setBottomCountries([]);
        
        try {
            const categoryNames = selectedCategories
                .map(c => CATEGORY_LABELS[c] || c)
                .join(', ');

            const specificMetrics = selectedCategories
                .map(c => CATEGORY_SPECIFIC_PROMPTS[c] || CATEGORY_SPECIFIC_PROMPTS.default)
                .filter(Boolean)
                .join('\n\n');

            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Analyze countries for: ${categoryNames}.

Use these metrics:
${specificMetrics}

Provide top 5 BEST and bottom 5 WORST countries with 2024 data.

REQUIREMENTS:
- Include specific numerical data (percentages, tons, etc.)
- Keep reasons concise (max 100 characters)
- Do NOT include any URLs or web links in the reason text
- Scores 0-100`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        top_performers: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    score: { type: "number" },
                                    reason: { type: "string" }
                                }
                            }
                        },
                        needs_improvement: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string" },
                                    score: { type: "number" },
                                    reason: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });

            setTopCountries(response?.top_performers || []);
            setBottomCountries(response?.needs_improvement || []);
        } catch (err) {
            console.error('Error fetching country data:', err);
            setError('Failed to load country data');
        } finally {
            setLoading(false);
        }
    };

    const handleCountryClick = (country, isTop) => {
        setSelectedCountry(country);
        setIsTopPerformer(isTop);
    };

    const categoryNames = selectedCategories.map(c => CATEGORY_LABELS[c] || c).join(', ');
    const shortCategoryNames = categoryNames.length > 40 ? categoryNames.substring(0, 40) + '...' : categoryNames;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 my-6 bg-gray-50 rounded-xl border border-gray-200">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin mr-3" />
                <span className="text-gray-600">Analyzing performance...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center py-12 my-6 bg-red-50 rounded-xl border border-red-200">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-600">{error}</span>
                <Button variant="outline" size="sm" className="ml-3" onClick={fetchCountryData}>
                    <RefreshCw className="w-4 h-4 mr-1" /> Retry
                </Button>
            </div>
        );
    }

    if (topCountries.length === 0 && bottomCountries.length === 0) {
        return null;
    }

    return (
        <>
            <div className="my-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="min-w-0 flex-1 mr-4">
                        <h3 className="font-semibold text-gray-900 truncate">Country Comparison</h3>
                        <p className="text-sm text-gray-500 truncate" title={categoryNames}>{shortCategoryNames}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchCountryData} disabled={loading} className="flex-shrink-0">
                        <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Performers */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                <Award className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-gray-900">Top Performers</h3>
                                <p className="text-xs text-gray-500 truncate">Click for details</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {topCountries.map((country, i) => (
                                <div 
                                    key={country.name}
                                    onClick={() => handleCountryClick(country, true)}
                                    className="bg-white rounded-lg p-3 border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                {i + 1}
                                            </span>
                                            <span className="font-medium text-gray-900 truncate">{country.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-600 flex-shrink-0 ml-2">
                                            <TrendingUp className="w-3 h-3" />
                                            <span className="text-sm font-semibold">{country.score}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 ml-7 line-clamp-2">{country.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Needs Improvement */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-semibold text-gray-900">Needs Improvement</h3>
                                <p className="text-xs text-gray-500 truncate">Click for details</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {bottomCountries.map((country, i) => (
                                <div 
                                    key={country.name}
                                    onClick={() => handleCountryClick(country, false)}
                                    className="bg-white rounded-lg p-3 border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                {i + 1}
                                            </span>
                                            <span className="font-medium text-gray-900 truncate">{country.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-600 flex-shrink-0 ml-2">
                                            <TrendingDown className="w-3 h-3" />
                                            <span className="text-sm font-semibold">{country.score}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600 ml-7 line-clamp-2">{country.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Country Detail Modal */}
            <CountryDetailModal
                isOpen={!!selectedCountry}
                onClose={() => setSelectedCountry(null)}
                country={selectedCountry}
                isTopPerformer={isTopPerformer}
                categories={selectedCategories.map(c => CATEGORY_LABELS[c] || c)}
            />
        </>
    );
}