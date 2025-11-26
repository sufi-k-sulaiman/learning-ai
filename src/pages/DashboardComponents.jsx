import React from 'react';
import MetricCard from '../components/dashboard/MetricCard';
import SalesDetailsCard from '../components/dashboard/SalesDetailsCard';
import SocialMediaCard from '../components/dashboard/SocialMediaCard';
import BrowserVisitorsCard from '../components/dashboard/BrowserVisitorsCard';
import CountryVisitorsCard from '../components/dashboard/CountryVisitorsCard';
import BudgetDonutCard from '../components/dashboard/BudgetDonutCard';
import RevenueCard from '../components/dashboard/RevenueCard';
import SalesPieCard from '../components/dashboard/SalesPieCard';
import StatsRow from '../components/dashboard/StatsRow';
import AnalyticsChart from '../components/dashboard/AnalyticsChart';
import MiniStatCard from '../components/dashboard/MiniStatCard';
import ColoredMetricCard from '../components/dashboard/ColoredMetricCard';
import RadialProgressCard from '../components/dashboard/RadialProgressCard';
import HorizontalBarChart from '../components/dashboard/HorizontalBarChart';
import LineChartWithMarkers from '../components/dashboard/LineChartWithMarkers';
import PieChartCard from '../components/dashboard/PieChartCard';
import RankingPodium from '../components/dashboard/RankingPodium';
import InfoCard from '../components/dashboard/InfoCard';

