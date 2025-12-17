Deno.serve(async (req) => {
    try {
        const { ticker } = await req.json();
        
        if (!ticker) {
            return Response.json({ error: 'Ticker required' }, { status: 400 });
        }

        const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price,summaryDetail,defaultKeyStatistics,financialData,assetProfile`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        
        const data = await response.json();
        const result = data.quoteSummary?.result?.[0];
        
        if (!result) {
            return Response.json({ error: 'Invalid ticker' }, { status: 404 });
        }

        const price = result.price || {};
        const detail = result.summaryDetail || {};
        const stats = result.defaultKeyStatistics || {};
        const financial = result.financialData || {};
        const profile = result.assetProfile || {};
        
        const currentPrice = price.regularMarketPrice?.raw;
        const previousClose = price.regularMarketPreviousClose?.raw;
        const change = previousClose ? ((currentPrice - previousClose) / previousClose) * 100 : 0;

        return Response.json({
            ticker: price.symbol || ticker,
            name: price.longName || price.shortName || ticker,
            sector: profile.sector || 'Technology',
            industry: profile.industry || 'Software',
            marketCap: price.marketCap?.fmt || 'N/A',
            price: currentPrice,
            change: change,
            volume: price.regularMarketVolume?.fmt || price.averageDailyVolume10Day?.fmt || 'N/A',
            pe: detail.trailingPE?.raw,
            eps: stats.trailingEps?.raw,
            dividend: detail.dividendYield?.raw ? (detail.dividendYield.raw * 100) : 0,
            beta: stats.beta?.raw || 1,
            roe: financial.returnOnEquity?.raw ? (financial.returnOnEquity.raw * 100) : 15,
            roic: financial.returnOnAssets?.raw ? (financial.returnOnAssets.raw * 100) : 12,
            roa: financial.returnOnAssets?.raw ? (financial.returnOnAssets.raw * 100) : 10,
            peg: stats.pegRatio?.raw,
            fcf: financial.freeCashflow?.raw,
            debtToEquity: financial.debtToEquity?.raw,
            currentRatio: financial.currentRatio?.raw,
            quickRatio: financial.quickRatio?.raw,
            profitMargin: financial.profitMargins?.raw ? (financial.profitMargins.raw * 100) : null,
            operatingMargin: financial.operatingMargins?.raw ? (financial.operatingMargins.raw * 100) : null,
            grossMargin: financial.grossMargins?.raw ? (financial.grossMargins.raw * 100) : null,
            revenueGrowth: financial.revenueGrowth?.raw ? (financial.revenueGrowth.raw * 100) : 8,
            earningsGrowth: financial.earningsGrowth?.raw ? (financial.earningsGrowth.raw * 100) : 10
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});