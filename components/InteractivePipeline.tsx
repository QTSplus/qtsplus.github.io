import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Brain, MessageSquare, Clock } from 'lucide-react';

// Simulated tokens for a video
const TOTAL_TOKENS = 30;

interface Token {
  id: number;
  relevance: number; // High relevance means it matches the query
  type: 'scenery' | 'object' | 'person' | 'action';
}

const InteractivePipeline: React.FC = () => {
  const [queryType, setQueryType] = useState<'specific' | 'summary'>('specific');
  const [activeStage, setActiveStage] = useState<number>(0);
  
  // Simulate generating tokens based on query type
  // Specific query: Spiky relevance (Finding a needle in haystack)
  // Summary query: Distributed relevance (Need overview)
  const [tokens, setTokens] = useState<Token[]>([]);
  
  useEffect(() => {
    const newTokens: Token[] = Array.from({ length: TOTAL_TOKENS }).map((_, i) => {
      let relevance = 0;
      if (queryType === 'specific') {
        // Relevance peaks in one spot (e.g., frame 15-18)
        relevance = Math.max(0.1, 1 - Math.abs(i - 15) * 0.3);
      } else {
        // Relevance is spread out but noisy
        relevance = 0.3 + Math.random() * 0.5;
      }
      
      return {
        id: i,
        relevance,
        type: i % 4 === 0 ? 'person' : i % 3 === 0 ? 'action' : 'scenery'
      };
    });
    setTokens(newTokens);
  }, [queryType]);

  // Animation loop for stages
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getBudget = () => queryType === 'specific' ? 5 : 12;
  const budget = getBudget();

  return (
    <section className="py-16 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h3 className="text-3xl font-bold text-slate-900">How QTSplus Works</h3>
          <p className="text-slate-600 mt-2">An adaptive information gate between vision and language.</p>
        </div>

        {/* Control Panel */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 inline-flex">
            <button
              onClick={() => setQueryType('specific')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                queryType === 'specific' 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Specific Query<br/><span className="text-xs opacity-80">"What color is the car?"</span>
            </button>
            <button
              onClick={() => setQueryType('summary')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                queryType === 'summary' 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Global Query<br/><span className="text-xs opacity-80">"Summarize the events."</span>
            </button>
          </div>
        </div>

        {/* Pipeline Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative">
          
          {/* Step 1: Video Input */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg border border-slate-100 h-64 flex flex-col items-center justify-center relative z-10">
            <div className="absolute top-4 left-4 font-mono text-xs text-slate-400">01 INPUT</div>
            <div className="flex flex-wrap gap-1 justify-center w-full">
              {tokens.map((t) => (
                <motion.div
                  key={t.id}
                  className="w-3 h-3 rounded-sm"
                  style={{ 
                    backgroundColor: `rgb(${100 + t.id * 5}, ${116}, ${139})`,
                    opacity: 0.6
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: t.id * 0.02 }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">Raw Vision Tokens</p>
            <p className="text-xs text-slate-500">{TOTAL_TOKENS} tokens</p>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex lg:col-span-1 justify-center">
             <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
             </motion.div>
          </div>

          {/* Step 2: QTSplus Logic (The Core) */}
          <div className="lg:col-span-4 bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800 h-80 flex flex-col relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <div className="absolute top-4 left-4 font-mono text-xs text-slate-400">02 QTS+ PROCESSING</div>
            
            {/* Query Representation */}
            <div className="mb-6 flex items-center gap-3 border-b border-slate-700 pb-4">
               <MessageSquare className="w-5 h-5 text-accent-500" />
               <div className="text-sm text-white">
                 Query: <span className="text-accent-500 font-mono">{queryType === 'specific' ? 'Localized' : 'Global'}</span>
               </div>
            </div>

            {/* Scoring Visualization */}
            <div className="flex-1 flex flex-col justify-center">
               <div className="flex items-end gap-[2px] h-32 mb-2">
                  {tokens.map((t) => (
                    <motion.div 
                      key={t.id}
                      className={`w-full rounded-t-sm transition-colors duration-500 ${t.relevance > 0.5 ? 'bg-green-500' : 'bg-slate-700'}`}
                      initial={{ height: '5%' }}
                      animate={{ height: `${t.relevance * 100}%` }}
                    />
                  ))}
               </div>
               <div className="flex justify-between text-xs text-slate-400 font-mono">
                 <span>Budget: {budget}</span>
                 <span>Tokens: {TOTAL_TOKENS}</span>
               </div>
            </div>
            
            {/* Floating Badge */}
            <motion.div 
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/20"
              animate={{ 
                 scale: [1, 1.05, 1],
                 boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 15px rgba(255,255,255,0.2)", "0 0 0px rgba(255,255,255,0)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
               Adaptive Budget
            </motion.div>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex lg:col-span-1 justify-center">
             <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
             </motion.div>
          </div>

          {/* Step 3: Output to LLM */}
          <div className="lg:col-span-3 bg-gradient-to-br from-primary-50 to-white p-6 rounded-2xl shadow-lg border border-primary-100 h-64 flex flex-col items-center justify-center relative z-10">
            <div className="absolute top-4 left-4 font-mono text-xs text-primary-400">03 LLM INPUT</div>
            
            <div className="flex flex-wrap gap-1 justify-center w-full max-w-[80%]">
              <AnimatePresence>
                {tokens
                  .filter((_, idx) => {
                    // Naive top-k logic for visual demo
                     const sortedIndices = tokens.map((t, i) => ({i, r: t.relevance})).sort((a,b) => b.r - a.r).slice(0, budget).map(o => o.i);
                     return sortedIndices.includes(idx);
                  })
                  .map((t) => (
                  <motion.div
                    key={`out-${t.id}`}
                    layoutId={`token-${t.id}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="w-4 h-4 rounded bg-green-500"
                  />
                ))}
              </AnimatePresence>
            </div>
            
            <p className="mt-6 text-sm font-bold text-primary-800">Selected Evidence</p>
            <p className="text-xs text-primary-600 mt-1">
              <span className="font-bold">{Math.round((1 - budget/TOTAL_TOKENS)*100)}%</span> Compression
            </p>
            <div className="mt-2 flex items-center text-xs text-slate-500">
              <Clock className="w-3 h-3 mr-1" /> Order Preserved
            </div>
          </div>

        </div>
        
        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
               <Filter className="text-blue-600 w-5 h-5" />
             </div>
             <h4 className="font-bold text-slate-900 mb-2">Cross-Attention Scoring</h4>
             <p className="text-sm text-slate-600">Scores visual tokens based on their semantic relevance to the text query using Qwen2.5-style attention.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
               <Brain className="text-purple-600 w-5 h-5" />
             </div>
             <h4 className="font-bold text-slate-900 mb-2">Adaptive Budget</h4>
             <p className="text-sm text-slate-600">Dynamically predicts retention fraction ($\rho$) based on query complexity and visual relevance entropy.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
               <Clock className="text-green-600 w-5 h-5" />
             </div>
             <h4 className="font-bold text-slate-900 mb-2">Temporal Re-encoding</h4>
             <p className="text-sm text-slate-600">A lightweight re-encoder preserves temporal order using absolute time info, ensuring global coverage.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractivePipeline;