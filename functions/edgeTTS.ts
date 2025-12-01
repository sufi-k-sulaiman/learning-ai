import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Edge TTS voice options
const VOICES = {
    'en-US-AriaNeural': 'en-US-AriaNeural',
    'en-US-GuyNeural': 'en-US-GuyNeural',
    'en-GB-SoniaNeural': 'en-GB-SoniaNeural',
    'en-GB-RyanNeural': 'en-GB-RyanNeural',
    'en-AU-NatashaNeural': 'en-AU-NatashaNeural',
    'en-AU-WilliamNeural': 'en-AU-WilliamNeural',
};

// WebSocket-based Edge TTS implementation
async function generateSpeech(text, voice = 'en-US-AriaNeural') {
    const outputFormat = 'audio-24khz-48kbitrate-mono-mp3';
    
    // Generate unique request ID
    const requestId = crypto.randomUUID().replace(/-/g, '');
    
    // Edge TTS WebSocket URL
    const wsUrl = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=${requestId}`;
    
    return new Promise((resolve, reject) => {
        const audioChunks = [];
        let ws;
        
        try {
            ws = new WebSocket(wsUrl);
            ws.binaryType = 'arraybuffer';
            
            const timeout = setTimeout(() => {
                ws.close();
                reject(new Error('WebSocket timeout'));
            }, 30000);
            
            ws.onopen = () => {
                // Send configuration
                const configMessage = `Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"${outputFormat}"}}}}`;
                ws.send(configMessage);
                
                // Send SSML request
                const date = new Date().toISOString();
                const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voice}'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>${escapeXml(text)}</prosody></voice></speak>`;
                const ssmlMessage = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${date}Z\r\nPath:ssml\r\n\r\n${ssml}`;
                ws.send(ssmlMessage);
            };
            
            ws.onmessage = (event) => {
                if (event.data instanceof ArrayBuffer) {
                    // Binary audio data
                    const data = new Uint8Array(event.data);
                    // Find the header separator and extract audio
                    const headerEnd = findHeaderEnd(data);
                    if (headerEnd !== -1) {
                        const audioData = data.slice(headerEnd);
                        if (audioData.length > 0) {
                            audioChunks.push(audioData);
                        }
                    }
                } else if (typeof event.data === 'string') {
                    // Text message - check for turn end
                    if (event.data.includes('Path:turn.end')) {
                        clearTimeout(timeout);
                        ws.close();
                        
                        // Combine all audio chunks
                        const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
                        const combined = new Uint8Array(totalLength);
                        let offset = 0;
                        for (const chunk of audioChunks) {
                            combined.set(chunk, offset);
                            offset += chunk.length;
                        }
                        
                        resolve(combined);
                    }
                }
            };
            
            ws.onerror = (error) => {
                clearTimeout(timeout);
                reject(new Error('WebSocket error: ' + error.message));
            };
            
            ws.onclose = (event) => {
                if (audioChunks.length === 0 && event.code !== 1000) {
                    reject(new Error('WebSocket closed without audio'));
                }
            };
            
        } catch (error) {
            reject(error);
        }
    });
}

// Helper to escape XML special characters
function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Find the end of the binary header (looking for \r\n\r\n pattern)
function findHeaderEnd(data) {
    for (let i = 0; i < data.length - 3; i++) {
        if (data[i] === 0x0D && data[i+1] === 0x0A && data[i+2] === 0x0D && data[i+3] === 0x0A) {
            return i + 4;
        }
    }
    // Also check for "Path:audio" header
    const str = new TextDecoder().decode(data.slice(0, Math.min(200, data.length)));
    const audioIndex = str.indexOf('Path:audio');
    if (audioIndex !== -1) {
        // Find the double newline after Path:audio
        for (let i = audioIndex; i < data.length - 1; i++) {
            if (data[i] === 0x0D && data[i+1] === 0x0A) {
                return i + 2;
            }
        }
    }
    return -1;
}

// Convert array buffer to base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        });
    }

    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { text, voice = 'en-US-AriaNeural', returnBase64 = true } = body;

        if (!text || typeof text !== 'string') {
            return Response.json({ error: 'Text is required' }, { status: 400 });
        }

        // Limit text length to prevent abuse
        const maxLength = 10000;
        const truncatedText = text.slice(0, maxLength);

        console.log(`Generating speech for ${truncatedText.length} characters with voice ${voice}`);

        // Generate audio using Edge TTS
        const audioData = await generateSpeech(truncatedText, voice);

        if (returnBase64) {
            // Return as base64 for frontend download
            const base64Audio = arrayBufferToBase64(audioData);
            return Response.json({ 
                audio: base64Audio,
                format: 'mp3',
                voice: voice,
                length: truncatedText.length
            });
        } else {
            // Return as binary MP3
            return new Response(audioData, {
                headers: {
                    'Content-Type': 'audio/mpeg',
                    'Content-Disposition': 'attachment; filename="speech.mp3"',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

    } catch (error) {
        console.error('Edge TTS error:', error);
        return Response.json({ 
            error: error.message || 'Failed to generate speech',
            details: error.toString()
        }, { status: 500 });
    }
});