export default function DashboardComponents() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Components</h1>
                <p className="text-gray-500 mb-8">Reusable analytics and metrics components</p>

                {/* Stats Row */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Stats Overview</h2>
                    <StatsRow />
                </section>

                {/* Metric Cards */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Metric Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard 
                            title="Barrier Strength"
                            subtitle="Market Protection"
                            value="Medium"
                            change="+4%"
                            changeType="positive"
                            bgColor="#6B4EE6"
                            sparklineData={[30, 45, 35, 50, 40, 60, 55, 70, 65, 80]}
                        />
                        <MetricCard 
                            title="Threat Level"
                            subtitle="Innovation Index"
                            value="Low"
                            change="-2%"
                            changeType="negative"
                            bgColor="#50C8E8"
                            sparklineData={[60, 55, 65, 50, 70, 55, 60, 50, 65, 55]}
                        />
                        <MetricCard 
                            title="Growth Rate"
                            subtitle="Monthly Progress"
                            value="High"
                            change="+12%"
                            changeType="positive"
                            bgColor="#8BC34A"
                            sparklineData={[20, 30, 40, 35, 50, 55, 60, 70, 75, 85]}
                        />
                    </div>
                </section>

                {/* Mini Stat Cards */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Mini Stats</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MiniStatCard value="$874" label="sales last month" accentColor="#8BC34A" />
                        <MiniStatCard value="$1283" label="Sales income" accentColor="#50C8E8" />
                        <MiniStatCard value="$1286" label="last month sales" accentColor="#F59E0B" />
                        <MiniStatCard value="$564" label="total revenue" accentColor="#EC4899" />
                    </div>
                </section>

                {/* Colored Metric Cards */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Colored Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ColoredMetricCard 
                            title="Sales Per Day"
                            change="3%"
                            bgColor="#6B4EE6"
                            metric1={{ value: '$4230', label: 'Total Revenue' }}
                            metric2={{ value: '321', label: 'Today Sales' }}
                        />
                        <ColoredMetricCard 
                            title="Visits"
                            change="9%"
                            bgColor="#8BC34A"
                            metric1={{ value: '3562', label: 'Monthly Visits' }}
                            metric2={{ value: '96', label: 'Today Visits' }}
                        />
                        <ColoredMetricCard 
                            title="Orders"
                            change="12%"
                            bgColor="#50C8E8"
                            metric1={{ value: '1695', label: 'Monthly Orders' }}
                            metric2={{ value: '52', label: 'Today Orders' }}
                        />
                    </div>
                </section>

                {/* Sales & Budget Row */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales & Budget</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SalesDetailsCard />
                        <div className="grid grid-cols-2 gap-4">
                            <BudgetDonutCard 
                                title="% of Income Budget"
                                percentage={67}
                                label="Budget"
                            />
                            <BudgetDonutCard 
                                title="% of Expenses Budget"
                                percentage={48}
                                label="Profit"
                                color1="#50C8E8"
                                color2="#8BC34A"
                            />
                        </div>
                    </div>
                </section>

                {/* Revenue Card */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Overview</h2>
                    <RevenueCard />
                </section>

                {/* Analytics Chart */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Analytics</h2>
                    <AnalyticsChart />
                </section>

                {/* Visitors & Social */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Visitors & Social</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <BrowserVisitorsCard />
                        <CountryVisitorsCard />
                        <SocialMediaCard />
                    </div>
                </section>

                {/* Sales Pie */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Distribution</h2>
                    <div className="max-w-md">
                        <SalesPieCard />
                    </div>
                </section>

                {/* Radial Progress */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Radial Progress</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <RadialProgressCard percentage={50} size="large" title="Overall" />
                        <RadialProgressCard percentage={25} size="medium" color="#A78BFA" title="Progress" />
                        <RadialProgressCard percentage={75} size="medium" color="#50C8E8" title="Complete" />
                        <RadialProgressCard percentage={90} size="small" color="#8BC34A" title="Goal" />
                    </div>
                </section>

                {/* Horizontal Bar Chart */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Horizontal Bar Charts</h2>
                    <HorizontalBarChart 
                        title="Category Performance"
                        data={[
                            { name: 'Books', value1: 80, value2: 40 },
                            { name: 'Articles', value1: 65, value2: 55 },
                            { name: 'Reports', value1: 90, value2: 30 },
                            { name: 'Journals', value1: 50, value2: 60 },
                            { name: 'Magazines', value1: 70, value2: 45 }
                        ]}
                    />
                </section>

                {/* Line Chart with Markers */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Trend Analysis</h2>
                    <LineChartWithMarkers 
                        title="Growth Over Time"
                        data={[
                            { name: '1990', value: 20 },
                            { name: '2000', value: 45 },
                            { name: '2010', value: 30 },
                            { name: '2020', value: 60 },
                            { name: '2030', value: 75 }
                        ]}
                    />
                </section>

                {/* Pie Charts */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Pie & Donut Charts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <PieChartCard 
                            title="Market Share"
                            variant="pie"
                            data={[
                                { name: 'Digital', value: 45 },
                                { name: 'Print', value: 30 },
                                { name: 'Audio', value: 25 }
                            ]}
                        />
                        <PieChartCard 
                            title="Revenue Split"
                            variant="donut"
                            data={[
                                { name: 'Sales', value: 55 },
                                { name: 'Subscriptions', value: 30 },
                                { name: 'Licensing', value: 15 }
                            ]}
                            colors={['#6B4EE6', '#50C8E8', '#8BC34A']}
                        />
                        <PieChartCard 
                            title="User Types"
                            variant="pie"
                            data={[
                                { name: 'Authors', value: 40 },
                                { name: 'Readers', value: 35 },
                                { name: 'Publishers', value: 25 }
                            ]}
                            colors={['#EC4899', '#A78BFA', '#6B4EE6']}
                        />
                    </div>
                </section>

                {/* Ranking Podium */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Rankings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RankingPodium 
                            title="Top Authors"
                            data={[
                                { name: '1ST', value: 15420, position: 1 },
                                { name: '2ND', value: 12350, position: 2 },
                                { name: '3RD', value: 9800, position: 3 }
                            ]}
                        />
                        <RankingPodium 
                            title="Best Sellers"
                            data={[
                                { name: '1ST', value: 8500, position: 1 },
                                { name: '2ND', value: 6200, position: 2 },
                                { name: '3RD', value: 4100, position: 3 }
                            ]}
                            colors={['#50C8E8', '#8BC34A', '#F59E0B']}
                        />
                    </div>
                </section>

                {/* Info Cards */}
                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Info Cards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InfoCard content="Publishing insights and analytics help track your content performance across all channels." />
                        <InfoCard content="Monitor your author sales, commissions, and reader engagement in real-time." bgColor="#6B4EE6" />
                        <InfoCard content="Stay updated with the latest trends in digital publishing and content distribution." bgColor="#50C8E8" />
                    </div>
                </section>
            </div>
        </div>
    );
}