import React from 'react';
import PageLayout from '@/components/PageLayout';
import MetricCard from '@/components/dashboard/MetricCard';
import SalesDetailsCard from '@/components/dashboard/SalesDetailsCard';
import SocialMediaCard from '@/components/dashboard/SocialMediaCard';
import BrowserVisitorsCard from '@/components/dashboard/BrowserVisitorsCard';
import CountryVisitorsCard from '@/components/dashboard/CountryVisitorsCard';
import BudgetDonutCard from '@/components/dashboard/BudgetDonutCard';
import RevenueCard from '@/components/dashboard/RevenueCard';
import SalesPieCard from '@/components/dashboard/SalesPieCard';
import StatsRow from '@/components/dashboard/StatsRow';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import MiniStatCard from '@/components/dashboard/MiniStatCard';
import ColoredMetricCard from '@/components/dashboard/ColoredMetricCard';
import RadialProgressCard from '@/components/dashboard/RadialProgressCard';
import HorizontalBarChart from '@/components/dashboard/HorizontalBarChart';
import LineChartWithMarkers from '@/components/dashboard/LineChartWithMarkers';
import PieChartCard from '@/components/dashboard/PieChartCard';
import RankingPodium from '@/components/dashboard/RankingPodium';
import InfoCard from '@/components/dashboard/InfoCard';
import StackedBarChart from '@/components/dashboard/StackedBarChart';
import SemiCircleProgress from '@/components/dashboard/SemiCircleProgress';
import AreaChartWithMarkers from '@/components/dashboard/AreaChartWithMarkers';
import StepCards from '@/components/dashboard/StepCards';
import RadarChartCard from '@/components/dashboard/RadarChart';
import { LiquidGaugeRow } from '@/components/dashboard/LiquidGauge';
import ProcessSteps from '@/components/dashboard/ProcessSteps';
import OptionCards from '@/components/dashboard/OptionCards';
import VerticalBarGauge from '@/components/dashboard/VerticalBarGauge';
import UserProfileCard from '@/components/dashboard/UserProfileCard';
import UserReviewCard from '@/components/dashboard/UserReviewCard';
import WeekCalendar from '@/components/dashboard/WeekCalendar';
import HighlightAvatars from '@/components/dashboard/HighlightAvatars';
import TimelineCard from '@/components/dashboard/TimelineCard';
import ComparisonTable from '@/components/dashboard/ComparisonTable';
import ProgressListCard from '@/components/dashboard/ProgressListCard';
import NotificationList from '@/components/dashboard/NotificationList';
import KPIGridCard from '@/components/dashboard/KPIGridCard';
import { Island1, Island2, Island3, Island4, Island5, Island6, Island7, Island8, Island9 } from '@/components/islands/IslandSVGs';
import { Island10, Island11, Island12, Island13, Island14, Island15, Island16, Island17, Island18 } from '@/components/islands/IslandSVGs2';

