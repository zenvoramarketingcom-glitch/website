import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);

const rawGeminiKey = process.env.GEMINI_API_KEY?.trim();
const hasConfiguredGeminiKey = Boolean(rawGeminiKey && rawGeminiKey !== 'MY_GEMINI_API_KEY');

const ai = hasConfiguredGeminiKey
  ? new GoogleGenAI({
      apiKey: rawGeminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

interface StoredInquiry {
  id: string;
  createdAt: string;
  name: string;
  contact: string;
  businessType: string;
  serviceName: string;
  urgency: string;
  areaSummary: string;
  budget?: string;
  goal?: string;
  notes?: string;
}

const recentInquiries: StoredInquiry[] = [];

const MANGAL_WEB_SYSTEM_PROMPT = `You are the official AI Growth Assistant for Mangal Web (Mangal Webs), a digital agency founded by Mangal, an 18-year-old web designer, performance marketer, and automation specialist.

Key facts about Mangal Web:
- Founder: Mangal (18 years old), hands-on builder specializing in custom websites, Shopify e-commerce stores, Meta Ads (Facebook & Instagram), WhatsApp Business automation, and industry-specific growth systems.
- Industries served: Real Estate, Dental & Medical Clinics, Solar Energy, Clothing & Apparel Shops, D2C E-Commerce, Gyms & Fitness, Restaurants & Cafes, Coaching Institutes, Salons, Automobile Dealerships, and B2B Manufacturers.
- Services:
  1. Custom Websites & Shopify Stores: Responsive websites, fast ad landing pages, full Shopify setup with UPI/card checkout.
  2. Meta Ads Growth: Sales, Leads, Traffic, and Local Brand Awareness campaigns with pin-and-radius geo-targeting.
  3. WhatsApp Automation: Instant lead greeting bots, Shopify abandoned-cart recovery, clinic/real estate appointment reminders, broadcast CRM flows.
  4. Sample Websites available on the page: Real Estate (Aurelia Estates), Dental Clinic (Orora Dental Studio), Solar Energy (HeliosGrid Solar), Clothing Shopify (Vastra Linen & Co.), Fitness (Kinetic Form Club), Hospitality (Saffron & Stone Kitchen).

Communication rules:
- Reply concisely (2 to 4 crisp sentences), friendly, confident, and practical.
- Match the user's language automatically (if the user writes in Hindi or Hinglish, reply in natural Hinglish/Hindi; if in English, reply in clear English).
- Never invent fake pricing or fake client reviews. Encourage the user to fill the Inquiry form or pick their target area on the map to get a custom project roadmap from Mangal.`;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body as {
      message?: string;
      history?: Array<{ role: 'user' | 'model'; text: string }>;
    };

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ error: 'Please enter a message.' });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'Gemini AI assistant requires GEMINI_API_KEY configured in the server environment.',
      });
      return;
    }

    try {
      const conversationContext = (history ?? [])
        .slice(-6)
        .map((m) => `${m.role === 'user' ? 'Visitor' : 'Assistant'}: ${m.text}`)
        .join('\n');

      const prompt = conversationContext
        ? `${conversationContext}\nVisitor: ${message.trim()}\nAssistant:`
        : message.trim();

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction: MANGAL_WEB_SYSTEM_PROMPT,
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({ error: 'Empty response received from AI assistant.' });
        return;
      }

      res.json({ reply });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Unable to reach Gemini service.';
      console.error('Gemini /api/chat error:', errMsg);
      res.status(500).json({ error: 'AI assistant is temporarily unavailable. Please try again.' });
    }
  });

  app.post('/api/inquiries', (req, res) => {
    const body = req.body as Partial<StoredInquiry>;
    if (!body.name?.trim() || !body.contact?.trim() || !body.businessType?.trim()) {
      res.status(400).json({ error: 'Name, contact details, and business type are required.' });
      return;
    }

    const record: StoredInquiry = {
      id: `MW-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      name: body.name.trim(),
      contact: body.contact.trim(),
      businessType: body.businessType.trim(),
      serviceName: body.serviceName?.trim() || 'General Agency Inquiry',
      urgency: body.urgency?.trim() || 'Just Need Information',
      areaSummary: body.areaSummary?.trim() || 'Delhi NCR · 25 km radius',
      budget: body.budget?.trim(),
      goal: body.goal?.trim(),
      notes: body.notes?.trim(),
    };

    recentInquiries.unshift(record);
    if (recentInquiries.length > 50) recentInquiries.pop();

    res.status(201).json({ inquiry: record });
  });

  app.get('/api/inquiries', (_req, res) => {
    res.json({ count: recentInquiries.length, inquiries: recentInquiries.slice(0, 10) });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mangal Web server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
