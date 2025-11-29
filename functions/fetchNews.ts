import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

function formatTime(dateStr) {
    if (!dateStr) return 'Recently';
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    } catch (e) {
        return 'Recently';
    }
}

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    try {
        const user = await base44.auth.me();
        
        if (!user) {
            return Response.json({ error: 'Unauthorized', articles: [] }, { status: 401 });
        }

        let body = {};
        try {
            body = await req.json();
        } catch (e) {
            // Empty body is fine
        }
        
        const { query, category, limit = 15 } = body;
        const searchTerm = query || category || 'technology';
        
        try {
            const llmResponse = await base44.integrations.Core.InvokeLLM({
                prompt: `Search the web and find ${limit} recent real news articles about "${searchTerm}". For each article provide: title, source name, a brief summary, the actual URL, and approximate publish date.`,
                add_context_from_internet: true,
                response_json_schema: {
                    type: "object",
                    properties: {
                        articles: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    title: { type: "string" },
                                    source: { type: "string" },
                                    summary: { type: "string" },
                                    url: { type: "string" },
                                    publishedAt: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            
            const articles = (llmResponse?.articles || [])
                .filter(a => a && a.title)
                .map(a => ({
                    title: a.title || '',
                    source: a.source || 'News',
                    summary: a.summary || '',
                    url: a.url || '',
                    time: formatTime(a.publishedAt)
                }));
            
            return Response.json({
                success: true,
                count: articles.length,
                articles: articles,
            });
        } catch (llmError) {
            console.error('LLM error:', llmError.message);
            return Response.json({
                success: false,
                error: llmError.message,
                articles: []
            });
        }
        
    } catch (error) {
        console.error('fetchNews error:', error.message);
        return Response.json({ 
            success: false, 
            error: error.message,
            articles: [] 
        });
    }
});