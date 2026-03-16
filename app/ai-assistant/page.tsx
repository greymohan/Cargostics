'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, TrendingUp, Route, Truck, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: { label: string; icon: React.ElementType }[];
}

const initialSuggestions = [
  { label: 'Optimize today\'s routes', icon: Route },
  { label: 'Show fleet health summary', icon: Truck },
  { label: 'Predict delays for active loads', icon: AlertTriangle },
  { label: 'Revenue forecast this quarter', icon: TrendingUp },
];

const aiResponses: Record<string, string> = {
  'optimize': "I've analyzed your 24 active routes and found 3 optimization opportunities:\n\n1. **LD-2024-001849** (Melbourne → Adelaide): Reroute via Western Hwy instead of Princes Hwy — saves 45 min and $32 in fuel\n2. **LD-2024-001845** (Sydney → Brisbane): Suggest rest stop at Taree for fatigue management compliance\n3. **LD-2024-001853** (Newcastle → Sydney): Can consolidate with LD-2024-001847 return leg\n\nEstimated savings: **$128/day** across all routes.",
  'fleet': "**Fleet Health Summary:**\n\n🟢 **Healthy (7 vehicles):** Avg score 91.4%\n🟡 **Needs Attention (2 vehicles):** TRK-1033 (78%), TRK-1007 (71%)\n🔴 **Critical (1 vehicle):** TRK-1075 (35%) — Overdue for maintenance\n\n**Recommendations:**\n- Schedule TRK-1075 for immediate service\n- TRK-1007 reefer unit needs compressor check\n- Fleet average health: **79.1%** (target: 85%)",
  'delay': "**Delay Risk Analysis for Active Loads:**\n\n⚠️ **High Risk:**\n- LD-2024-001849: Pacific Hwy accident causing 2-hour delay (78% confidence)\n- LD-2024-001845: Driver approaching fatigue limit (65% confidence)\n\n✅ **Low Risk:**\n- LD-2024-001851, LD-2024-001853: On track for on-time delivery\n\n**Mitigation:** Recommend pre-assigning backup driver for LD-2024-001845",
  'revenue': "**Q1 2026 Revenue Forecast:**\n\n📊 Current MTD: **$1.2M** (+15% vs Feb)\nProjected March: **$1.35M**\nQ1 Total Estimate: **$3.13M**\n\n**Key Drivers:**\n- Major retail contracts driving 48% of revenue\n- VIC→SA lane up 22% in volume\n- Fuel costs trending down 3% — improving margins\n\n**Risk:** 2 disputed invoices totaling $9,300 may impact collections",
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { scrollRef?.current?.scrollTo?.({ top: scrollRef?.current?.scrollHeight ?? 0, behavior: 'smooth' }); }, [messages]);

  const getAIResponse = (query: string): string => {
    const q = query?.toLowerCase?.() ?? '';
    if (q?.includes?.('route') || q?.includes?.('optim')) return aiResponses?.['optimize'] ?? '';
    if (q?.includes?.('fleet') || q?.includes?.('health') || q?.includes?.('vehicle')) return aiResponses?.['fleet'] ?? '';
    if (q?.includes?.('delay') || q?.includes?.('predict') || q?.includes?.('risk')) return aiResponses?.['delay'] ?? '';
    if (q?.includes?.('revenue') || q?.includes?.('forecast') || q?.includes?.('quarter')) return aiResponses?.['revenue'] ?? '';
    return `I've analyzed your request: "${query}"\n\nBased on current operations data:\n- 247 active loads across 24 routes\n- Fleet utilization at 57%\n- 3 active alerts requiring attention\n\nWould you like me to drill deeper into any specific area?`;
  };

  const sendMessage = async (text: string) => {
    if (!text?.trim?.()) return;
    const userMsg: Message = { id: `msg-${Date.now()}`, role: 'user', content: text?.trim?.() ?? '', timestamp: 'Just now' };
    setMessages(prev => [...(prev ?? []), userMsg]);
    setInput('');
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1500));
    const aiMsg: Message = {
      id: `msg-${Date.now() + 1}`, role: 'assistant', content: getAIResponse(text),
      timestamp: 'Just now',
      suggestions: [{ label: 'Tell me more', icon: Sparkles }, { label: 'Export this analysis', icon: CheckCircle }],
    };
    setMessages(prev => [...(prev ?? []), aiMsg]);
    setIsTyping(false);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-[900px] mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Ops Assistant</h1>
        <p className="text-sm text-muted-foreground">Intelligent insights and recommendations powered by AI</p>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4">
        {(messages?.length ?? 0) === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2">AI Operations Assistant</h2>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-8">Ask questions about your logistics operations, get route optimizations, delay predictions, and fleet insights.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {initialSuggestions?.map?.((s, i) => (
                <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => sendMessage(s?.label ?? '')}
                  className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:bg-accent/50 hover:shadow-md transition text-left">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{s?.label ?? ''}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {(messages ?? [])?.map?.((msg) => (
            <motion.div key={msg?.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', msg?.role === 'user' ? 'justify-end' : 'justify-start')}>
              {msg?.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={cn('max-w-[80%] rounded-2xl px-4 py-3', msg?.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border')}>
                <div className="text-sm whitespace-pre-wrap">{msg?.content ?? ''}</div>
                {(msg?.suggestions?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
                    {(msg?.suggestions ?? [])?.map?.((s, i) => (
                      <button key={i} onClick={() => sendMessage(s?.label ?? '')}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/50 rounded-lg text-xs font-medium hover:bg-accent transition">
                        <s.icon className="w-3 h-3" /> {s?.label ?? ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-card border border-border rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing operations data...
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4">
        <form onSubmit={e => { e?.preventDefault?.(); sendMessage(input); }} className="flex gap-3">
          <input value={input} onChange={e => setInput(e?.target?.value ?? '')}
            placeholder="Ask about routes, fleet, delays, revenue..."
            className="flex-1 h-12 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
          <button type="submit" disabled={!input?.trim?.() || isTyping}
            className="h-12 w-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:opacity-90 transition disabled:opacity-50">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
