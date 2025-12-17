import React from 'react';
import { TrendingUp, TrendingDown, Shield, Sparkles, AlertTriangle, Target, LineChart, Calculator, ThumbsUp, ThumbsDown, ArrowUpRight, ArrowDownRight, Brain, Percent, Users, Zap, Info, Building, Globe, FileText, Calendar, DollarSign, Play, Download, ExternalLink, Award, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line } from 'recharts';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

function MoatBar({ label, value, color = '#8B5CF6' }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-32">{label}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
            </div>
            <span className="text-sm font-medium text-gray-700 w-12 text-right">{value}%</span>
        </div>
    );
}

export default function StockSectionContent({ 
    activeNav, 
    stock, 
    data, 
    priceChartPeriod, 
    setPriceChartPeriod,
    investmentAmount,
    setInvestmentAmount,
    yearsToHold,
    setYearsToHold,
    expectedReturn,
    setExpectedReturn,
    activeReportTab,
    setActiveReportTab
}) {
    const isPositive = stock.change >= 0;

    // Simulator calculations
    const calculateFutureValue = () => {
        const shares = investmentAmount / stock.price;
        const futurePrice = stock.price * Math.pow(1 + expectedReturn / 100, yearsToHold);
        const futureValue = shares * futurePrice;
        const annualDividend = (stock.dividend || 2) * shares;
        const totalDividends = annualDividend * yearsToHold;
        return { 
            shares: shares.toFixed(2), 
            futurePrice: futurePrice.toFixed(2), 
            futureValue: futureValue.toFixed(2), 
            profit: (futureValue - investmentAmount).toFixed(2),
            annualDividend: annualDividend.toFixed(2),
            totalDividends: totalDividends.toFixed(2),
            totalReturn: (futureValue + totalDividends - investmentAmount).toFixed(2)
        };
    };

    switch (activeNav) {
        case 'overview':
            const filteredPriceData = data.priceHistory?.map(point => ({
                month: point.time,
                price: point.price
            })) || [];
            
            const startPrice = filteredPriceData[0]?.price || stock.price * 0.8;
            const highPrice = Math.max(...(filteredPriceData.map(p => p.price).concat([stock.price])));
            const lowPrice = Math.min(...(filteredPriceData.map(p => p.price).concat([stock.price])));
            
            return (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Company Overview</h3>
                        <p className="text-gray-600 mb-4">{data.description || `${stock.name} is a leading company in the ${stock.sector} sector.`}</p>
                        {data.advantages && (
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Competitive Advantages</h4>
                                <ul className="space-y-1">
                                    {data.advantages.map((adv, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                                            {adv}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    {filteredPriceData.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-gray-900">Price History</h3>
                                <div className="flex gap-1">
                                    {['24H', '1W', '3M', '6M', '12M', '36M'].map(period => (
                                        <button
                                            key={period}
                                            onClick={() => setPriceChartPeriod(period)}
                                            className={`px-2 py-1 text-xs rounded-lg ${
                                                priceChartPeriod === period ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={filteredPriceData}>
                                        <defs>
                                            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                                        <Tooltip formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Price']} />
                                        <Area type="monotone" dataKey="price" stroke="#8B5CF6" strokeWidth={2} fill="url(#priceGrad)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-4 gap-3 mt-4">
                                <div className="bg-blue-50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500">Start</p>
                                    <p className="text-lg font-bold text-blue-600">${startPrice.toFixed(2)}</p>
                                </div>
                                <div className="bg-green-50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500">High</p>
                                    <p className="text-lg font-bold text-green-600">${highPrice.toFixed(2)}</p>
                                </div>
                                <div className="bg-red-50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500">Low</p>
                                    <p className="text-lg font-bold text-red-600">${lowPrice.toFixed(2)}</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-3 text-center">
                                    <p className="text-xs text-gray-500">Current</p>
                                    <p className="text-lg font-bold text-purple-600">${stock.price?.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-purple-600" />
                                <span className="text-sm text-gray-600">MOAT</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stock.moat}/100</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-600">ROE</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{stock.roe}%</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-gray-600">Z-Score</span>
                            </div>
                            <p className={`text-2xl font-bold ${stock.zscore >= 3 ? 'text-green-600' : 'text-yellow-600'}`}>{stock.zscore?.toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">P/E</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{stock.pe?.toFixed(1)}</p>
                        </div>
                    </div>
                </div>
            );

        case 'moat':
              return (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">MOAT Breakdown</h3>
                      {data.moatBreakdown ? (
                          <>
                              <div className="space-y-3 mb-6">
                                  <MoatBar label="Brand Power" value={data.moatBreakdown.brandPower} />
                                  <MoatBar label="Switching Costs" value={data.moatBreakdown.switchingCosts} color="#10B981" />
                                  <MoatBar label="Network Effects" value={data.moatBreakdown.networkEffects} />
                                  <MoatBar label="Cost Advantages" value={data.moatBreakdown.costAdvantages} color="#F59E0B" />
                                  <MoatBar label="Scale Advantage" value={data.moatBreakdown.scaleAdvantage} color="#3B82F6" />
                                  <MoatBar label="Regulatory Moat" value={data.moatBreakdown.regulatoryMoat} color="#EC4899" />
                              </div>
                              {data.thesis && (
                                  <div className="p-4 bg-purple-50 rounded-lg">
                                      <h4 className="font-medium text-gray-900 mb-2">Investment Thesis</h4>
                                      <p className="text-sm text-gray-700">{data.thesis}</p>
                                  </div>
                              )}
                              {data.advantages && data.advantages.length > 0 && (
                                  <div className="mt-4">
                                      <h4 className="font-medium text-gray-900 mb-2">Key Advantages</h4>
                                      <ul className="space-y-2">
                                          {data.advantages.map((adv, i) => (
                                              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                                  {adv}
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              )}
                          </>
                      ) : <p className="text-gray-500 text-center py-12">Loading MOAT data...</p>}
                  </div>
              );

        case 'valuation':
              return (
                  <div className="space-y-6">
                      <div className="bg-white rounded-2xl border border-gray-200 p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Valuation Metrics</h3>
                          {data.fairValue ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">Fair Value</p>
                                      <p className="text-2xl font-bold text-purple-600">${data.fairValue.toFixed(2)}</p>
                                  </div>
                                  <div className="bg-green-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">Margin of Safety</p>
                                      <p className="text-2xl font-bold text-green-600">{data.marginOfSafety}%</p>
                                  </div>
                                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">Grade</p>
                                      <p className="text-2xl font-bold text-gray-900">{data.grade}</p>
                                  </div>
                                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">Sector P/E</p>
                                      <p className="text-2xl font-bold text-blue-600">{data.sectorAvgPE.toFixed(1)}</p>
                                  </div>
                              </div>
                          ) : <p className="text-gray-500 text-center py-12">Loading valuation data...</p>}
                      </div>
                  </div>
              );

        case 'fundamentals':
            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Revenue & Growth</h3>
                        {data.revenueGrowth?.length > 0 ? (
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.revenueGrowth}>
                                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                                        <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}B`} />
                                        <Tooltip />
                                        <Bar yAxisId="right" dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Revenue" />
                                        <Bar yAxisId="left" dataKey="growth" fill="#10B981" radius={[4, 4, 0, 0]} name="Growth %" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : <p className="text-gray-500 text-center py-12">Loading revenue data...</p>}
                    </div>
                    {data.debtToEquity && data.interestCoverage && data.margins && (
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <p className="text-sm text-gray-500">Debt/Equity</p>
                                <p className="text-2xl font-bold text-gray-900">{data.debtToEquity.toFixed(2)}</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <p className="text-sm text-gray-500">Interest Coverage</p>
                                <p className="text-2xl font-bold text-gray-900">{data.interestCoverage.toFixed(1)}x</p>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                                <p className="text-sm text-gray-500">Gross Margin</p>
                                <p className="text-2xl font-bold text-green-600">{data.margins.gross}%</p>
                            </div>
                        </div>
                    )}
                    {data.margins && data.margins.gross && data.margins.operating && data.margins.net && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Profit Margins</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Gross</p>
                                    <p className="text-3xl font-bold text-green-600">{data.margins.gross}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Operating</p>
                                    <p className="text-3xl font-bold text-blue-600">{data.margins.operating}%</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Net</p>
                                    <p className="text-3xl font-bold text-purple-600">{data.margins.net}%</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            );

        case 'financials':
              return (
                  <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-6">Financial Ratios</h3>
                      {stock.pe && stock.roe ? (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div className="bg-gray-50 rounded-xl p-4 text-center">
                                  <p className="text-sm text-gray-500">P/E Ratio</p>
                                  <p className="text-2xl font-bold text-gray-900">{stock.pe.toFixed(1)}</p>
                              </div>
                              {stock.peg && (
                                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">PEG Ratio</p>
                                      <p className="text-2xl font-bold text-gray-900">{stock.peg.toFixed(2)}</p>
                                  </div>
                              )}
                              <div className="bg-gray-50 rounded-xl p-4 text-center">
                                  <p className="text-sm text-gray-500">ROE</p>
                                  <p className="text-2xl font-bold text-green-600">{stock.roe}%</p>
                              </div>
                              {stock.roic && (
                                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">ROIC</p>
                                      <p className="text-2xl font-bold text-gray-900">{stock.roic}%</p>
                                  </div>
                              )}
                              {stock.roa && (
                                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">ROA</p>
                                      <p className="text-2xl font-bold text-gray-900">{stock.roa}%</p>
                                  </div>
                              )}
                              {stock.fcf && (
                                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">FCF</p>
                                      <p className="text-2xl font-bold text-gray-900">{stock.fcf}%</p>
                                  </div>
                              )}
                          </div>
                      ) : <p className="text-gray-500 text-center py-12">Loading financial ratios...</p>}
                  </div>
              );

        case 'technicals':
              return (
                  <div className="min-h-[600px] space-y-6">
                      <div className="bg-white rounded-2xl border border-gray-200 p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Technical Indicators</h3>
                          {data.rsi ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">RSI</p>
                                      <p className="text-2xl font-bold text-orange-600">{data.rsi}</p>
                                  </div>
                                  {data.ma50 && (
                                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                                          <p className="text-sm text-gray-500">50-MA</p>
                                          <p className="text-2xl font-bold text-gray-900">${data.ma50.toFixed(2)}</p>
                                      </div>
                                  )}
                                  {data.macdSignal && (
                                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                                          <p className="text-sm text-gray-500">MACD</p>
                                          <p className={`text-xl font-bold ${data.macdSignal === 'Bullish' ? 'text-green-600' : 'text-yellow-600'}`}>{data.macdSignal}</p>
                                      </div>
                                  )}
                                  {data.trend && (
                                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                                          <p className="text-sm text-gray-500">Trend</p>
                                          <p className={`text-xl font-bold ${data.trend === 'Bullish' ? 'text-green-600' : 'text-gray-900'}`}>{data.trend}</p>
                                      </div>
                                  )}
                              </div>
                          ) : <p className="text-gray-500 text-center py-12">Loading technical data...</p>}
                      </div>
                  </div>
              );

        case 'sentiment':
              return (
                  <div className="min-h-[600px] space-y-6">
                      <div className="bg-white rounded-2xl border border-gray-200 p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Market Sentiment</h3>
                          {data.analystRatings ? (
                              <>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                      <div className="bg-green-50 rounded-xl p-4 text-center">
                                          <p className="text-sm text-gray-500">Buy</p>
                                          <p className="text-2xl font-bold text-green-600">{data.analystRatings.buy}</p>
                                      </div>
                                      <div className="bg-yellow-50 rounded-xl p-4 text-center">
                                          <p className="text-sm text-gray-500">Hold</p>
                                          <p className="text-2xl font-bold text-yellow-600">{data.analystRatings.hold}</p>
                                      </div>
                                      <div className="bg-red-50 rounded-xl p-4 text-center">
                                          <p className="text-sm text-gray-500">Sell</p>
                                          <p className="text-2xl font-bold text-red-600">{data.analystRatings.sell}</p>
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      {data.sentimentScore && (
                                          <div className="bg-gray-50 rounded-xl p-4">
                                              <p className="text-sm text-gray-500">Sentiment Score</p>
                                              <p className="text-3xl font-bold text-orange-600">{data.sentimentScore}/100</p>
                                          </div>
                                      )}
                                      {data.shortInterest && (
                                          <div className="bg-gray-50 rounded-xl p-4">
                                              <p className="text-sm text-gray-500">Short Interest</p>
                                              <p className="text-3xl font-bold text-gray-900">{data.shortInterest}%</p>
                                          </div>
                                      )}
                                  </div>
                              </>
                          ) : <p className="text-gray-500 text-center py-12">Loading sentiment data...</p>}
                      </div>
                  </div>
              );

        case 'risk':
              return (
                  <div className="min-h-[600px] space-y-6">
                      <div className="bg-white rounded-2xl border border-gray-200 p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                          {data.riskScore ? (
                              <>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                      <div className="bg-orange-50 rounded-xl p-4 text-center">
                                          <p className="text-sm text-gray-500">Risk Score</p>
                                          <p className="text-3xl font-bold text-orange-600">{data.riskScore}/10</p>
                                      </div>
                                      {(data.beta || stock.beta) && (
                                          <div className="bg-gray-50 rounded-xl p-4 text-center">
                                              <p className="text-sm text-gray-500">Beta</p>
                                              <p className="text-2xl font-bold text-gray-900">{(data.beta || stock.beta).toFixed(2)}</p>
                                          </div>
                                      )}
                                      {data.volatility && (
                                          <div className="bg-gray-50 rounded-xl p-4 text-center">
                                              <p className="text-sm text-gray-500">Volatility</p>
                                              <p className="text-xl font-bold text-gray-900">{data.volatility}</p>
                                          </div>
                                      )}
                                      {data.maxDrawdown && (
                                          <div className="bg-red-50 rounded-xl p-4 text-center">
                                              <p className="text-sm text-gray-500">Max Drawdown</p>
                                              <p className="text-2xl font-bold text-red-600">-{data.maxDrawdown}%</p>
                                          </div>
                                      )}
                                  </div>
                                  {data.companyRisks && data.companyRisks.length > 0 && (
                                      <div className="mb-4">
                                          <h4 className="font-medium text-gray-900 mb-2">Company Risks</h4>
                                          <div className="flex flex-wrap gap-2">
                                              {data.companyRisks.map((r, i) => (
                                                  <span key={i} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">{r}</span>
                                              ))}
                                          </div>
                                      </div>
                                  )}
                              </>
                          ) : <p className="text-gray-500 text-center py-12">Loading risk data...</p>}
                      </div>
                  </div>
              );

        case 'dividends':
              return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Dividend Information</h3>
                        {(data.yield || data.annualDividend) ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {(data.yield || stock.dividend) && (
                                        <div className="bg-green-50 rounded-xl p-4 text-center">
                                            <p className="text-sm text-gray-500">Yield</p>
                                            <p className="text-2xl font-bold text-green-600">{data.yield || stock.dividend}%</p>
                                        </div>
                                    )}
                                    {data.annualDividend && (
                                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                                            <p className="text-sm text-gray-500">Annual</p>
                                            <p className="text-2xl font-bold text-purple-600">${data.annualDividend.toFixed(2)}</p>
                                        </div>
                                    )}
                                    {data.growthRate && (
                                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                                            <p className="text-sm text-gray-500">Growth</p>
                                            <p className="text-2xl font-bold text-blue-600">{data.growthRate}%</p>
                                        </div>
                                    )}
                                    {data.payoutRatio && (
                                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                                            <p className="text-sm text-gray-500">Payout</p>
                                            <p className="text-2xl font-bold text-orange-600">{data.payoutRatio}%</p>
                                        </div>
                                    )}
                                </div>
                                {data.history && data.history.length > 0 && (
                                    <div className="h-48 mt-6">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ReLineChart data={data.history}>
                                                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                                                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                                                <Tooltip formatter={(v) => [`$${v}`, 'Dividend']} />
                                                <Line type="monotone" dataKey="dividend" stroke="#8B5CF6" strokeWidth={2} />
                                            </ReLineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </>
                        ) : <p className="text-gray-500 text-center py-12">Loading dividend data...</p>}
                    </div>
                </div>
                );

        case 'peers':
            const peerData = data.peers || [];
            return (
                <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Peer Comparison</h3>
                    {peerData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Ticker</th>
                                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">P/E</th>
                                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">ROE</th>
                                        <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Growth</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-purple-50 border-b">
                                        <td className="py-3 px-2 font-bold text-purple-700">{stock.ticker}</td>
                                        <td className="py-3 px-2 text-right">{stock.pe?.toFixed(1)}</td>
                                        <td className="py-3 px-2 text-right">{stock.roe}%</td>
                                        <td className="py-3 px-2 text-right">{stock.sgr}%</td>
                                    </tr>
                                    {peerData.map((peer, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="py-3 px-2 font-medium">{peer.ticker}</td>
                                            <td className="py-3 px-2 text-right">{peer.pe}</td>
                                            <td className="py-3 px-2 text-right">{peer.roe}%</td>
                                            <td className="py-3 px-2 text-right text-green-600">{peer.growth}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <p className="text-gray-500 text-center py-12">No peer data available</p>}
                </div>
            );

        case 'bullbear':
              return (
                  <div className="min-h-[600px]">
                      {data.bullCase && data.bearCase ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
                                  <div className="flex items-center justify-between mb-4">
                                      <h3 className="font-semibold text-green-900 flex items-center gap-2">
                                          <ThumbsUp className="w-5 h-5" /> Bull Case
                                      </h3>
                                      {data.bullTarget && (
                                          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                              ${data.bullTarget.toFixed(2)}
                                          </span>
                                      )}
                                  </div>
                                  <ul className="space-y-3">
                                      {data.bullCase.map((point, i) => (
                                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                              <ArrowUpRight className="w-4 h-4 text-green-600 mt-0.5" />
                                              {point}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6">
                                  <div className="flex items-center justify-between mb-4">
                                      <h3 className="font-semibold text-red-900 flex items-center gap-2">
                                          <ThumbsDown className="w-5 h-5" /> Bear Case
                                      </h3>
                                      {data.bearTarget && (
                                          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                                              ${data.bearTarget.toFixed(2)}
                                          </span>
                                      )}
                                  </div>
                                  <ul className="space-y-3">
                                      {data.bearCase.map((point, i) => (
                                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                              <ArrowDownRight className="w-4 h-4 text-red-600 mt-0.5" />
                                              {point}
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </div>
                      ) : <p className="text-gray-500 text-center py-32">Loading bull/bear analysis...</p>}
                  </div>
              );

        case 'dcf':
              return (
                  <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-6">DCF Intrinsic Value</h3>
                      {data.intrinsicValue ? (
                          <>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">Current Price</p>
                                      <p className="text-2xl font-bold text-gray-900">${stock.price?.toFixed(2)}</p>
                                  </div>
                                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">Intrinsic Value</p>
                                      <p className="text-2xl font-bold text-purple-600">${data.intrinsicValue.toFixed(2)}</p>
                                  </div>
                                  <div className="bg-green-50 rounded-xl p-4 text-center">
                                      <p className="text-sm text-gray-500">Margin of Safety</p>
                                      <p className={`text-2xl font-bold ${data.marginOfSafety > 0 ? 'text-green-600' : 'text-red-600'}`}>{data.marginOfSafety}%</p>
                                  </div>
                                  {data.verdict && (
                                      <div className={`rounded-xl p-4 text-center ${data.verdict === 'Undervalued' ? 'bg-green-100' : data.verdict === 'Overvalued' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                                          <p className="text-sm text-gray-500">Verdict</p>
                                          <p className={`text-xl font-bold ${data.verdict === 'Undervalued' ? 'text-green-700' : data.verdict === 'Overvalued' ? 'text-red-700' : 'text-yellow-700'}`}>{data.verdict}</p>
                                      </div>
                                  )}
                              </div>
                          </>
                      ) : <p className="text-gray-500 text-center py-12">Loading DCF data...</p>}
                  </div>
              );

        case 'simulator':
            const simResult = calculateFutureValue();
            const projectionData = Array.from({ length: yearsToHold + 1 }, (_, i) => ({
                year: `Y${i}`,
                value: investmentAmount * Math.pow(1 + expectedReturn / 100, i),
                withDividends: investmentAmount * Math.pow(1 + expectedReturn / 100, i) + ((stock.dividend || 2) * (investmentAmount / stock.price) * i)
            }));
            
            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Calculator className="w-5 h-5 text-purple-600" />
                            <h3 className="font-semibold text-gray-900">Investment Simulator</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Investment Amount</label>
                                <Input type="number" value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))} min={100} max={4000000} />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Years: {yearsToHold}</label>
                                <Slider value={[yearsToHold]} onValueChange={(v) => setYearsToHold(v[0])} min={1} max={30} step={1} className="mt-4" />
                            </div>
                            <div>
                                <label className="text-sm text-gray-600 mb-2 block">Return: {expectedReturn}%</label>
                                <Slider value={[expectedReturn]} onValueChange={(v) => setExpectedReturn(v[0])} min={-20} max={50} step={1} className="mt-4" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-500">Shares</p>
                                <p className="text-xl font-bold text-gray-900">{simResult.shares}</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-500">Future Price</p>
                                <p className="text-xl font-bold text-blue-600">${simResult.futurePrice}</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-500">Future Value</p>
                                <p className="text-xl font-bold text-purple-600">${Number(simResult.futureValue).toLocaleString()}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4 text-center">
                                <p className="text-xs text-gray-500">Dividends</p>
                                <p className="text-xl font-bold text-green-600">${Number(simResult.totalDividends).toLocaleString()}</p>
                            </div>
                            <div className={`rounded-xl p-4 text-center ${Number(simResult.totalReturn) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                <p className="text-xs text-gray-500">Total Return</p>
                                <p className={`text-xl font-bold ${Number(simResult.totalReturn) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {Number(simResult.totalReturn) >= 0 ? '+' : ''}${Number(simResult.totalReturn).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={projectionData}>
                                    <defs>
                                        <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                                    <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
                                    <Area type="monotone" dataKey="withDividends" stroke="#10B981" strokeWidth={2} fill="url(#projGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            );
        
        case 'reports':
            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Annual Reports</h3>
                        <div className="space-y-2">
                            {(data.annualReports || []).length > 0 ? data.annualReports.map((r, i) => (
                                <a key={i} href={`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${stock.ticker}&type=10-K`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50">
                                    <div>
                                        <p className="font-medium text-gray-900">{r.title}</p>
                                        <p className="text-sm text-gray-500">{r.date}</p>
                                    </div>
                                    <Download className="w-4 h-4 text-gray-400" />
                                </a>
                            )) : <p className="text-gray-500 text-center py-8">Loading reports data...</p>}
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Quarterly Reports</h3>
                        <div className="space-y-2">
                            {(data.quarterlyReports || []).length > 0 ? data.quarterlyReports.map((r, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-gray-900">{r.title}</p>
                                        <p className="text-sm text-gray-500">{r.date}</p>
                                    </div>
                                    <Download className="w-4 h-4 text-gray-400" />
                                </div>
                            )) : <p className="text-gray-500 text-center py-8">Loading reports data...</p>}
                        </div>
                    </div>
                    {data.earningsReleases && data.earningsReleases.length > 0 && (
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Earnings Releases</h3>
                            <div className="space-y-2">
                                {data.earningsReleases.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">{r.title}</p>
                                            <p className="text-sm text-gray-500">{r.date}</p>
                                        </div>
                                        <span className="text-sm font-bold text-green-600">{r.eps}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );

        case 'investor-relations':
            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{stock.name} IR</h2>
                                <p className="text-sm text-gray-500">{stock.ticker} • {stock.sector}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Fiscal Year End</p>
                                <p className="text-sm font-semibold text-gray-900">{data.fiscalYearEnd || 'December 31'}</p>
                                <p className="text-xs text-gray-400">Next: {data.nextEarnings || 'Jan 2025'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Annual Reports</h3>
                        <div className="space-y-2">
                            {(data.annualReports || []).map((r, i) => (
                                <a key={i} href={`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${stock.ticker}&type=10-K`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 block">
                                    <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{r.title}</p>
                                        <p className="text-sm text-gray-500">{r.date}</p>
                                        <p className="text-xs text-gray-400 mt-1">{r.description}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 mt-1" />
                                </a>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Fiscal Year Data</h3>
                        {data.fiscalYearData && (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Year</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Earnings</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Assets</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.fiscalYearData.map((fy, i) => (
                                            <tr key={i} className="border-b">
                                                <td className="py-3 px-4 font-medium">{fy.year}</td>
                                                <td className="py-3 px-4 text-right">{fy.revenue}</td>
                                                <td className="py-3 px-4 text-right text-green-600 font-medium">{fy.earnings}</td>
                                                <td className="py-3 px-4 text-right">{fy.assets}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            );

        case 'investor-reports':
            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{stock.name} Investor Reports</h2>
                                <p className="text-sm text-gray-500">{stock.ticker}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Fiscal Year End</p>
                                <p className="text-sm font-semibold text-gray-900">{data.fiscalYearEnd || 'Dec 31'}</p>
                                <p className="text-xs text-gray-400">Next: {data.nextEarnings || 'Jan 2025'}</p>
                            </div>
                        </div>
                    </div>

                    {data.annualReports && data.annualReports.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Annual Reports</h3>
                            <div className="space-y-2">
                                {data.annualReports.map((r, i) => (
                                    <a key={i} href={`https://www.sec.gov/cgi-bin/browse-edgar?CIK=${stock.ticker}&type=10-K`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 block">
                                        <FileText className="w-5 h-5 text-purple-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{r.title}</p>
                                            <p className="text-sm text-gray-500">{r.date}</p>
                                            {r.description && <p className="text-xs text-gray-400 mt-1">{r.description}</p>}
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400 mt-1" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    ) : <p className="text-gray-500 text-center py-12">Loading investor reports...</p>}

                    {data.quarterlyReports && data.quarterlyReports.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Quarterly Reports</h3>
                            <div className="space-y-2">
                                {data.quarterlyReports.map((r, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">{r.title}</p>
                                            <p className="text-sm text-gray-500">{r.date}</p>
                                            {r.description && <p className="text-xs text-gray-400 mt-1">{r.description}</p>}
                                        </div>
                                        <Download className="w-4 h-4 text-gray-400 mt-1" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.investorPresentations && data.investorPresentations.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Investor Presentations</h3>
                            <div className="space-y-2">
                                {data.investorPresentations.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Play className="w-4 h-4 text-indigo-600" />
                                            <div>
                                                <p className="font-medium text-gray-900">{r.title}</p>
                                                <p className="text-sm text-gray-500">{r.date}</p>
                                            </div>
                                        </div>
                                        <Download className="w-4 h-4 text-gray-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.earningsReleases && data.earningsReleases.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Earnings Releases</h3>
                            <div className="space-y-2">
                                {data.earningsReleases.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <p className="font-medium text-gray-900">{r.title}</p>
                                            <p className="text-sm text-gray-500">{r.date}</p>
                                        </div>
                                        <span className="text-sm font-bold text-green-600">{r.eps}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {data.fiscalYearData && data.fiscalYearData.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Fiscal Year Summary</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Year</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Earnings</th>
                                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Assets</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.fiscalYearData.map((fy, i) => (
                                            <tr key={i} className="border-b">
                                                <td className="py-3 px-4 font-medium">{fy.year}</td>
                                                <td className="py-3 px-4 text-right">{fy.revenue}</td>
                                                <td className="py-3 px-4 text-right text-green-600 font-medium">{fy.earnings}</td>
                                                <td className="py-3 px-4 text-right">{fy.assets}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            );

        case 'invest':
              return (
                  <div className="min-h-[600px] space-y-6">
                      {data.recommendation ? (
                          <>
                              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                      <Target className="w-5 h-5 text-purple-600" /> Investment Recommendation
                                  </h3>
                                  <div className="flex items-center gap-6 mb-6">
                                      <div className={`px-6 py-3 rounded-xl text-2xl font-bold ${
                                          data.recommendation === 'Buy' ? 'bg-green-100 text-green-700' :
                                          data.recommendation === 'Sell' ? 'bg-red-100 text-red-700' :
                                          'bg-yellow-100 text-yellow-700'
                                      }`}>
                                          {data.recommendation}
                                      </div>
                                      {data.confidence && (
                                          <div>
                                              <p className="text-sm text-gray-500">AI Confidence</p>
                                              <p className="text-3xl font-bold text-gray-900">{data.confidence}%</p>
                                          </div>
                                      )}
                                  </div>
                                  {data.priceTargets && (
                                      <div className="grid grid-cols-3 gap-4">
                                          {data.priceTargets.low && (
                                              <div className="bg-red-50 rounded-xl p-4 text-center">
                                                  <p className="text-sm text-gray-600">Low Target</p>
                                                  <p className="text-2xl font-bold text-red-600">${data.priceTargets.low.toFixed(2)}</p>
                                              </div>
                                          )}
                                          {data.priceTargets.mid && (
                                              <div className="bg-purple-50 rounded-xl p-4 text-center">
                                                  <p className="text-sm text-gray-600">Mid Target</p>
                                                  <p className="text-2xl font-bold text-purple-600">${data.priceTargets.mid.toFixed(2)}</p>
                                              </div>
                                          )}
                                          {data.priceTargets.high && (
                                              <div className="bg-green-50 rounded-xl p-4 text-center">
                                                  <p className="text-sm text-gray-600">High Target</p>
                                                  <p className="text-2xl font-bold text-green-600">${data.priceTargets.high.toFixed(2)}</p>
                                              </div>
                                          )}
                                      </div>
                                  )}
                              </div>
                              {(data.catalysts || data.risks) && (
                                  <div className="grid grid-cols-2 gap-6">
                                      {data.catalysts && data.catalysts.length > 0 && (
                                          <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                  <Zap className="w-4 h-4 text-green-600" /> Key Catalysts
                                              </h4>
                                              <ul className="space-y-2">
                                                  {data.catalysts.map((c, i) => (
                                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                                          {c}
                                                      </li>
                                                  ))}
                                              </ul>
                                          </div>
                                      )}
                                      {data.risks && data.risks.length > 0 && (
                                          <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                  <AlertTriangle className="w-4 h-4 text-red-600" /> Risks
                                              </h4>
                                              <ul className="space-y-2">
                                                  {data.risks.map((r, i) => (
                                                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                                                          {r}
                                                      </li>
                                                  ))}
                                              </ul>
                                          </div>
                                      )}
                                  </div>
                              )}
                          </>
                      ) : <p className="text-gray-500 text-center py-32">Loading investment recommendation...</p>}
                  </div>
              );

        case 'ai-insights':
              return (
                  <div className="min-h-[600px] space-y-6">
                      {(data.aiConfidence || stock.aiRating) ? (
                          <>
                              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-200 p-6">
                                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                      <Sparkles className="w-5 h-5 text-purple-600" /> AI-Powered Insights
                                  </h3>
                                  <div className="grid grid-cols-2 gap-6 mb-4">
                                      <div>
                                          <p className="text-sm text-gray-600 mb-2">AI Confidence</p>
                                          <p className="text-5xl font-bold text-purple-600">{data.aiConfidence || stock.aiRating}%</p>
                                      </div>
                                      {data.earningsSurprise && (
                                          <div>
                                              <p className="text-sm text-gray-600 mb-2">Earnings Surprise</p>
                                              <p className="text-2xl font-bold text-gray-900">{data.earningsSurprise}</p>
                                          </div>
                                      )}
                                  </div>
                              </div>
                              {data.predictions && data.predictions.length > 0 && (
                                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                      <h4 className="font-semibold text-gray-900 mb-4">AI Predictions</h4>
                                      <ul className="space-y-3">
                                          {data.predictions.map((p, i) => (
                                              <li key={i} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                                  <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                                                  <span className="text-gray-700">{p}</span>
                                              </li>
                                          ))}
                                      </ul>
                                  </div>
                              )}
                              {data.riskAlerts && data.riskAlerts.length > 0 && (
                                  <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                                      <h4 className="font-semibold text-red-900 mb-4 flex items-center gap-2">
                                          <AlertTriangle className="w-5 h-5" /> AI Risk Alerts
                                      </h4>
                                      <ul className="space-y-2">
                                          {data.riskAlerts.map((r, i) => (
                                              <li key={i} className="text-sm text-red-700">{r}</li>
                                          ))}
                                      </ul>
                                  </div>
                              )}
                          </>
                      ) : <p className="text-gray-500 text-center py-32">Loading AI insights...</p>}
                  </div>
              );

        case 'news':
              return (
                  <div className="min-h-[600px] space-y-6">
                      {data.news && data.news.length > 0 ? (
                          <>
                              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                      <FileText className="w-5 h-5 text-purple-600" /> Recent News
                                  </h3>
                                  <div className="space-y-4">
                                      {data.news.map((n, i) => (
                                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                              <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                                                  n.sentiment === 'Positive' ? 'bg-green-500' :
                                                  n.sentiment === 'Negative' ? 'bg-red-500' : 'bg-gray-400'
                                              }`} />
                                              <div className="flex-1">
                                                  <p className="text-sm font-medium text-gray-900">{n.headline}</p>
                                                  <p className="text-xs text-gray-500 mt-1">{n.date}</p>
                                              </div>
                                              {n.sentiment && (
                                                  <span className={`px-2 py-0.5 text-xs rounded ${
                                                      n.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                                                      n.sentiment === 'Negative' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                                                  }`}>
                                                      {n.sentiment}
                                                  </span>
                                              )}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                              {data.upcomingEvents && data.upcomingEvents.length > 0 && (
                                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                          <Calendar className="w-4 h-4" /> Upcoming Events
                                      </h4>
                                      <div className="space-y-3">
                                          {data.upcomingEvents.map((e, i) => (
                                              <div key={i} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                                  <span className="text-sm text-gray-900">{e.event}</span>
                                                  <span className="text-sm text-purple-600 font-medium">{e.date}</span>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              )}
                          </>
                      ) : <p className="text-gray-500 text-center py-32">Loading news data...</p>}
                  </div>
              );

        case 'legends': {
            const legendaryFrameworks = [
                { name: 'Warren Buffett', style: 'Value / MOAT', color: '#8B5CF6', metrics: [{ label: 'MOAT', value: stock.moat, max: 100, good: 70 }, { label: 'ROE', value: stock.roe, max: 40, good: 15 }], verdict: stock.moat >= 70 && stock.roe >= 15 ? 'Strong Buy' : stock.moat >= 50 ? 'Hold' : 'Avoid' },
                { name: 'Peter Lynch', style: 'GARP', color: '#10B981', metrics: [{ label: 'PEG', value: stock.peg || 1.2, max: 3, good: 1, inverse: true }, { label: 'Growth', value: stock.sgr || 15, max: 40, good: 15 }], verdict: (stock.peg || 1.2) <= 1 ? 'Strong Buy' : (stock.peg || 1.2) <= 1.5 ? 'Buy' : 'Hold' },
                { name: 'Benjamin Graham', style: 'Deep Value', color: '#14B8A6', metrics: [{ label: 'P/E', value: stock.pe, max: 40, good: 15, inverse: true }, { label: 'Margin', value: 18, max: 50, good: 25 }], verdict: stock.pe < 15 ? 'Graham Value' : 'Not Cheap' },
                { name: 'Joel Greenblatt', style: 'Magic Formula', color: '#3B82F6', metrics: [{ label: 'ROIC', value: stock.roic || 18, max: 40, good: 15 }, { label: 'Yield', value: 8.5, max: 20, good: 8 }], verdict: (stock.roic || 18) >= 20 ? 'Top Quartile' : 'Above Avg' },
                { name: 'Ray Dalio', style: 'Risk Parity', color: '#0EA5E9', metrics: [{ label: 'Diversification', value: 72, max: 100, good: 70 }, { label: 'Risk Balance', value: 78, max: 100, good: 70 }], verdict: 'Portfolio Fit' },
                { name: 'Cathie Wood', style: 'Innovation', color: '#6366F1', metrics: [{ label: 'Innovation', value: stock.sector === 'Technology' ? 85 : 50, max: 100, good: 70 }, { label: 'TAM Growth', value: 85, max: 100, good: 60 }], verdict: stock.sector === 'Technology' ? 'Innovation' : 'Not Focus' },
                { name: 'George Soros', style: 'Reflexivity', color: '#EF4444', metrics: [{ label: 'Psychology', value: 58, max: 100, good: 40 }, { label: 'Momentum', value: 72, max: 100, good: 60 }], verdict: 'Trend Following' },
                { name: 'David Dreman', style: 'Contrarian', color: '#A855F7', metrics: [{ label: 'Low P/E', value: stock.pe < 15 ? 85 : 35, max: 100, good: 70 }, { label: 'Bias', value: 72, max: 100, good: 65 }], verdict: stock.pe < 15 ? 'Contrarian Buy' : 'Wait' },
                { name: 'John Templeton', style: 'Global Contrarian', color: '#F59E0B', metrics: [{ label: 'Pessimism', value: 65, max: 100, good: 70 }, { label: 'Global Value', value: 72, max: 100, good: 60 }], verdict: 'Contrarian Buy' },
                { name: 'Aswath Damodaran', style: 'Academic DCF', color: '#EC4899', metrics: [{ label: 'DCF Gap', value: 15, max: 50, good: 10 }, { label: 'WACC', value: 9.5, max: 15, good: 10, inverse: true }], verdict: 'Fairly Valued' },
                { name: 'Stanley Druckenmiller', style: 'Macro Opportunism', color: '#84CC16', metrics: [{ label: 'Liquidity', value: 75, max: 100, good: 60 }, { label: 'Fed Policy', value: 62, max: 100, good: 50 }], verdict: 'Macro Favorable' },
                { name: 'Carl Icahn', style: 'Activist', color: '#DC2626', metrics: [{ label: 'Governance', value: 68, max: 100, good: 60 }, { label: 'Unlock Value', value: 55, max: 100, good: 50 }], verdict: 'No Activism' },
                { name: 'Seth Klarman', style: 'Deep Value', color: '#059669', metrics: [{ label: 'Cash Option', value: 65, max: 100, good: 60 }, { label: 'Patience', value: 80, max: 100, good: 75 }], verdict: 'Margin OK' },
                { name: 'David Tepper', style: 'Distressed', color: '#EA580C', metrics: [{ label: 'Credit Cycle', value: 72, max: 100, good: 60 }, { label: 'Bold Risk', value: 65, max: 100, good: 55 }], verdict: 'Hold' },
                { name: 'Jim Simons', style: 'Quantitative', color: '#7C3AED', metrics: [{ label: 'Stat Arb', value: 78, max: 100, good: 70 }, { label: 'Alpha', value: 71, max: 100, good: 65 }], verdict: 'Quant Neutral' },
                { name: 'John Bogle', style: 'Index/Passive', color: '#64748B', metrics: [{ label: 'Cost Efficiency', value: 88, max: 100, good: 80 }, { label: 'Compound', value: 82, max: 100, good: 70 }], verdict: 'Index Component' },
            ];

            const legendRadarData = [
                { subject: 'Value', Buffett: 85, Lynch: 70, Greenblatt: 80, Graham: 90 },
                { subject: 'Growth', Buffett: 60, Lynch: 85, Greenblatt: 70, Graham: 40 },
                { subject: 'Quality', Buffett: 90, Lynch: 75, Greenblatt: 85, Graham: 70 },
                { subject: 'Momentum', Buffett: 30, Lynch: 65, Greenblatt: 50, Graham: 20 },
                { subject: 'Safety', Buffett: 85, Lynch: 60, Greenblatt: 75, Graham: 95 }
            ];

            const overallScores = legendaryFrameworks.map(l => ({
                name: l.name.split(' ')[1] || l.name.split(' ')[0],
                score: Math.round(l.metrics.reduce((sum, m) => sum + (m.inverse ? (m.max - m.value) / m.max * 100 : m.value / m.max * 100), 0) / l.metrics.length),
                color: l.color
            })).sort((a, b) => b.score - a.score);

            return (
                <div className="min-h-[600px] space-y-6">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Award className="w-8 h-8" />
                            <div>
                                <h2 className="text-2xl font-bold">Legendary Frameworks</h2>
                                <p className="text-white/80">Analyze {stock.ticker} through 16 investment philosophies</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {overallScores.slice(0, 4).map((s, i) => (
                                <div key={i} className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                                    <p className="text-sm text-white/80">#{i + 1} {s.name}</p>
                                    <p className="text-3xl font-bold">{s.score}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Value vs Growth Comparison</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={legendRadarData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                                        <Radar name="Buffett" dataKey="Buffett" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                                        <Radar name="Lynch" dataKey="Lynch" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                                        <Radar name="Graham" dataKey="Graham" stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.2} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-4 mt-2">
                                <span className="flex items-center gap-1 text-xs"><div className="w-3 h-3 rounded-full bg-purple-500" /> Buffett</span>
                                <span className="flex items-center gap-1 text-xs"><div className="w-3 h-3 rounded-full bg-green-500" /> Lynch</span>
                                <span className="flex items-center gap-1 text-xs"><div className="w-3 h-3 rounded-full bg-teal-500" /> Graham</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Framework Ranking</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={overallScores.slice(0, 8)} layout="vertical">
                                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                                        <Tooltip />
                                        <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                                            {overallScores.slice(0, 8).map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {legendaryFrameworks.map((legend, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: legend.color }}>
                                        {legend.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{legend.name}</p>
                                        <p className="text-xs text-gray-500">{legend.style}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 mb-3">
                                    {legend.metrics.map((m, j) => (
                                        <div key={j}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-gray-600">{m.label}</span>
                                                <span className="font-medium">{typeof m.value === 'number' ? m.value.toFixed(1) : m.value}</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full rounded-full" 
                                                    style={{ 
                                                        width: `${Math.min((m.value / m.max) * 100, 100)}%`,
                                                        backgroundColor: (m.inverse ? m.value < m.good : m.value >= m.good) ? '#10B981' : '#F59E0B'
                                                    }} 
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="pt-2 border-t border-gray-100">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        legend.verdict.includes('Buy') || legend.verdict.includes('Strong') || legend.verdict.includes('Top') ? 'bg-green-100 text-green-700' :
                                        legend.verdict.includes('Hold') || legend.verdict.includes('OK') || legend.verdict.includes('Fit') ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {legend.verdict}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4" /> Framework Consensus
                        </h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-600">Bullish</p>
                                <p className="text-3xl font-bold text-green-600">{legendaryFrameworks.filter(l => l.verdict.includes('Buy') || l.verdict.includes('Strong')).length}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-600">Neutral</p>
                                <p className="text-3xl font-bold text-yellow-600">{legendaryFrameworks.filter(l => l.verdict.includes('Hold') || l.verdict.includes('OK') || l.verdict.includes('Fit')).length}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-600">Bearish</p>
                                <p className="text-3xl font-bold text-red-600">{legendaryFrameworks.filter(l => l.verdict.includes('Avoid') || l.verdict.includes('Not')).length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        default:
            return (
                <div className="min-h-[600px] bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="text-center text-gray-500 py-32">
                        <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p>Analysis data will appear here</p>
                    </div>
                </div>
            );
    }
}