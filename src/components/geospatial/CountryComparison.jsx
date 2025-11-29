import React from 'react';
import { TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';

const TOP_COUNTRIES = [
    { name: 'Sweden', score: 94, reason: 'World leader in renewable energy with 60% from renewables, strong carbon tax policies' },
    { name: 'Norway', score: 92, reason: '98% electricity from hydropower, aggressive EV adoption, sovereign wealth fund divesting from fossil fuels' },
    { name: 'Denmark', score: 90, reason: 'Pioneer in wind energy, targeting carbon neutrality by 2025, circular economy leader' },
    { name: 'Finland', score: 88, reason: 'Committed to carbon neutrality by 2035, extensive forest coverage, nuclear + renewables mix' },
    { name: 'Iceland', score: 87, reason: '100% renewable electricity from geothermal and hydro, hydrogen economy investments' },
];

const BOTTOM_COUNTRIES = [
    { name: 'Saudi Arabia', score: 28, reason: 'Heavy fossil fuel dependence, limited renewable infrastructure despite solar potential' },
    { name: 'Russia', score: 31, reason: 'Major oil & gas exporter, slow renewable transition, permafrost methane concerns' },
    { name: 'Iran', score: 33, reason: 'Fossil fuel subsidies, air quality issues, limited clean energy investment' },
    { name: 'Australia', score: 38, reason: 'Coal export economy, recent bushfire impacts, slow policy progress despite solar potential' },
    { name: 'USA', score: 45, reason: 'Mixed progress - state-level leadership but federal policy inconsistency, high per-capita emissions' },
];

export default function CountryComparison({ selectedCategories = [] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Top Performers */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Award className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Top Performers</h3>
                        <p className="text-xs text-gray-500">Leading in environmental metrics</p>
                    </div>
                </div>
                <div className="space-y-3">
                    {TOP_COUNTRIES.map((country, i) => (
                        <div 
                            key={country.name}
                            className="bg-white rounded-lg p-3 border border-emerald-100 hover:border-emerald-300 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                    <span className="font-medium text-gray-900">{country.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-emerald-600">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-sm font-semibold">{country.score}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 ml-7 line-clamp-2">{country.reason}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Needs Improvement */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Needs Improvement</h3>
                        <p className="text-xs text-gray-500">Opportunities for progress</p>
                    </div>
                </div>
                <div className="space-y-3">
                    {BOTTOM_COUNTRIES.map((country, i) => (
                        <div 
                            key={country.name}
                            className="bg-white rounded-lg p-3 border border-amber-100 hover:border-amber-300 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                    <span className="font-medium text-gray-900">{country.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-amber-600">
                                    <TrendingDown className="w-3 h-3" />
                                    <span className="text-sm font-semibold">{country.score}</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 ml-7 line-clamp-2">{country.reason}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}