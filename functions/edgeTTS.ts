import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

/**
 * SmartTTS - Edge TTS Backend Function for Deno
 * Converts text to speech using Microsoft Edge TTS (free, high quality)
 * 
 * Features:
 * - Multiple paragraphs with automatic pauses
 * - Multiple voice options (US, UK, AU - male/female)
 * - Adjustable speech rate and pitch
 * - Returns MP3 audio
 */

// Available voices
const VOICES = {
    // US voices
    'en-US-AriaNeural': { name: 'Aria', gender: 'female', locale: 'US' },
    'en-US-JennyNeural': { name: 'Jenny', gender: 'female', locale: 'US' },
    'en-US-GuyNeural': { name: 'Guy', gender: 'male', locale: 'US' },
    'en-US-ChristopherNeural': { name: 'Christopher', gender: 'male', locale: 'US' },
    // UK voices
    'en-GB-SoniaNeural': { name: 'Sonia', gender: 'female', locale: 'UK' },
    'en-GB-LibbyNeural': { name: 'Libby', gender: 'female', locale: 'UK' },
    'en-GB-RyanNeural': { name: 'Ryan', gender: 'male', locale: 'UK' },
    // AU voices
    'en-AU-NatashaNeural': { name: 'Natasha', gender: 'female', locale: 'AU' },
    'en-AU-WilliamNeural': { name: 'William', gender: 'male', locale: 'AU' },
};

// Generate speech for a single text segment using Edge TTS WebSocket
async function generateSpeechSegment(text, voice, rate = 0, pitch = 0) {
    const outputFormat = 'audio-24khz-96kbitrate-mono-mp3';
    const requestId = crypto.randomUUID().replace(/-/g, '');
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
            }, 60000);
            
            ws.onopen = () => {
                // Send configuration
                const configMessage = `Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"${outputFormat}"}}}}`;
                ws.send(configMessage);
                
                // Build SSML with rate and pitch adjustments
                const rateStr = rate >= 0 ? `+${rate}%` : `${rate}%`;
                const pitchStr = pitch >= 0 ? `+${pitch}Hz` : `${pitch}Hz`;
                const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voice}'><prosody pitch='${pitchStr}' rate='${rateStr}' volume='+0%'>${escapeXml(text)}</prosody></voice></speak>`;
                
                const date = new Date().toISOString();
                const ssmlMessage = `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${date}Z\r\nPath:ssml\r\n\r\n${ssml}`;
                ws.send(ssmlMessage);
            };
            
            ws.onmessage = (event) => {
                if (event.data instanceof ArrayBuffer) {
                    const data = new Uint8Array(event.data);
                    const headerEnd = findHeaderEnd(data);
                    if (headerEnd !== -1) {
                        const audioData = data.slice(headerEnd);
                        if (audioData.length > 0) {
                            audioChunks.push(audioData);
                        }
                    }
                } else if (typeof event.data === 'string') {
                    if (event.data.includes('Path:turn.end')) {
                        clearTimeout(timeout);
                        ws.close();
                        
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
                reject(new Error('WebSocket error'));
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

// Generate silent MP3 frames for pause between paragraphs
function generateSilence(durationMs) {
    // MP3 frame for silence at 24kHz - simplified approach
    // Each frame is ~26ms at 24kHz, so we need durationMs/26 frames
    const frameCount = Math.ceil(durationMs / 26);
    const silentFrame = new Uint8Array([
        0xFF, 0xFB, 0x90, 0x00, // MP3 frame header
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);
    
    const totalSize = frameCount * silentFrame.length;
    const silence = new Uint8Array(totalSize);
    for (let i = 0; i < frameCount; i++) {
        silence.set(silentFrame, i * silentFrame.length);
    }
    return silence;
}

// Escape XML special characters
function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Find end of binary header
function findHeaderEnd(data) {
    for (let i = 0; i < data.length - 3; i++) {
        if (data[i] === 0x0D && data[i+1] === 0x0A && data[i+2] === 0x0D && data[i+3] === 0x0A) {
            return i + 4;
        }
    }
    const str = new TextDecoder().decode(data.slice(0, Math.min(200, data.length)));
    const audioIndex = str.indexOf('Path:audio');
    if (audioIndex !== -1) {
        for (let i = audioIndex; i < data.length - 1; i++) {
            if (data[i] === 0x0D && data[i+1] === 0x0A) {
                return i + 2;
            }
        }
    }
    return -1;
}

// Convert to base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Split text into paragraphs
function splitIntoParagraphs(text) {
    return text
        .split(/\n\s*\n|\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);
}

Deno.serve(async (req) => {
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
        const { 
            text,
            paragraphs: inputParagraphs,
            voice = 'en-US-AriaNeural',
            rate = 0,           // -50 to +100 (percentage)
            pitch = 0,          // -50 to +50 (Hz adjustment)
            pauseMs = 800,      // Pause between paragraphs in ms
            returnBase64 = true,
            listVoices = false
        } = body;

        // Return available voices if requested
        if (listVoices) {
            return Response.json({ 
                voices: Object.entries(VOICES).map(([id, info]) => ({
                    id,
                    ...info
                }))
            });
        }

        // Get paragraphs from either source
        let paragraphs = inputParagraphs || (text ? splitIntoParagraphs(text) : []);
        
        if (paragraphs.length === 0) {
            return Response.json({ error: 'Text or paragraphs required' }, { status: 400 });
        }

        // Limit total length
        const maxTotalLength = 50000;
        let totalLength = 0;
        paragraphs = paragraphs.filter(p => {
            if (totalLength + p.length <= maxTotalLength) {
                totalLength += p.length;
                return true;
            }
            return false;
        });

        console.log(`Generating ${paragraphs.length} paragraphs with voice ${voice}`);

        // Generate audio for each paragraph
        const audioSegments = [];
        const silence = generateSilence(pauseMs);
        
        for (let i = 0; i < paragraphs.length; i++) {
            console.log(`Processing paragraph ${i + 1}/${paragraphs.length}...`);
            
            const audio = await generateSpeechSegment(paragraphs[i], voice, rate, pitch);
            audioSegments.push(audio);
            
            // Add pause between paragraphs (not after last one)
            if (i < paragraphs.length - 1) {
                audioSegments.push(silence);
            }
        }

        // Combine all segments
        const totalSize = audioSegments.reduce((sum, seg) => sum + seg.length, 0);
        const combined = new Uint8Array(totalSize);
        let offset = 0;
        for (const segment of audioSegments) {
            combined.set(segment, offset);
            offset += segment.length;
        }

        console.log(`Generated ${totalSize} bytes of audio`);

        if (returnBase64) {
            const base64Audio = arrayBufferToBase64(combined);
            return Response.json({ 
                audio: base64Audio,
                format: 'mp3',
                voice: voice,
                paragraphCount: paragraphs.length,
                totalCharacters: totalLength,
                sizeBytes: totalSize
            });
        } else {
            return new Response(combined, {
                headers: {
                    'Content-Type': 'audio/mpeg',
                    'Content-Disposition': 'attachment; filename="speech.mp3"',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

    } catch (error) {
        console.error('SmartTTS error:', error);
        return Response.json({ 
            error: error.message || 'Failed to generate speech'
        }, { status: 500 });
    }
});