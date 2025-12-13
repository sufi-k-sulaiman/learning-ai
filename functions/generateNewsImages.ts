import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { articles } = await req.json();
        
        if (!articles || !Array.isArray(articles)) {
            return Response.json({ error: 'Invalid articles array' }, { status: 400 });
        }
        
        // Generate up to 12 images: first 8, then 4 more
        const maxImages = Math.min(articles.length, 12);
        const results = [];
        
        // First batch: 8 images
        const firstBatchSize = Math.min(8, maxImages);
        for (let i = 0; i < firstBatchSize; i += 4) {
            const batch = articles.slice(i, Math.min(i + 4, firstBatchSize));
            
            const imagePromises = batch.map(async (article) => {
                const cleanTitle = article.title
                    .replace(/<[^>]*>/g, '')
                    .replace(/&[^;]+;/g, ' ')
                    .replace(/https?:\/\/[^\s]+/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                
                try {
                    const result = await base44.integrations.Core.GenerateImage({
                        prompt: `Professional news photography depicting: ${cleanTitle}. Photorealistic, editorial style, high quality, no text or words, no logos`
                    });
                    return result?.url || null;
                } catch (error) {
                    console.error('Image generation failed:', error);
                    return null;
                }
            });
            
            const batchResults = await Promise.all(imagePromises);
            results.push(...batchResults);
            
            if (i + 4 < firstBatchSize) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        // Second batch: 4 more images if available
        if (maxImages > 8) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const secondBatch = articles.slice(8, maxImages);
            
            const imagePromises = secondBatch.map(async (article) => {
                const cleanTitle = article.title
                    .replace(/<[^>]*>/g, '')
                    .replace(/&[^;]+;/g, ' ')
                    .replace(/https?:\/\/[^\s]+/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
                
                try {
                    const result = await base44.integrations.Core.GenerateImage({
                        prompt: `Professional news photography depicting: ${cleanTitle}. Photorealistic, editorial style, high quality, no text or words, no logos`
                    });
                    return result?.url || null;
                } catch (error) {
                    console.error('Image generation failed:', error);
                    return null;
                }
            });
            
            const batchResults = await Promise.all(imagePromises);
            results.push(...batchResults);
        }
        
        return Response.json({ images: results });
    } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});