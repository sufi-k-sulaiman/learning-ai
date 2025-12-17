Deno.serve(async (req) => {
    try {
        const { ticker } = await req.json();
        
        if (!ticker) {
            return Response.json({ error: 'Ticker required' }, { status: 400 });
        }

        // Fetch quote data
        const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
        const quoteRes = await fetch(quoteUrl);
        const quoteData = await quoteRes.json();
        
        if (quoteData.chart?.error) {
            return Response.json({ error: 'Invalid ticker' }, { status: 404 });
        }

        const result = quoteData.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];
        
        // Fetch key statistics
        const statsUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics,financialData,summaryDetail`;
        const statsRes = await fetch(statsUrl);
        const statsData = await statsRes.json();
        const stats = statsData.quoteSummary?.result?.[0] || {};
        
        const price = meta.regularMarketPrice;
        const previousClose = meta.chartPreviousClose;
        const change = ((price - previousClose) / previousClose) * 100;

        return Response.json({
            ticker: meta.symbol,
            name: meta.longName || meta.symbol,
            sector: stats.summaryProfile?.sector || 'Unknown',
            industry: stats.summaryProfile?.industry || 'Unknown',
            marketCap: meta.marketCap ? `$${(meta.marketCap / 1e9).toFixed(2)}B` : 'N/A',
            price: price,
            change: change,
            volume: meta.regularMarketVolume ? `${(meta.regularMarketVolume / 1e6).toFixed(2)}M` : 'N/A',
            pe: stats.summaryDetail?.trailingPE?.raw || null,
            eps: stats.defaultKeyStatistics?.trailingEps?.raw || null,
            dividend: stats.summaryDetail?.dividendYield?.raw ? (stats.summaryDetail.dividendYield.raw * 100) : null,
            beta: stats.defaultKeyStatistics?.beta?.raw || null,
            roe: stats.financialData?.returnOnEquity?.raw ? (stats.financialData.returnOnEquity.raw * 100) : null,
            roic: stats.financialData?.returnOnAssets?.raw ? (stats.financialData.returnOnAssets.raw * 100) : null,
            roa: stats.financialData?.returnOnAssets?.raw ? (stats.financialData.returnOnAssets.raw * 100) : null,
            peg: stats.defaultKeyStatistics?.pegRatio?.raw || null,
            fcf: stats.financialData?.freeCashflow?.raw || null,
            debtToEquity: stats.financialData?.debtToEquity?.raw || null,
            currentRatio: stats.financialData?.currentRatio?.raw || null,
            quickRatio: stats.financialData?.quickRatio?.raw || null,
            profitMargin: stats.financialData?.profitMargins?.raw ? (stats.financialData.profitMargins.raw * 100) : null,
            operatingMargin: stats.financialData?.operatingMargins?.raw ? (stats.financialData.operatingMargins.raw * 100) : null,
            grossMargin: stats.financialData?.grossMargins?.raw ? (stats.financialData.grossMargins.raw * 100) : null,
            revenueGrowth: stats.financialData?.revenueGrowth?.raw ? (stats.financialData.revenueGrowth.raw * 100) : null,
            earningsGrowth: stats.financialData?.earningsGrowth?.raw ? (stats.financialData.earningsGrowth.raw * 100) : null
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});