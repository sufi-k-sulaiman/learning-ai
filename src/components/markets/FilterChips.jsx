import React, { useMemo } from 'react';
import { ChevronDown, Globe, Building2, Factory } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function FilterChips({ filters, setFilters, filterOptions, sectors, industries }) {
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Use passed sectors or fallback
    const sectorOptions = sectors || ['All Sectors', 'Technology', 'Finance', 'Healthcare', 'Consumer', 'Energy', 'Industrials', 'Materials', 'Utilities', 'Real Estate', 'Telecom', 'Media', 'Automotive'];
    
    // Use passed industries or fallback
    const industryOptions = industries || ['All Industries'];

    const FilterButton = ({ filterKey, label, value, defaultValue, icon: Icon, options }) => {
        const isActive = value !== defaultValue;
        return (
            <DropdownMenu>
                <DropdownMenuTrigger className={`group flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive 
                        ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-300 text-purple-700 shadow-sm' 
                        : 'bg-white/60 border-gray-200/80 text-gray-600 hover:bg-white hover:border-purple-200 hover:text-purple-600'
                } border backdrop-blur-sm`}>
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-purple-400'}`} />}
                    <span className="max-w-[100px] truncate">{isActive ? value : label}</span>
                    {isActive && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    )}
                    <ChevronDown className={`w-3 h-3 transition-transform ${isActive ? 'text-purple-500' : 'text-gray-400'}`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[140px] max-h-[300px] overflow-y-auto">
                    {options.map(opt => (
                        <DropdownMenuItem 
                            key={opt} 
                            onClick={() => handleFilterChange(filterKey, opt)}
                            className={value === opt ? 'bg-purple-50 text-purple-700 font-medium' : ''}
                        >
                            {opt}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    const MetricButton = ({ filterKey, config }) => {
        const isActive = filters[filterKey] !== 'Any';
        return (
            <DropdownMenu>
                <DropdownMenuTrigger className={`group flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20' 
                        : 'bg-white/60 border border-gray-200/80 text-gray-600 hover:bg-white hover:border-purple-200 hover:text-purple-600'
                }`}>
                    <span>{config.label}</span>
                    {isActive && (
                        <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-xs font-bold">
                            {filters[filterKey]}
                        </span>
                    )}
                    <ChevronDown className={`w-3 h-3 ${isActive ? 'text-white/80' : 'text-gray-400'}`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[120px]">
                    {config.options.map(opt => (
                        <DropdownMenuItem 
                            key={opt} 
                            onClick={() => handleFilterChange(filterKey, opt)}
                            className={filters[filterKey] === opt ? 'bg-purple-50 text-purple-700 font-medium' : ''}
                        >
                            {opt}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Location Filters */}
            <FilterButton 
                filterKey="market"
                label="Market"
                value={filters.market}
                defaultValue="All Markets"
                icon={Globe}
                options={['All Markets', 'US', 'EU', 'Asia']}
            />

            <FilterButton 
                filterKey="sector"
                label="Sector"
                value={filters.sector}
                defaultValue="All Sectors"
                icon={Building2}
                options={sectorOptions}
            />

            <FilterButton 
                filterKey="industry"
                label="Industry"
                value={filters.industry}
                defaultValue="All Industries"
                icon={Factory}
                options={industryOptions}
            />

            {/* Divider */}
            <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1 hidden md:block" />

            {/* Metric Filters */}
            {Object.entries(filterOptions).map(([key, config]) => (
                <MetricButton key={key} filterKey={key} config={config} />
            ))}
        </div>
    );
}