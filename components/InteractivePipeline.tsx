import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Cpu, 
  ArrowRight, 
  Activity, 
  BarChart3, 
  Layers,
  Minimize2,
  Clock
} from 'lucide-react';

// Simulation constants
const TOTAL_TOKENS = 64;
const GRID_COLS = 16;

interface Token {
  id: number;
  relevance: number;
  kept: boolean;
}

const InteractivePipeline: React.FC = () => {
  const [queryMode, setQueryMode] = useState<'local' | 'global'>('local');
  const [step, setStep] = useState<number>(0);
  const [tokens, setTokens] = useState<Token[]>([]);

  // Generate tokens based on query mode
  useEffect(() => {
    const newTokens = Array.from({ length: TOTAL_TOKENS }).map((_, i) => {
      let rel = 0;
      if (queryMode === 'local') {
        // Peak relevance around index 20-25
        const dist = Math.abs(i - 22);
        rel = Math.max(0.05, Math.exp(-dist * 0.3));
        // Add some noise
        rel += (Math.random() - 0.5) * 0.1;
      } else {
        // Global query: distributed relevance
        rel = 0.3 + Math.random() * 0.4;
      }
      return { 
        id: i, 
        relevance: Math.min(1, Math.max(0, rel)),
        kept: false 
      };
    });
    setTokens(newTokens);
  }, [queryMode]);

  // Dynamic stats based on simulation
  const budgetRho = queryMode === 'local' ? 0.15 : 0.45;
  const keptCount = Math.ceil(TOTAL_TOKENS * budgetRho);
  
  // Update "kept" status based on current budget
  useEffect(() => {
    const sortedIndices = [...tokens]
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, keptCount)
      .map(t => t.id);
    
    setTokens(prev => prev.map(t => ({
      ...t,
      kept: sortedIndices.includes(t.id)
    })));
  }, [budgetRho, tokens.length]); // simplistic dependency for demo

  const steps = [
    { 
      title: "1. Vision Encoding & Tokenization", 
      desc: "The long video input is processed by a frozen Vision Transformer (ViT), producing a dense sequence of visual tokens.",
      math: "X \\in \\mathbb{R}^{M \\times d}"
    },
    { 
      title: "2. Cross-Attention Scoring", 
      desc: "Tokens are scored against the text query using multi-head cross-attention. High relevance implies the token contains task-critical evidence.",
      math: "r = \\max_{h,L} \\alpha \\in [0, 1]^M"
    },
    { 
      title: "3. Adaptive Budget Prediction", 
      desc: "The Budget Head estimates an optimal retention fraction based on query complexity, entropy, and video length.",
      math: "\\rho = B_\\psi(s_q, \\log M, r_{max}, H(p))"
    },
    { 
      title: "4. Top-n Selection (Gating)", 
      desc: "Tokens are filtered using a differentiable Gumbel-Softmax gate during training and a hard Top-n gate at inference.",
      math: "n = \\min(\\lceil \\rho M \\rceil, n_{max})"
    },
    { 
      title: "5. Lightweight Re-encoding", 
      desc: "Selected tokens are re-encoded with absolute time information to preserve temporal order and coverage.",
      math: "X' = \\text{ReEnc}(Z + \\text{Pos})"
    }
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Architectural Deep Dive: Inside QTSplus
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            An interactive visualization of the <span className="font-mono font-bold text-primary-700">Query-Aware Token Selector</span> pipeline.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex">
            <button
              onClick={() => setQueryMode('local')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                queryMode === 'local' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Target className="w-4 h-4" />
              Localized Query
              <span className="hidden sm:inline text-xs opacity-60 ml-1">(e.g. "Find the red car")</span>
            </button>
            <button
              onClick={() => setQueryMode('global')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                queryMode === 'global' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Activity className="w-4 h-4" />
              Global Query
              <span className="hidden sm:inline text-xs opacity-60 ml-1">(e.g. "Summarize video")</span>
            </button>
          </div>
        </div>

        {/* Main Visualization Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar: Steps Navigation */}
          <div className="lg:col-span-3 space-y-2">
            {steps.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  step === idx 
                    ? 'bg-white border-primary-500 shadow-md ring-1 ring-primary-100' 
                    : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'
                }`}
              >
                <div className={`text-xs font-bold uppercase mb-1 ${step === idx ? 'text-primary-600' : 'text-slate-400'}`}>
                  Stage 0{idx + 1}
                </div>
                <div className={`font-semibold ${step === idx ? 'text-slate-900' : 'text-slate-500'}`}>
                  {s.title.split('. ')[1]}
                </div>
              </button>
            ))}
          </div>

          {/* Center: Interactive Canvas */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative min-h-[500px] flex flex-col">
              
              {/* Header / Math Context */}
              <div className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center border-b border-slate-800">
                 <div>
                   <h3 className="font-bold text-lg">{steps[step].title}</h3>
                   <p className="text-slate-400 text-sm mt-1">{steps[step].desc}</p>
                 </div>
                 <div className="hidden md:block font-mono text-primary-400 text-sm bg-slate-800 px-3 py-1.5 rounded border border-slate-700">
                   {steps[step].math}
                 </div>
              </div>

              {/* Visualization Area */}
              <div className="flex-1 p-8 relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50/50">
                
                {/* VISUALIZATION LOGIC BASED ON STEP */}
                <AnimatePresence mode="wait">
                  
                  {step === 0 && (
                    <motion.div 
                      key="step0"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <div className="grid grid-cols-8 gap-2 mb-6">
                         {tokens.map((t) => (
                           <motion.div 
                             key={t.id}
                             initial={{ scale: 0 }}
                             animate={{ scale: 1 }}
                             transition={{ delay: t.id * 0.005 }}
                             className="w-8 h-8 bg-slate-300 rounded-md border border-slate-400/30"
                           />
                         ))}
                      </div>
                      <div className="flex items-center gap-4 text-slate-500 mt-4 font-mono text-sm">
                        <Layers className="w-5 h-5" />
                        <span>M = {TOTAL_TOKENS} dense visual tokens</span>
                      </div>
                    </motion.div>
                  )}

                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg border border-primary-100 flex items-center gap-3 z-20">
                        <div className="w-3 h-3 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-sm font-medium text-slate-800">
                          Query: <span className="font-mono text-primary-600">{queryMode === 'local' ? '"Find the red car"' : '"Summarize"'}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-8 gap-2 mt-12">
                         {tokens.map((t) => (
                           <motion.div 
                             key={t.id}
                             className="w-8 h-8 rounded-md border border-slate-400/30 relative overflow-hidden transition-colors duration-500"
                             animate={{ 
                               backgroundColor: `rgba(34, 197, 94, ${t.relevance})`, // Green opacity based on relevance
                               scale: t.relevance > 0.6 ? 1.1 : 1
                             }}
                           >
                             <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono opacity-50">
                               {t.relevance.toFixed(1)}
                             </div>
                           </motion.div>
                         ))}
                      </div>
                      <p className="text-sm text-slate-500 mt-6 bg-white/80 px-4 py-2 rounded-lg border border-slate-200">
                        Heatmap: <span className="text-green-600 font-bold">Green</span> indicates high cross-attention score ($r_i$)
                      </p>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full gap-8"
                    >
                       <div className="flex flex-wrap justify-center gap-4">
                          {/* Inputs to Budget Head */}
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-40">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-2">Entropy H(p)</div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-blue-500" 
                                animate={{ width: queryMode === 'global' ? '80%' : '20%' }} 
                              />
                            </div>
                            <div className="text-right text-xs font-mono mt-1 text-blue-600">
                              {queryMode === 'global' ? 'High' : 'Low'}
                            </div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm w-40">
                             <div className="text-xs text-slate-500 uppercase font-bold mb-2">{"Peak Rel ($r_{max}$)"}</div>
                             <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-purple-500" 
                                animate={{ width: queryMode === 'local' ? '90%' : '40%' }} 
                              />
                            </div>
                             <div className="text-right text-xs font-mono mt-1 text-purple-600">
                               {queryMode === 'local' ? 'Sharp' : 'Diffuse'}
                             </div>
                          </div>
                       </div>

                       <ArrowRight className="rotate-90 md:rotate-0 text-slate-300 w-8 h-8" />

                       <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Brain size={100} />
                          </div>
                          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Cpu className="w-5 h-5" /> Budget Head Output
                          </h4>
                          <div className="flex items-end justify-between mb-2">
                            <span className="text-slate-300 text-sm">Retention Ratio ($\rho$)</span>
                            <span className="text-2xl font-mono font-bold text-primary-400">{budgetRho.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                             <motion.div 
                               className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
                               animate={{ width: `${budgetRho * 100}%` }}
                             />
                          </div>
                          <p className="text-xs text-slate-400 mt-4">
                            Predicted tokens to keep: <span className="text-white font-bold">{keptCount}</span> / {TOTAL_TOKENS}
                          </p>
                       </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                       <div className="grid grid-cols-8 gap-2">
                         {tokens.map((t) => (
                           <motion.div 
                             key={t.id}
                             animate={{ 
                               opacity: t.kept ? 1 : 0.2,
                               scale: t.kept ? 1 : 0.8,
                               backgroundColor: t.kept ? '#22c55e' : '#94a3b8'
                             }}
                             className="w-8 h-8 rounded-md border border-slate-400/30 flex items-center justify-center"
                           >
                             {t.kept && <div className="w-2 h-2 bg-white rounded-full" />}
                           </motion.div>
                         ))}
                      </div>
                      <div className="mt-8 flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                          <div className="w-4 h-4 bg-slate-300 rounded opacity-20"></div>
                          Pruned
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          Retained ({Math.round((keptCount/TOTAL_TOKENS)*100)}%)
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div 
                      key="step4"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full"
                    >
                      <div className="flex flex-wrap gap-1 justify-center max-w-2xl">
                         <AnimatePresence>
                           {tokens.filter(t => t.kept).map((t) => (
                             <motion.div 
                               key={`reenc-${t.id}`}
                               layoutId={`token-${t.id}`}
                               initial={{ scale: 0 }}
                               animate={{ scale: 1 }}
                               className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg shadow-lg flex items-center justify-center text-white/90 font-mono text-xs border border-white/20"
                             >
                               <Clock className="w-3 h-3" />
                             </motion.div>
                           ))}
                         </AnimatePresence>
                      </div>
                      
                      <div className="mt-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-md text-center">
                         <h4 className="font-bold text-slate-900 flex items-center justify-center gap-2">
                           <Minimize2 className="w-4 h-4 text-primary-600" />
                           Compressed Stream ($X'$)
                         </h4>
                         <p className="text-sm text-slate-600 mt-2">
                           The retained tokens are re-encoded with absolute time information, preserving order for temporal reasoning while reducing memory by 
                           <span className="font-bold text-slate-900"> ~{Math.round((1 - keptCount/TOTAL_TOKENS)*100)}%</span>.
                         </p>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Step Indicator */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
                <motion.div 
                  className="h-full bg-primary-500"
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractivePipeline;