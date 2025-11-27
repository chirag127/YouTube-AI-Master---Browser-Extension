export class GeminiAPI {
    constructor(k) { this.apiKey = k; this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta' }

    async call(p, m) {
        if (!this.apiKey) throw new Error('API Key required');

        const n = m.startsWith('models/') ? m.replace('models/', '') : m;
        const u = `${this.baseUrl}/models/${n}:generateContent?key=${this.apiKey}`;

        try {
            const r = await fetch(u, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] })
            });

            if (!r.ok) {
                const t = await r.text();
                let e = r.statusText;
                try {
                    const d = JSON.parse(t);
                    e = d.error?.message || e;
                } catch (x) { }
                throw new Error(`Gemini API Error (${r.status}): ${e}`);
            }

            const t = await r.text();
            try {
                const d = JSON.parse(t);
                const g = d.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!g) throw new Error('No content generated');
                return g;
            } catch (e) {
                throw new Error(`Failed to parse response: ${e.message}`);
            }
        } catch (e) {
            if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
                throw new Error(`Network error calling model ${n}: ${e.message}`);
            }
            throw e;
        }
    }

    async callStream(p, m, onChunk) {
        if (!this.apiKey) throw new Error('API Key required');

        const n = m.startsWith('models/') ? m.replace('models/', '') : m;
        const u = `${this.baseUrl}/models/${n}:streamGenerateContent?alt=sse&key=${this.apiKey}`;

        try {
            const r = await fetch(u, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: p }] }] })
            });

            if (!r.ok) {
                const t = await r.text();
                let e = r.statusText;
                try {
                    const d = JSON.parse(t);
                    e = d.error?.message || e;
                } catch (x) { }
                throw new Error(`Gemini API Error (${r.status}): ${e}`);
            }

            const reader = r.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let fullText = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const json = JSON.parse(line.slice(6));
                            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {
                                fullText += text;
                                if (onChunk) onChunk(text, fullText);
                            }
                        } catch (e) {
                            console.warn('Failed to parse SSE chunk:', e);
                        }
                    }
                }
            }

            if (!fullText) throw new Error('No content generated');
            return fullText;
        } catch (e) {
            if (e.message.includes('Failed to fetch') || e.message.includes('NetworkError')) {
                throw new Error(`Network error calling model ${n}: ${e.message}`);
            }
            throw e;
        }
    }
}