export default function DashboardComponents() {
    return (
        <PageLayout activePage="" searchPlaceholder="Search dashboard...">
            <div className="p-6">
                <div className="max-w-7xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Components</h1>
                    <p className="text-gray-500 mb-8">Reusable analytics and metrics components</p>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Stats Overview</h2>
                        <StatsRow />
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Metric Cards</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <MetricCard title="Barrier Strength" subtitle="Market Protection" value="Medium" change="+4%" changeType="positive" bgColor="#6B4EE6" />
                            <MetricCard title="Threat Level" subtitle="Innovation Index" value="Low" change="-2%" changeType="negative" bgColor="#50C8E8" />
                            <MetricCard title="Growth Rate" subtitle="Monthly Progress" value="High" change="+12%" changeType="positive" bgColor="#8BC34A" />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Mini Stats</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <MiniStatCard value="$874" label="sales last month" accentColor="#8BC34A" />
                            <MiniStatCard value="$1283" label="Sales income" accentColor="#50C8E8" />
                            <MiniStatCard value="$1286" label="last month sales" accentColor="#F59E0B" />
                            <MiniStatCard value="$564" label="total revenue" accentColor="#EC4899" />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Colored Metrics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ColoredMetricCard title="Sales Per Day" change="3%" bgColor="#6B4EE6" metric1={{ value: '$4230', label: 'Total Revenue' }} metric2={{ value: '321', label: 'Today Sales' }} />
                            <ColoredMetricCard title="Visits" change="9%" bgColor="#8BC34A" metric1={{ value: '3562', label: 'Monthly Visits' }} metric2={{ value: '96', label: 'Today Visits' }} />
                            <ColoredMetricCard title="Orders" change="12%" bgColor="#50C8E8" metric1={{ value: '1695', label: 'Monthly Orders' }} metric2={{ value: '52', label: 'Today Orders' }} />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales & Budget</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SalesDetailsCard />
                            <div className="grid grid-cols-2 gap-4">
                                <BudgetDonutCard title="% of Income Budget" percentage={67} label="Budget" />
                                <BudgetDonutCard title="% of Expenses Budget" percentage={48} label="Profit" color1="#50C8E8" color2="#8BC34A" />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue Overview</h2>
                        <RevenueCard />
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Analytics</h2>
                        <AnalyticsChart />
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Visitors & Social</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <BrowserVisitorsCard />
                            <CountryVisitorsCard />
                            <SocialMediaCard />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Distribution</h2>
                        <div className="max-w-md">
                            <SalesPieCard />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Radial Progress</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <RadialProgressCard percentage={50} size="large" title="Overall" />
                            <RadialProgressCard percentage={25} size="medium" color="#A78BFA" title="Progress" />
                            <RadialProgressCard percentage={75} size="medium" color="#50C8E8" title="Complete" />
                            <RadialProgressCard percentage={90} size="small" color="#8BC34A" title="Goal" />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Charts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <HorizontalBarChart title="Category Performance" data={[{ name: 'Books', value1: 80, value2: 40 }, { name: 'Articles', value1: 65, value2: 55 }, { name: 'Reports', value1: 90, value2: 30 }]} />
                            <LineChartWithMarkers title="Growth Over Time" data={[{ name: '1990', value: 20 }, { name: '2000', value: 45 }, { name: '2010', value: 30 }, { name: '2020', value: 60 }]} />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Pie Charts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <PieChartCard title="Market Share" variant="pie" data={[{ name: 'Digital', value: 45 }, { name: 'Print', value: 30 }, { name: 'Audio', value: 25 }]} />
                            <PieChartCard title="Revenue Split" variant="donut" data={[{ name: 'Sales', value: 55 }, { name: 'Subscriptions', value: 30 }, { name: 'Licensing', value: 15 }]} colors={['#6B4EE6', '#50C8E8', '#8BC34A']} />
                            <PieChartCard title="User Types" variant="pie" data={[{ name: 'Authors', value: 40 }, { name: 'Readers', value: 35 }, { name: 'Publishers', value: 25 }]} colors={['#EC4899', '#A78BFA', '#6B4EE6']} />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Rankings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <RankingPodium title="Top Authors" data={[{ name: '1ST', value: 15420, position: 1 }, { name: '2ND', value: 12350, position: 2 }, { name: '3RD', value: 9800, position: 3 }]} />
                            <RankingPodium title="Best Sellers" data={[{ name: '1ST', value: 8500, position: 1 }, { name: '2ND', value: 6200, position: 2 }, { name: '3RD', value: 4100, position: 3 }]} colors={['#50C8E8', '#8BC34A', '#F59E0B']} />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">User Components</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <UserProfileCard />
                            <UserReviewCard />
                            <div className="space-y-4">
                                <HighlightAvatars />
                                <WeekCalendar />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">KPI & Metrics</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <KPIGridCard />
                            <ComparisonTable />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Activity & Progress</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <TimelineCard />
                            <ProgressListCard />
                            <NotificationList />
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Island Illustrations</h2>
                        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
                            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-center">
                                <Island1 className="w-20 h-20" color="#6B4EE6" />
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-center">
                                <Island2 className="w-20 h-20" color="#50C8E8" />
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-center">
                                <Island3 className="w-20 h-20" color="#8BC34A" />
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-center">
                                <Island4 className="w-20 h-20" color="#F59E0B" />
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-center">
                                <Island5 className="w-20 h-20" color="#EC4899" />
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-center">
                                <Island6 className="w-20 h-20" color="#14B8A6" />
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-center">
                                <Island7 className="w-20 h-20" color="#A78BFA" />
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-center">
                                <Island8 className="w-20 h-20" color="#F97316" />
                            </div>
                            <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-center">
                                <Island9 className="w-20 h-20" color="#3B82F6" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </PageLayout>
    );
}