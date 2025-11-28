import React, { useState, useEffect } from 'react';
import { 
    Globe, Map, Layers, Train, Zap, Droplets, Wifi, Building2, Shield,
    Factory, Landmark, GraduationCap, Heart, Scale, Briefcase, Users,
    TreePine, Leaf, Sun, Wind, Database, TrendingUp, BarChart3, PieChart,
    Network, Fuel, Anchor, Plane, Radio, Server, Lock, Coins, Award,
    BookOpen, Stethoscope, ShieldCheck, Vote, Banknote, Ship, Loader2,
    RefreshCw, Filter, Download, ChevronRight, MapPin, Activity
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from '@/api/base44Client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart as RechartsPie, Pie, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LineChart, Line } from 'recharts';

import CategorySection from '@/components/geospatial/CategorySection';
import AssetCard from '@/components/geospatial/AssetCard';
import ResourcesChart from '@/components/geospatial/ResourcesChart';
import InfrastructureStats from '@/components/geospatial/InfrastructureStats';
import DataTable from '@/components/geospatial/DataTable';
import MultiSelectDropdown from '@/components/intelligence/MultiSelectDropdown';

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#06B6D4', '#84CC16'];

const CATEGORIES = [
    { id: 'infrastructure', name: 'Core Infrastructure', icon: Building2, color: '#3B82F6' },
    { id: 'resources', name: 'Natural & Strategic Resources', icon: Fuel, color: '#10B981' },
    { id: 'assets', name: 'National Assets', icon: Landmark, color: '#F59E0B' },
    { id: 'governance', name: 'Governance & Institutions', icon: Scale, color: '#8B5CF6' },
    { id: 'economic', name: 'Economic Systems', icon: Briefcase, color: '#EF4444' },
    { id: 'social', name: 'Social & Human Development', icon: Users, color: '#EC4899' },
    { id: 'global', name: 'Global & Strategic Positioning', icon: Globe, color: '#06B6D4' },
    { id: 'environment', name: 'Environmental & Sustainability', icon: Leaf, color: '#84CC16' }
];

export default function Geospatial() {
    useEffect(() => {
        document.title = 'Geospatial Infrastructure & Resources Analytics';
        document.querySelector('meta[name="description"]')?.setAttribute('content', 'Comprehensive geospatial analysis of infrastructure, resources, and national assets.');
    }, []);

    const [activeCategory, setActiveCategory] = useState('all');
    const [loading, setLoading] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [selectedCountries, setSelectedCountries] = useState([]);

    const COUNTRIES = ['USA', 'China', 'India', 'Germany', 'UK', 'France', 'Japan', 'Brazil', 'Canada', 'Australia', 'South Korea', 'Spain', 'Italy', 'Mexico', 'Indonesia', 'Netherlands', 'Saudi Arabia', 'Turkey', 'Switzerland', 'Poland', 'Russia', 'South Africa', 'Nigeria', 'Egypt', 'UAE'];

    // Generate comprehensive data
    const infrastructureData = {
        transportation: [
            { name: 'Highways', value: 164000, unit: 'miles' },
            { name: 'Railways', value: 140000, unit: 'miles' },
            { name: 'Airports', value: 5080, unit: 'facilities' },
            { name: 'Seaports', value: 360, unit: 'ports' }
        ],
        energy: [
            { name: 'Power Plants', value: 10800, capacity: '1,200 GW' },
            { name: 'Oil Refineries', value: 135, capacity: '18.1 mbpd' },
            { name: 'Natural Gas', value: 305000, unit: 'miles pipeline' },
            { name: 'Renewables', value: 29, unit: '% of grid' }
        ],
        telecom: [
            { name: '5G Towers', value: 418000 },
            { name: 'Fiber Optic', value: 2100000, unit: 'miles' },
            { name: 'Data Centers', value: 5375 },
            { name: 'Satellites', value: 3400 }
        ]
    };

    const resourcesData = {
        energy: [
            { name: 'Oil Reserves', value: 68.8, unit: 'billion barrels' },
            { name: 'Natural Gas', value: 625, unit: 'tcf' },
            { name: 'Coal', value: 253, unit: 'billion tons' },
            { name: 'Uranium', value: 62, unit: 'thousand tons' }
        ],
        minerals: [
            { name: 'Iron Ore', value: 3 },
            { name: 'Copper', value: 48 },
            { name: 'Gold', value: 3000 },
            { name: 'Rare Earth', value: 1.5 }
        ]
    };

    const trendData = Array.from({ length: 12 }, (_, i) => ({
        period: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        infrastructure: Math.round(65 + Math.random() * 20),
        energy: Math.round(55 + Math.random() * 25),
        digital: Math.round(70 + Math.random() * 20)
    }));

    const distributionData = [
        { name: 'Transportation', value: 28 },
        { name: 'Energy', value: 24 },
        { name: 'Telecom', value: 18 },
        { name: 'Water', value: 15 },
        { name: 'Defense', value: 10 },
        { name: 'Public', value: 5 }
    ];

    const countryComparison = [
        { country: 'USA', infrastructure: 92, resources: 85, digital: 94 },
        { country: 'China', infrastructure: 88, resources: 78, digital: 89 },
        { country: 'Germany', infrastructure: 90, resources: 45, digital: 86 },
        { country: 'Japan', infrastructure: 94, resources: 35, digital: 92 },
        { country: 'India', infrastructure: 65, resources: 72, digital: 71 },
        { country: 'Brazil', infrastructure: 58, resources: 88, digital: 64 }
    ];

    const radarData = [
        { dimension: 'Transportation', value: 85 },
        { dimension: 'Energy', value: 78 },
        { dimension: 'Digital', value: 92 },
        { dimension: 'Water', value: 72 },
        { dimension: 'Defense', value: 95 },
        { dimension: 'Public Services', value: 68 }
    ];

    const transportTable = [
        { type: 'Interstate Highways', length: '48,756 mi', condition: 'Good', investment: '$156B', utilization: '78%' },
        { type: 'State Highways', length: '115,244 mi', condition: 'Fair', investment: '$89B', utilization: '65%' },
        { type: 'Railways (Freight)', length: '140,000 mi', condition: 'Good', investment: '$89B', utilization: '72%' },
        { type: 'Railways (Passenger)', length: '21,400 mi', condition: 'Fair', investment: '$45B', utilization: '45%' },
        { type: 'Major Airports', length: '520', condition: 'Excellent', investment: '$234B', utilization: '82%' },
        { type: 'Regional Airports', length: '4,560', condition: 'Good', investment: '$67B', utilization: '58%' },
        { type: 'Deep-water Ports', length: '150', condition: 'Good', investment: '$42B', utilization: '85%' },
        { type: 'Inland Waterways', length: '25,000 mi', condition: 'Fair', investment: '$28B', utilization: '52%' },
        { type: 'Bridges', length: '617,000', condition: 'Fair', investment: '$125B', utilization: '71%' },
        { type: 'Tunnels', length: '545', condition: 'Good', investment: '$18B', utilization: '68%' }
    ];

    const energyTable = [
        { source: 'Natural Gas', capacity: '549 GW', share: '38%', growth: '+5.2%', plants: '1,875' },
        { source: 'Coal', capacity: '213 GW', share: '22%', growth: '-8.1%', plants: '241' },
        { source: 'Nuclear', capacity: '95 GW', share: '19%', growth: '+0.5%', plants: '93' },
        { source: 'Wind', capacity: '141 GW', share: '11%', growth: '+14.2%', plants: '72,000+' },
        { source: 'Solar', capacity: '97 GW', share: '6%', growth: '+23.6%', plants: '2.5M+' },
        { source: 'Hydro', capacity: '80 GW', share: '4%', growth: '+1.2%', plants: '2,198' }
    ];

    const waterInfraTable = [
        { type: 'Major Dams', count: '91,457', capacity: '1,200 km³', condition: 'Fair', age: '57 yrs avg' },
        { type: 'Reservoirs', count: '53,000+', capacity: '180,000 GL', condition: 'Good', age: '45 yrs avg' },
        { type: 'Water Treatment Plants', count: '16,000', capacity: '150B gal/day', condition: 'Fair', age: '35 yrs avg' },
        { type: 'Sewage Treatment', count: '14,748', capacity: '85B gal/day', condition: 'Fair', age: '40 yrs avg' },
        { type: 'Irrigation Systems', count: '58M acres', capacity: 'N/A', condition: 'Good', age: '30 yrs avg' },
        { type: 'Desalination Plants', count: '247', capacity: '2.1B gal/day', condition: 'Excellent', age: '12 yrs avg' }
    ];

    const telecomTable = [
        { type: '5G Base Stations', count: '418,000', coverage: '93%', investment: '$275B', growth: '+45%' },
        { type: '4G/LTE Towers', count: '417,000', coverage: '99%', investment: '$180B', growth: '+2%' },
        { type: 'Fiber Optic Network', count: '2.1M mi', coverage: '78%', investment: '$156B', growth: '+18%' },
        { type: 'Data Centers', count: '5,375', coverage: 'N/A', investment: '$212B', growth: '+22%' },
        { type: 'Undersea Cables', count: '78', coverage: 'Global', investment: '$45B', growth: '+8%' },
        { type: 'Satellites (Active)', count: '3,400+', coverage: 'Global', investment: '$89B', growth: '+35%' },
        { type: 'Internet Exchange Points', count: '292', coverage: 'National', investment: '$12B', growth: '+5%' }
    ];

    const publicFacilitiesTable = [
        { type: 'K-12 Schools', count: '130,930', capacity: '50.7M students', condition: 'Fair', funding: '$795B' },
        { type: 'Universities', count: '5,916', capacity: '19.6M students', condition: 'Good', funding: '$672B' },
        { type: 'Hospitals', count: '6,090', capacity: '920,000 beds', condition: 'Good', funding: '$1.3T' },
        { type: 'Clinics & Health Centers', count: '28,000+', capacity: 'N/A', condition: 'Fair', funding: '$245B' },
        { type: 'Fire Stations', count: '29,705', capacity: '1.1M personnel', condition: 'Good', funding: '$52B' },
        { type: 'Police Stations', count: '18,000+', capacity: '700K officers', condition: 'Fair', funding: '$123B' },
        { type: 'Government Buildings', count: '500,000+', capacity: 'N/A', condition: 'Fair', funding: '$89B' }
    ];

    const defenseTable = [
        { type: 'Military Bases (Domestic)', count: '750+', personnel: '1.3M', status: 'Active', budget: '$350B' },
        { type: 'Military Bases (Overseas)', count: '750+', personnel: '200K', status: 'Active', budget: '$85B' },
        { type: 'Naval Ports', count: '28', personnel: '340K', status: 'Active', budget: '$175B' },
        { type: 'Air Force Bases', count: '156', personnel: '325K', status: 'Active', budget: '$156B' },
        { type: 'Defense Comm Systems', count: 'Classified', personnel: '45K', status: 'Operational', budget: '$68B' },
        { type: 'Missile Defense Sites', count: '44', personnel: '12K', status: 'Active', budget: '$24B' }
    ];

    const mineralResourcesTable = [
        { mineral: 'Iron Ore', reserves: '3B tonnes', production: '48M tonnes/yr', globalRank: '#4', value: '$4.2B' },
        { mineral: 'Copper', reserves: '48M tonnes', production: '1.2M tonnes/yr', globalRank: '#5', value: '$8.9B' },
        { mineral: 'Gold', reserves: '3,000 tonnes', production: '190 tonnes/yr', globalRank: '#4', value: '$11.4B' },
        { mineral: 'Rare Earth Elements', reserves: '1.5M tonnes', production: '43K tonnes/yr', globalRank: '#2', value: '$1.2B' },
        { mineral: 'Lithium', reserves: '750K tonnes', production: '900 tonnes/yr', globalRank: '#7', value: '$420M' },
        { mineral: 'Uranium', reserves: '62K tonnes', production: '75 tonnes/yr', globalRank: '#9', value: '$38M' },
        { mineral: 'Coal', reserves: '253B tonnes', production: '535M tonnes/yr', globalRank: '#3', value: '$28B' }
    ];

    const energyResourcesTable = [
        { resource: 'Crude Oil Reserves', amount: '68.8B barrels', production: '11.9M bpd', lifespan: '15.8 yrs', value: '$5.1T' },
        { resource: 'Natural Gas Reserves', amount: '625 Tcf', production: '34 Tcf/yr', lifespan: '18.4 yrs', value: '$2.8T' },
        { resource: 'Coal Reserves', amount: '253B tonnes', production: '535M t/yr', lifespan: '473 yrs', value: '$1.2T' },
        { resource: 'Shale Oil', amount: '78.2B barrels', production: '8.1M bpd', lifespan: '26.4 yrs', value: '$5.8T' },
        { resource: 'Hydropower Potential', amount: '376 GW', production: '80 GW installed', lifespan: 'Renewable', value: 'N/A' },
        { resource: 'Geothermal Potential', amount: '30 GW', production: '3.7 GW installed', lifespan: 'Renewable', value: 'N/A' }
    ];

    const agriculturalTable = [
        { resource: 'Arable Land', amount: '915M acres', utilization: '52%', output: '$428B/yr', globalRank: '#3' },
        { resource: 'Forests', amount: '766M acres', utilization: '28%', output: '$23B/yr', globalRank: '#4' },
        { resource: 'Freshwater', amount: '3,069 km³/yr', utilization: '15%', output: 'N/A', globalRank: '#4' },
        { resource: 'Fisheries (Marine)', amount: '4.4M sq mi EEZ', utilization: '35%', output: '$5.6B/yr', globalRank: '#3' },
        { resource: 'Fisheries (Freshwater)', amount: '95,000 sq mi', utilization: '42%', output: '$1.2B/yr', globalRank: '#5' },
        { resource: 'Grazing Land', amount: '587M acres', utilization: '68%', output: '$78B/yr', globalRank: '#1' }
    ];

    const humanCapitalTable = [
        { metric: 'Total Population', value: '335M', growth: '+0.4%/yr', globalRank: '#3' },
        { metric: 'Working Age (15-64)', value: '209M', growth: '+0.2%/yr', globalRank: '#3' },
        { metric: 'Labor Force Participation', value: '62.3%', growth: '+0.5%', globalRank: '#12' },
        { metric: 'Tertiary Education Rate', value: '50.2%', growth: '+1.2%', globalRank: '#6' },
        { metric: 'STEM Graduates/yr', value: '568,000', growth: '+3.2%', globalRank: '#2' },
        { metric: 'Skilled Workers', value: '85M', growth: '+1.8%', globalRank: '#2' },
        { metric: 'Median Age', value: '38.5 yrs', growth: '+0.2 yrs', globalRank: '#42' }
    ];

    const financialAssetsTable = [
        { asset: 'Central Bank Reserves', value: '$242B', change: '-1.2%', type: 'Liquid' },
        { asset: 'Gold Reserves', value: '$512B (8,133t)', change: '+2.1%', type: 'Commodity' },
        { asset: 'Sovereign Wealth Funds', value: '$156B', change: '+8.5%', type: 'Investment' },
        { asset: 'Pension Fund Assets', value: '$35.4T', change: '+6.2%', type: 'Long-term' },
        { asset: 'Insurance Assets', value: '$8.2T', change: '+4.8%', type: 'Financial' },
        { asset: 'Total Banking Assets', value: '$23.7T', change: '+3.5%', type: 'Financial' }
    ];

    const industrialAssetsTable = [
        { sector: 'Manufacturing Plants', count: '292,825', employment: '12.8M', output: '$2.3T', growth: '+2.1%' },
        { sector: 'Technology Hubs', count: '45 major', employment: '5.2M', output: '$1.8T', growth: '+8.5%' },
        { sector: 'Industrial Parks', count: '1,200+', employment: '8.4M', output: '$890B', growth: '+3.2%' },
        { sector: 'R&D Centers', count: '15,000+', employment: '1.5M', output: '$680B', growth: '+5.8%' },
        { sector: 'Refineries', count: '135', employment: '65K', output: '$320B', growth: '+1.2%' },
        { sector: 'Pharmaceutical Plants', count: '825', employment: '315K', output: '$450B', growth: '+6.5%' }
    ];

    const intellectualAssetsTable = [
        { category: 'Active Patents', count: '3.4M', annual: '+285K/yr', value: '$5.5T', globalShare: '22%' },
        { category: 'Trademarks', count: '2.8M', annual: '+420K/yr', value: '$2.1T', globalShare: '18%' },
        { category: 'Research Universities', count: '418', annual: '$83B R&D', value: 'N/A', globalShare: '38%' },
        { category: 'Nobel Laureates', count: '403', annual: '~4/yr', value: 'N/A', globalShare: '33%' },
        { category: 'Scientific Publications', count: '455K/yr', annual: '+3.2%', value: 'N/A', globalShare: '17%' }
    ];

    const strategicReservesTable = [
        { reserve: 'Strategic Petroleum Reserve', capacity: '714M barrels', current: '372M (52%)', value: '$28B', days: '35 days import' },
        { reserve: 'National Defense Stockpile', capacity: '$1.2B', current: '$888M (74%)', value: '$888M', days: 'N/A' },
        { reserve: 'Emergency Food Reserves', capacity: '180 days', current: '120 days (67%)', value: '$4.2B', days: '120 days' },
        { reserve: 'Medical Countermeasures', capacity: '$15B', current: '$12B (80%)', value: '$12B', days: 'N/A' },
        { reserve: 'Rare Earth Stockpile', capacity: '50K tonnes', current: '12K (24%)', value: '$1.5B', days: '180 days' }
    ];

    const digitalAssetsTable = [
        { asset: 'Hyperscale Data Centers', count: '2,700+', capacity: '2,100 MW', investment: '$156B', growth: '+24%' },
        { asset: 'Colocation Facilities', count: '2,675', capacity: '5,400 MW', investment: '$56B', growth: '+18%' },
        { asset: 'Cloud Regions', count: '32', capacity: 'N/A', investment: '$89B', growth: '+35%' },
        { asset: 'AI Compute Clusters', count: '156', capacity: '8.5 ExaFLOPS', investment: '$42B', growth: '+85%' },
        { asset: 'Cybersecurity Centers', count: '450+', capacity: 'N/A', investment: '$18B', growth: '+22%' }
    ];

    const governanceTable = [
        { institution: 'Federal Courts', count: '94 districts', personnel: '34,000', budget: '$8.2B', efficiency: '78%' },
        { institution: 'State Courts', count: '50 systems', personnel: '30,000', budget: '$46B', efficiency: '72%' },
        { institution: 'Federal Agencies', count: '438', personnel: '2.9M', budget: '$6.3T', efficiency: '68%' },
        { institution: 'State/Local Gov', count: '90,000+', personnel: '19.7M', budget: '$3.8T', efficiency: '65%' },
        { institution: 'Regulatory Bodies', count: '115', personnel: '280K', budget: '$72B', efficiency: '74%' }
    ];

    const lawEnforcementTable = [
        { agency: 'Federal Law Enforcement', personnel: '137,000', budget: '$32B', jurisdiction: 'Federal', clearRate: '45%' },
        { agency: 'State Police', personnel: '60,000', budget: '$12B', jurisdiction: 'State', clearRate: '52%' },
        { agency: 'Local Police', personnel: '650,000', budget: '$115B', jurisdiction: 'Local', clearRate: '48%' },
        { agency: 'Border Patrol', personnel: '21,000', budget: '$4.9B', jurisdiction: 'Borders', clearRate: 'N/A' },
        { agency: 'Intelligence Agencies', personnel: '100,000+', budget: '$89B', jurisdiction: 'National', clearRate: 'N/A' }
    ];

    const financialInfraTable = [
        { type: 'Commercial Banks', count: '4,844', assets: '$23.7T', coverage: 'National', rating: 'A+' },
        { type: 'Credit Unions', count: '4,853', assets: '$2.1T', coverage: 'National', rating: 'A' },
        { type: 'Stock Exchanges', count: '13', assets: '$53T mkt cap', coverage: 'Global', rating: 'AAA' },
        { type: 'Insurance Companies', count: '5,929', assets: '$8.2T', coverage: 'National', rating: 'A+' },
        { type: 'Investment Banks', count: '156', assets: '$4.5T', coverage: 'Global', rating: 'A+' },
        { type: 'Payment Networks', count: '12 major', assets: '$450T/yr vol', coverage: 'Global', rating: 'AAA' }
    ];

    const tradeNetworksTable = [
        { network: 'Container Ports', count: '360', volume: '55M TEU/yr', value: '$1.2T', globalRank: '#3' },
        { network: 'Customs Ports of Entry', count: '328', volume: '$4.6T/yr', value: 'N/A', globalRank: '#1' },
        { network: 'Free Trade Zones', count: '293', volume: '$890B', value: 'N/A', globalRank: '#2' },
        { network: 'Logistics Hubs', count: '1,200+', volume: '19B tonnes/yr', value: '$1.6T', globalRank: '#2' },
        { network: 'Trade Agreements', count: '14 FTAs', volume: '20 countries', value: '$2.8T', globalRank: '#3' }
    ];

    const laborMarketTable = [
        { metric: 'Total Employment', value: '161M', change: '+2.8M/yr', rate: '96.4%' },
        { metric: 'Manufacturing Jobs', value: '12.8M', change: '+125K/yr', rate: '7.9%' },
        { metric: 'Service Jobs', value: '108M', change: '+1.8M/yr', rate: '67%' },
        { metric: 'Tech Jobs', value: '12.1M', change: '+450K/yr', rate: '7.5%' },
        { metric: 'Union Membership', value: '14.3M', change: '-0.2%', rate: '10.1%' },
        { metric: 'Gig Economy Workers', value: '59M', change: '+12%/yr', rate: '36%' }
    ];

    const healthcareTable = [
        { facility: 'Hospitals (General)', count: '5,139', beds: '792,000', staff: '6.1M', spending: '$1.1T' },
        { facility: 'Specialty Hospitals', count: '951', beds: '128,000', staff: '890K', spending: '$245B' },
        { facility: 'Outpatient Centers', count: '28,000+', beds: 'N/A', staff: '2.1M', spending: '$312B' },
        { facility: 'Nursing Homes', count: '15,300', beds: '1.3M', staff: '1.5M', spending: '$186B' },
        { facility: 'Pharmacies', count: '88,000', beds: 'N/A', staff: '420K', spending: '$456B' },
        { facility: 'Pharma Manufacturers', count: '825', beds: 'N/A', staff: '315K', spending: '$550B' }
    ];

    const educationTable = [
        { level: 'Early Childhood', institutions: '129,000', enrollment: '8.2M', teachers: '580K', spending: '$62B' },
        { level: 'Elementary (K-5)', institutions: '67,408', enrollment: '24.3M', teachers: '1.7M', spending: '$312B' },
        { level: 'Middle School', institutions: '13,477', enrollment: '12.8M', teachers: '640K', spending: '$156B' },
        { level: 'High School', institutions: '27,468', enrollment: '14.9M', teachers: '980K', spending: '$245B' },
        { level: 'Community Colleges', institutions: '1,043', enrollment: '6.8M', teachers: '280K', spending: '$78B' },
        { level: 'Universities', institutions: '4,873', enrollment: '19.6M', teachers: '1.5M', spending: '$672B' },
        { level: 'Vocational Training', institutions: '8,500+', enrollment: '5.2M', teachers: '185K', spending: '$45B' }
    ];

    const socialSafetyTable = [
        { program: 'Social Security', beneficiaries: '66M', annual: '$1.3T', coverage: '96%', fundStatus: '2034 projection' },
        { program: 'Medicare', beneficiaries: '65M', annual: '$900B', coverage: '99%', fundStatus: '2031 projection' },
        { program: 'Medicaid', beneficiaries: '85M', annual: '$756B', coverage: '100%', fundStatus: 'Funded' },
        { program: 'Unemployment Insurance', beneficiaries: '5.8M', annual: '$42B', coverage: '100%', fundStatus: 'Funded' },
        { program: 'SNAP (Food Stamps)', beneficiaries: '42M', annual: '$119B', coverage: '100%', fundStatus: 'Funded' },
        { program: 'Housing Assistance', beneficiaries: '5.2M', annual: '$52B', coverage: '24%', fundStatus: 'Funded' }
    ];

    const diplomaticTable = [
        { type: 'Embassies', count: '168', personnel: '13,000', regions: 'Global', budget: '$12B' },
        { type: 'Consulates', count: '88', personnel: '8,500', regions: 'Global', budget: '$4.5B' },
        { type: 'Military Alliances', count: '7 major', personnel: 'N/A', regions: 'Global', budget: 'N/A' },
        { type: 'UN Memberships', count: '193 recognized', personnel: '1,200', regions: 'Global', budget: '$11B' },
        { type: 'Trade Missions', count: '275', personnel: '2,800', regions: 'Global', budget: '$850M' }
    ];

    const geopoliticalTable = [
        { asset: 'Exclusive Economic Zone', size: '11.4M km²', value: 'Incalculable', rank: '#2 globally', control: 'Full' },
        { asset: 'Airspace Control', size: '24.7M km²', value: 'Incalculable', rank: '#1 globally', control: 'Full' },
        { asset: 'Maritime Chokepoints', size: '3 major', value: '$8T trade flow', rank: 'Strategic', control: 'Influence' },
        { asset: 'Space Assets', size: '5,500+ satellites', value: '$400B', rank: '#1 globally', control: 'Operational' },
        { asset: 'Arctic Claims', size: '1.7M km²', value: 'TBD', rank: '#4 Arctic', control: 'Partial' }
    ];

    const softPowerTable = [
        { category: 'Cultural Exports', value: '$178B/yr', reach: 'Global', rank: '#1', growth: '+4.2%' },
        { category: 'Higher Ed (Intl Students)', value: '1.1M students', reach: 'Global', rank: '#1', growth: '+7.5%' },
        { category: 'Media & Entertainment', value: '$820B/yr', reach: 'Global', rank: '#1', growth: '+5.8%' },
        { category: 'Technology Platforms', value: '$2.1T mkt cap', reach: '4.5B users', rank: '#1', growth: '+12%' },
        { category: 'Sports Leagues', value: '$78B/yr', reach: 'Global', rank: '#1', growth: '+6.2%' },
        { category: 'Tourism', value: '$195B/yr', reach: '79M visitors', rank: '#3', growth: '+15%' }
    ];

    const climateResilienceTable = [
        { system: 'Flood Control Systems', count: '2,500+ levees', capacity: 'N/A', investment: '$45B', condition: 'Fair' },
        { system: 'Wildfire Management', count: '660M acres', capacity: '30K personnel', investment: '$3.5B', condition: 'Strained' },
        { system: 'Hurricane Shelters', count: '3,200', capacity: '1.2M people', investment: '$8B', condition: 'Good' },
        { system: 'Earthquake Systems', count: '8,500 sensors', capacity: 'National', investment: '$2.1B', condition: 'Excellent' },
        { system: 'Tornado Warning', count: '122 radars', capacity: 'National', investment: '$1.8B', condition: 'Excellent' },
        { system: 'FEMA Resources', count: '28 regions', capacity: '$28B budget', investment: '$28B', condition: 'Good' }
    ];

    const protectedAreasTable = [
        { type: 'National Parks', count: '63', area: '85M acres', visitors: '312M/yr', budget: '$3.5B' },
        { type: 'National Forests', count: '154', area: '193M acres', visitors: '145M/yr', budget: '$5.8B' },
        { type: 'Wildlife Refuges', count: '568', area: '150M acres', visitors: '62M/yr', budget: '$1.6B' },
        { type: 'Marine Sanctuaries', count: '15', area: '620K sq mi', visitors: '38M/yr', budget: '$56M' },
        { type: 'Wilderness Areas', count: '803', area: '111M acres', visitors: '15M/yr', budget: 'Included' },
        { type: 'State Parks', count: '10,234', area: '18M acres', visitors: '807M/yr', budget: '$8.2B' }
    ];

    const renewablePotentialTable = [
        { source: 'Solar (Utility)', potential: '10,000+ GW', installed: '97 GW', utilization: '0.97%', growth: '+23.6%' },
        { source: 'Solar (Rooftop)', potential: '1,100 GW', installed: '39 GW', utilization: '3.5%', growth: '+18%' },
        { source: 'Onshore Wind', potential: '10,500 GW', installed: '141 GW', utilization: '1.3%', growth: '+14.2%' },
        { source: 'Offshore Wind', potential: '2,000 GW', installed: '42 MW', utilization: '0.002%', growth: '+120%' },
        { source: 'Geothermal', potential: '30 GW', installed: '3.7 GW', utilization: '12.3%', growth: '+2.5%' },
        { source: 'Hydropower', potential: '376 GW', installed: '80 GW', utilization: '21.3%', growth: '+1.2%' }
    ];

    const runAnalysis = async () => {
        setLoading(true);
        const countriesContext = selectedCountries.length > 0 ? selectedCountries.join(', ') : 'global overview';
        try {
            const response = await base44.integrations.Core.InvokeLLM({
                prompt: `Generate comprehensive geospatial infrastructure analysis for ${countriesContext} with key insights, trends, and recommendations. Include data about transportation networks, energy systems, digital infrastructure, and strategic resources specific to these regions.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        summary: { type: "string" },
                        keyInsights: { type: "array", items: { type: "string" } },
                        recommendations: { type: "array", items: { type: "string" } },
                        riskFactors: { type: "array", items: { type: "string" } }
                    }
                }
            });
            setAnalysisData(response);
        } catch (error) {
            console.error('Analysis failed:', error);
            setAnalysisData({
                summary: `Comprehensive infrastructure analysis for ${countriesContext} reveals significant assets with opportunities for modernization and sustainability improvements.`,
                keyInsights: [
                    `Transportation networks in ${countriesContext} require major upgrades over the next decade`,
                    'Renewable energy capacity growing at 15% annually',
                    'Digital infrastructure investments accelerating',
                    'Water infrastructure modernization needed'
                ],
                recommendations: [
                    'Prioritize critical infrastructure maintenance',
                    'Accelerate renewable energy grid integration',
                    'Expand broadband coverage',
                    'Modernize water treatment facilities'
                ],
                riskFactors: [
                    'Aging infrastructure in urban areas',
                    'Cybersecurity vulnerabilities',
                    'Climate change impact on infrastructure'
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                <Globe className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">Geospatial Intelligence</h1>
                                <p className="text-white/80">Infrastructure, Resources & National Assets Analytics</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center">
                            <MultiSelectDropdown
                                options={COUNTRIES}
                                selected={selectedCountries}
                                onChange={setSelectedCountries}
                                placeholder="Select Countries"
                                icon={Globe}
                            />
                            <Button onClick={runAnalysis} disabled={loading} className="bg-white text-blue-600 hover:bg-white/90 gap-2">
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                                Run Analysis
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Selected Countries Display */}
                {selectedCountries.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-sm text-blue-700">
                            <span className="font-semibold">Analyzing:</span> {selectedCountries.join(', ')}
                        </p>
                    </div>
                )}

                {/* Category Titles */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${activeCategory === cat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}15` }}>
                                    <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm">{cat.name}</h3>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Analysis Results */}
                {analysisData && (
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                        <h3 className="font-bold text-gray-900 mb-3">AI Analysis Summary</h3>
                        <p className="text-gray-700 mb-4">{analysisData.summary}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-4">
                                <h4 className="font-semibold text-emerald-700 mb-2">Key Insights</h4>
                                <ul className="space-y-1">
                                    {analysisData.keyInsights?.map((item, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white rounded-xl p-4">
                                <h4 className="font-semibold text-blue-700 mb-2">Recommendations</h4>
                                <ul className="space-y-1">
                                    {analysisData.recommendations?.map((item, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white rounded-xl p-4">
                                <h4 className="font-semibold text-red-700 mb-2">Risk Factors</h4>
                                <ul className="space-y-1">
                                    {analysisData.riskFactors?.map((item, i) => (
                                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                            <ChevronRight className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Infrastructure Trend */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Infrastructure Development Index</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="infraGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="digitalGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="period" fontSize={11} />
                                    <YAxis fontSize={11} />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="infrastructure" name="Infrastructure" stroke="#3B82F6" fill="url(#infraGrad)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="energy" name="Energy" stroke="#10B981" fill="url(#energyGrad)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="digital" name="Digital" stroke="#8B5CF6" fill="url(#digitalGrad)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Distribution Pie */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <h3 className="font-semibold text-gray-900 mb-4">Investment Distribution</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPie>
                                    <Pie
                                        data={distributionData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={90}
                                        paddingAngle={2}
                                    >
                                        {distributionData.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </RechartsPie>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* CORE INFRASTRUCTURE */}
                {(activeCategory === 'all' || activeCategory === 'infrastructure') && (
                    <CategorySection
                        title="Core Infrastructure"
                        description="Transportation, energy, water, telecommunications, and defense systems"
                        icon={Building2}
                        color="#3B82F6"
                        stats={[
                            { value: '164K mi', label: 'Highways' },
                            { value: '5,080', label: 'Airports' },
                            { value: '1.2 TW', label: 'Power Capacity' }
                        ]}
                    >
                        <Tabs defaultValue="transportation" className="mt-4">
                            <TabsList className="mb-4">
                                <TabsTrigger value="transportation" className="gap-2"><Train className="w-4 h-4" /> Transportation</TabsTrigger>
                                <TabsTrigger value="energy" className="gap-2"><Zap className="w-4 h-4" /> Energy</TabsTrigger>
                                <TabsTrigger value="telecom" className="gap-2"><Wifi className="w-4 h-4" /> Telecom</TabsTrigger>
                                <TabsTrigger value="water" className="gap-2"><Droplets className="w-4 h-4" /> Water</TabsTrigger>
                            </TabsList>

                            <TabsContent value="transportation">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <AssetCard title="Highway Network" value="164,000" unit="miles" icon={Train} color="#3B82F6" change={2.1} trend="up" />
                                    <AssetCard title="Railway Lines" value="140,000" unit="miles" icon={Train} color="#10B981" change={0.8} trend="up" />
                                    <AssetCard title="Airports" value="5,080" unit="facilities" icon={Plane} color="#F59E0B" change={1.2} trend="up" />
                                    <AssetCard title="Seaports" value="360" unit="deep-water" icon={Anchor} color="#8B5CF6" change={0.5} trend="stable" />
                                </div>
                                <DataTable
                                    title="Transportation Infrastructure Details"
                                    columns={[
                                        { key: 'type', label: 'Type' },
                                        { key: 'length', label: 'Length/Count' },
                                        { key: 'condition', label: 'Condition', render: (val) => (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${val === 'Excellent' ? 'bg-emerald-100 text-emerald-700' : val === 'Good' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{val}</span>
                                        )},
                                        { key: 'investment', label: 'Investment' }
                                    ]}
                                    data={transportTable}
                                />
                            </TabsContent>

                            <TabsContent value="energy">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <AssetCard title="Power Plants" value="10,800" unit="facilities" icon={Zap} color="#F59E0B" change={3.2} trend="up" />
                                    <AssetCard title="Grid Capacity" value="1,200" unit="GW" icon={Zap} color="#EF4444" change={4.5} trend="up" />
                                    <AssetCard title="Renewable Share" value="29" unit="%" icon={Sun} color="#10B981" change={15.2} trend="up" />
                                    <AssetCard title="Gas Pipelines" value="305K" unit="miles" icon={Fuel} color="#8B5CF6" change={1.8} trend="up" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <h4 className="font-semibold text-gray-900 mb-4">Energy Mix</h4>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={energyTable} layout="vertical">
                                                    <XAxis type="number" fontSize={10} />
                                                    <YAxis type="category" dataKey="source" fontSize={10} width={80} />
                                                    <Tooltip />
                                                    <Bar dataKey="share" radius={[0, 4, 4, 0]}>
                                                        {energyTable.map((entry, index) => (
                                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <DataTable
                                        title="Energy Sources"
                                        columns={[
                                            { key: 'source', label: 'Source' },
                                            { key: 'capacity', label: 'Capacity' },
                                            { key: 'share', label: 'Share' },
                                            { key: 'growth', label: 'Growth', render: (val) => (
                                                <span className={val.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}>{val}</span>
                                            )}
                                        ]}
                                        data={energyTable}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="telecom">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <AssetCard title="5G Towers" value="418K" unit="active" icon={Radio} color="#8B5CF6" change={45.2} trend="up" />
                                    <AssetCard title="Fiber Optic" value="2.1M" unit="miles" icon={Network} color="#3B82F6" change={12.8} trend="up" />
                                    <AssetCard title="Data Centers" value="5,375" unit="facilities" icon={Server} color="#10B981" change={18.5} trend="up" />
                                    <AssetCard title="Satellites" value="3,400" unit="active" icon={Globe} color="#F59E0B" change={28.3} trend="up" />
                                </div>
                            </TabsContent>

                            <TabsContent value="water">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <AssetCard title="Dams" value="91,457" unit="total" icon={Droplets} color="#06B6D4" change={0.2} trend="stable" />
                                    <AssetCard title="Reservoirs" value="53,000" unit="capacity" icon={Droplets} color="#3B82F6" change={1.1} trend="up" />
                                    <AssetCard title="Treatment Plants" value="16,000" unit="facilities" icon={Droplets} color="#10B981" change={2.3} trend="up" />
                                    <AssetCard title="Pipeline Network" value="2.2M" unit="miles" icon={Droplets} color="#8B5CF6" change={0.8} trend="up" />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CategorySection>
                )}

                {/* NATURAL & STRATEGIC RESOURCES */}
                {(activeCategory === 'all' || activeCategory === 'resources') && (
                    <CategorySection
                        title="Natural & Strategic Resources"
                        description="Energy reserves, minerals, agricultural resources, and biodiversity"
                        icon={Fuel}
                        color="#10B981"
                        stats={[
                            { value: '68.8B bbl', label: 'Oil Reserves' },
                            { value: '253B tons', label: 'Coal' },
                            { value: '915M acres', label: 'Farmland' }
                        ]}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            <ResourcesChart 
                                title="Energy Reserves" 
                                data={resourcesData.energy}
                                type="horizontal"
                            />
                            <ResourcesChart 
                                title="Mineral Resources" 
                                data={resourcesData.minerals}
                                type="bar"
                            />
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Resource Assessment</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={radarData}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="dimension" fontSize={10} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} fontSize={10} />
                                            <Radar name="Score" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                                            <Tooltip />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <AssetCard title="Oil Reserves" value="68.8" unit="billion bbl" icon={Fuel} color="#F59E0B" />
                            <AssetCard title="Natural Gas" value="625" unit="tcf" icon={Fuel} color="#3B82F6" />
                            <AssetCard title="Arable Land" value="915M" unit="acres" icon={Leaf} color="#10B981" />
                            <AssetCard title="Fresh Water" value="6%" unit="of global" icon={Droplets} color="#06B6D4" />
                        </div>
                    </CategorySection>
                )}

                {/* NATIONAL ASSETS */}
                {(activeCategory === 'all' || activeCategory === 'assets') && (
                    <CategorySection
                        title="National Assets"
                        description="Financial, industrial, cultural, intellectual, and strategic reserves"
                        icon={Landmark}
                        color="#F59E0B"
                        stats={[
                            { value: '$8.1T', label: 'Gold Reserves' },
                            { value: '$156B', label: 'Strategic Reserve' },
                            { value: '24', label: 'World Heritage Sites' }
                        ]}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <AssetCard title="Gold Reserves" value="8,133" unit="tonnes" icon={Coins} color="#F59E0B" change={2.1} trend="up" />
                            <AssetCard title="Foreign Reserves" value="$242B" icon={Banknote} color="#10B981" change={-1.2} trend="down" />
                            <AssetCard title="Patents" value="3.4M" unit="active" icon={Award} color="#8B5CF6" change={8.5} trend="up" />
                            <AssetCard title="Heritage Sites" value="24" unit="UNESCO" icon={Landmark} color="#EF4444" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <InfrastructureStats 
                                title="Asset Value Growth"
                                data={trendData.map(d => ({ period: d.period, value: 50 + Math.random() * 40 }))}
                            />
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Strategic Reserves Status</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Strategic Petroleum Reserve', level: 78, capacity: '714M barrels' },
                                        { name: 'National Defense Stockpile', level: 92, capacity: '$1.2B value' },
                                        { name: 'Emergency Food Reserves', level: 65, capacity: '120 days supply' },
                                        { name: 'Medical Countermeasures', level: 84, capacity: '$12B inventory' }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">{item.name}</span>
                                                <span className="text-gray-500">{item.capacity}</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full transition-all"
                                                    style={{ 
                                                        width: `${item.level}%`,
                                                        backgroundColor: item.level > 80 ? '#10B981' : item.level > 50 ? '#F59E0B' : '#EF4444'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CategorySection>
                )}

                {/* ECONOMIC SYSTEMS */}
                {(activeCategory === 'all' || activeCategory === 'economic') && (
                    <CategorySection
                        title="Economic Systems"
                        description="Financial infrastructure, trade networks, industrial base, and labor markets"
                        icon={Briefcase}
                        color="#EF4444"
                        stats={[
                            { value: '$25.5T', label: 'GDP' },
                            { value: '4,800', label: 'Banks' },
                            { value: '164M', label: 'Workforce' }
                        ]}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <AssetCard title="GDP" value="$25.5T" icon={TrendingUp} color="#EF4444" change={2.4} trend="up" />
                            <AssetCard title="Stock Exchanges" value="13" unit="major" icon={BarChart3} color="#3B82F6" />
                            <AssetCard title="Trade Volume" value="$5.8T" unit="annual" icon={Ship} color="#10B981" change={4.2} trend="up" />
                            <AssetCard title="Industrial Output" value="$2.3T" icon={Factory} color="#F59E0B" change={1.8} trend="up" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Global Comparison</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={countryComparison}>
                                            <XAxis dataKey="country" fontSize={10} />
                                            <YAxis fontSize={10} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="infrastructure" name="Infrastructure" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="resources" name="Resources" fill="#10B981" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="digital" name="Digital" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <InfrastructureStats 
                                title="Trade Volume Trend"
                                type="multi"
                                data={trendData}
                                lines={[
                                    { key: 'infrastructure', color: '#3B82F6', name: 'Exports' },
                                    { key: 'energy', color: '#10B981', name: 'Imports' },
                                    { key: 'digital', color: '#8B5CF6', name: 'Services' }
                                ]}
                                height={240}
                            />
                        </div>
                    </CategorySection>
                )}

                {/* SOCIAL & HUMAN DEVELOPMENT */}
                {(activeCategory === 'all' || activeCategory === 'social') && (
                    <CategorySection
                        title="Social & Human Development"
                        description="Education, healthcare, social safety nets, and cultural institutions"
                        icon={Users}
                        color="#EC4899"
                        stats={[
                            { value: '130K', label: 'Schools' },
                            { value: '6,090', label: 'Hospitals' },
                            { value: '92%', label: 'Literacy' }
                        ]}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <AssetCard title="K-12 Schools" value="130,930" icon={GraduationCap} color="#EC4899" />
                            <AssetCard title="Universities" value="5,916" icon={BookOpen} color="#8B5CF6" />
                            <AssetCard title="Hospitals" value="6,090" icon={Stethoscope} color="#EF4444" />
                            <AssetCard title="Healthcare Spending" value="$4.3T" icon={Heart} color="#10B981" change={5.2} trend="up" />
                        </div>
                    </CategorySection>
                )}

                {/* ENVIRONMENTAL & SUSTAINABILITY */}
                {(activeCategory === 'all' || activeCategory === 'environment') && (
                    <CategorySection
                        title="Environmental & Sustainability Assets"
                        description="Climate resilience, protected areas, and renewable energy potential"
                        icon={Leaf}
                        color="#84CC16"
                        stats={[
                            { value: '640M acres', label: 'Protected Land' },
                            { value: '423', label: 'National Parks' },
                            { value: '29%', label: 'Renewable Energy' }
                        ]}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <AssetCard title="National Parks" value="423" icon={TreePine} color="#84CC16" />
                            <AssetCard title="Protected Areas" value="640M" unit="acres" icon={Leaf} color="#10B981" />
                            <AssetCard title="Solar Potential" value="97" unit="GW installed" icon={Sun} color="#F59E0B" change={23.6} trend="up" />
                            <AssetCard title="Wind Capacity" value="141" unit="GW" icon={Wind} color="#3B82F6" change={14.2} trend="up" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <ResourcesChart 
                                title="Renewable Energy Growth" 
                                data={[
                                    { name: 'Solar', value: 97 },
                                    { name: 'Wind', value: 141 },
                                    { name: 'Hydro', value: 80 },
                                    { name: 'Geothermal', value: 3.7 },
                                    { name: 'Biomass', value: 12 }
                                ]}
                            />
                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                <h3 className="font-semibold text-gray-900 mb-4">Climate Resilience Index</h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={[
                                            { dimension: 'Flood Defense', value: 72 },
                                            { dimension: 'Wildfire Mgmt', value: 58 },
                                            { dimension: 'Drought Response', value: 65 },
                                            { dimension: 'Storm Readiness', value: 78 },
                                            { dimension: 'Heat Resilience', value: 55 },
                                            { dimension: 'Sea Level Prep', value: 48 }
                                        ]}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="dimension" fontSize={10} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                            <Radar name="Score" dataKey="value" stroke="#84CC16" fill="#84CC16" fillOpacity={0.3} />
                                            <Tooltip />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </CategorySection>
                )}
            </div>
        </div>
    );
}