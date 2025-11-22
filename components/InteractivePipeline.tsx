
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Target,
  Cpu,
  Database,
  Filter,
  PlayCircle,
  FileText,
  ArrowRight,
  Settings,
  CheckCircle2,
  XCircle,
  Sigma
} from 'lucide-react';
import MathJax from './MathJax';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

// --- Types & Constants ---

type PipelineView = 'architecture' | 'data';
type QueryType = 'local' | 'global';

const InteractivePipeline: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].pipeline;

  const [view, setView] = useState<PipelineView>('architecture');
  const [queryType, setQueryType] = useState<QueryType>('local');

  // Simulation State
  const [rho, setRho] = useState(0.15);
  const [tokens, setTokens] = useState<{id: number, val: number, kept: boolean}[]>([]);

  // Simulate Budget Head logic
  useEffect(() => {
    // Local query: "What is the man holding?" -> High peak relevance, low entropy -> Low budget (focus on specific object)
    // Global query: "Summarize the event." -> Low peak relevance, high entropy -> High budget (need context)
    
    const targetRho = queryType === 'local' ? 0.18 : 0.55;
    setRho(targetRho);

    const numTokens = 40;
    const newTokens = Array.from({ length: numTokens }).map((_, i) => {
      let val = 0;
      if (queryType === 'local') {
        // Sharp peak around index 15
        const dist = Math.abs(i - 15);
        val = Math.exp(-dist * 0.5); 
        val += Math.random() * 0.2; // Noise
      } else {
        // Diffuse distribution
        val = 0.3 + Math.random() * 0.5;
      }
      return { id: i, val: Math.min(1, Math.max(0, val)), kept: false };
    });

    // Simulate Top-k selection
    const k = Math.ceil(numTokens * targetRho);
    const sorted = [...newTokens].sort((a, b) => b.val - a.val);
    const threshold = sorted[k - 1]?.val || 0;
    
    const finalTokens = newTokens.map(t => ({
      ...t,
      kept: t.val >= threshold
    }));

    setTokens(finalTokens);

  }, [queryType]);

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200 overflow-hidden" id="method">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {t.sectionTitle}
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            <span className="font-bold text-primary-600">QTSplus</span> {t.sectionDescription}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex gap-2">
            <button
              onClick={() => setView('architecture')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                view === 'architecture'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              {t.archButton}
            </button>
            <button
              onClick={() => setView('data')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                view === 'data'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <Database className="w-4 h-4" />
              {t.dataButton}
            </button>
          </div>
        </div>

        {/* --- VIEW 1: ARCHITECTURE (FIGURE 1) --- */}
        <AnimatePresence mode="wait">
          {view === 'architecture' && (
            <motion.div
              key="arch"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-xl p-2 md:p-8 overflow-x-auto"
            >
              {/* Simulation Controls */}
              <div className="mb-8 flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Settings className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{t.simulationTitle}</h4>
                    <p className="text-xs text-slate-500">{t.simulationDescription}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 sm:mt-0">
                  <button
                    onClick={() => setQueryType('local')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                      queryType === 'local'
                        ? 'bg-primary-50 border-primary-200 text-primary-700 ring-2 ring-primary-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {t.localQuery} <span className="font-normal opacity-75 block text-[10px]">{t.localQueryExample}</span>
                  </button>
                  <button
                    onClick={() => setQueryType('global')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                      queryType === 'global'
                        ? 'bg-purple-50 border-purple-200 text-purple-700 ring-2 ring-purple-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {t.globalQuery} <span className="font-normal opacity-75 block text-[10px]">{t.globalQueryExample}</span>
                  </button>
                </div>
              </div>

              {/* DIAGRAM CONTAINER */}
              <div className="relative min-w-[1000px] flex justify-between items-stretch gap-8 py-10">
                
                {/* 1. INPUTS */}
                <div className="flex flex-col gap-12 w-48 shrink-0 z-10">
                  <div className="relative bg-slate-100 rounded-2xl p-4 border border-slate-200 shadow-sm group">
                     <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                       <ArrowRight className="text-slate-300" />
                     </div>
                     <div className="flex items-center gap-3 mb-2">
                       <FileText className="w-5 h-5 text-slate-700" />
                       <span className="font-bold text-slate-700">{t.textQuery}</span>
                     </div>
                     <div className="text-xs bg-white p-2 rounded border border-slate-200 font-mono text-slate-600 h-16 flex items-center">
                       {queryType === 'local' ? (language === 'zh' ? '"他拿着什么？"' : '"What is the man holding?"') : (language === 'zh' ? '"总结这些事件。"' : '"Summarize the events."')}
                     </div>
                  </div>

                  <div className="relative bg-slate-100 rounded-2xl p-4 border border-slate-200 shadow-sm group">
                     <div className="absolute -right-8 top-1/2 -translate-y-1/2">
                       <ArrowRight className="text-slate-300" />
                     </div>
                     <div className="flex items-center gap-3 mb-2">
                       <PlayCircle className="w-5 h-5 text-slate-700" />
                       <span className="font-bold text-slate-700">{t.videoInput}</span>
                     </div>
                     <div className="flex -space-x-2 overflow-hidden h-16 items-center px-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-8 h-10 bg-slate-300 rounded border border-white shadow-sm shrink-0" />
                        ))}
                     </div>
                  </div>
                </div>

                {/* 2. PRE-PROCESSING (FROZEN) */}
                <div className="w-48 shrink-0 flex flex-col justify-center gap-4 z-10">
                  <div className="bg-white rounded-xl border border-slate-300 p-4 text-center shadow-sm relative">
                    <div className="absolute -inset-1 bg-slate-100 -z-10 rounded-xl blur-sm"></div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">{t.frozen}</div>
                    <div className="font-bold text-slate-800">{t.tokenizerEmbed}</div>
                  </div>
                  <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-xl border border-green-200 p-4 text-center shadow-sm relative">
                     <div className="font-bold text-green-800">{t.visionEncoder}</div>
                     <div className="text-[10px] text-green-600 mt-1 font-mono">Qwen2.5-VL ViT</div>
                  </div>
                </div>

                {/* 3. QTSplus MODULE (THE CORE) */}
                <div className="flex-1 bg-green-50/50 rounded-[2rem] border-2 border-green-500/30 p-6 relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg z-20">
                    {t.qtsModule}
                  </div>

                  {/* Grid Layout for QTSplus Internals */}
                  <div className="grid grid-cols-2 gap-6 h-full">

                    {/* Cross Attention */}
                    <div className="col-span-2 bg-white rounded-xl border border-green-200 p-4 shadow-sm relative">
                       <div className="flex justify-between items-center mb-2">
                         <h5 className="font-bold text-green-900 text-sm">{t.crossAttentionScoring}</h5>
                         <span className="font-mono text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">
                           <MathJax inline className="inline-block">
                             {String.raw`$r_i \;=\; \max_{h,\;\ell} \; \alpha_{h,\ell,i} \;\in [0,1]$`}
                           </MathJax>
                         </span>
                       </div>
                       {/* Heatmap visualization */}
                       <div className="flex gap-0.5 h-6 w-full bg-slate-100 rounded overflow-hidden">
                         {tokens.map((t) => (
                           <motion.div
                             key={t.id}
                             animate={{ 
                               backgroundColor: `rgba(22, 163, 74, ${t.val})`, // green-600
                               height: `${t.val * 100}%`,
                               marginTop: `${(1 - t.val) * 24}px`
                             }}
                             className="flex-1"
                           />
                         ))}
                       </div>
                    </div>

                    {/* Budget Head */}
                    <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/10 rounded-bl-full"></div>
                       <div>
                         <h5 className="font-bold text-green-900 text-sm mb-3">{t.adaptiveBudgetHead}</h5>

                         {/* Inputs Visualization */}
                         <div className="grid grid-cols-1 min-[1366px]:grid-cols-2 gap-2 text-[10px] font-mono text-slate-500 mb-3">
                           <div className="bg-slate-50 p-2.5 rounded border flex justify-between items-center">
                             <MathJax inline>{String.raw`$s_q$`}</MathJax>
                             <span className={queryType === 'local' ? 'text-green-600 font-bold' : 'text-blue-600 font-bold'}>
                               {queryType === 'local' ? t.specific : t.general}
                             </span>
                           </div>
                           <div className="bg-slate-50 p-2.5 rounded border flex justify-between items-center">
                             <MathJax inline>{String.raw`$\log M$`}</MathJax>
                             <span>3.68</span>
                           </div>
                           <div className="bg-slate-50 p-2.5 rounded border flex justify-between items-center">
                             <MathJax inline>{String.raw`$r_{\text{max}}$`}</MathJax>
                             <span className={queryType === 'local' ? 'text-green-600 font-bold' : 'text-red-400'}>
                               {queryType === 'local' ? '0.98' : '0.45'}
                             </span>
                           </div>
                           <div className="bg-slate-50 p-2.5 rounded border flex justify-between items-center">
                             <MathJax inline>{String.raw`$H(p)$`}</MathJax>
                             <span className={queryType === 'global' ? 'text-blue-600 font-bold' : 'text-slate-600'}>
                               {queryType === 'global' ? 'High' : 'Low'}
                             </span>
                           </div>
                         </div>
                       </div>

                       <div className="bg-slate-900 text-white p-2 rounded-lg text-center">
                         <div className="text-[10px] tracking-widest text-slate-400">
                           Predicted <MathJax inline className="inline">{String.raw`$\rho$`}</MathJax>
                         </div>
                         <div className="text-xl font-mono font-bold text-yellow-400">
                           {rho.toFixed(2)}
                         </div>
                       </div>
                    </div>

                    {/* Top-K Gate */}
                    <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm flex flex-col justify-between">
                       <h5 className="font-bold text-green-900 text-sm">{t.topNGate}</h5>
                       <div className="text-xs text-slate-600 mb-2">
                         Target <MathJax inline key={rho}>{`$n = ${Math.ceil(40 * rho)}$`}</MathJax>
                       </div>
                       <div className="flex flex-wrap gap-1 content-start h-24 overflow-y-auto p-1 bg-slate-50 rounded border border-slate-100">
                          {tokens.map((token) => (
                            <motion.div
                              key={token.id}
                              animate={{
                                opacity: token.kept ? 1 : 0.2,
                                scale: token.kept ? 1 : 0.8,
                              }}
                              className={`w-2 h-2 rounded-full ${token.kept ? 'bg-green-600' : 'bg-slate-300'}`}
                            />
                          ))}
                       </div>
                       <div className="text-[10px] text-slate-400 text-center mt-1">
                         {t.selectingTokens}
                       </div>
                    </div>

                    {/* Re-encoding */}
                    <div className="col-span-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 shadow-md text-white relative overflow-hidden">
                       <div className="relative z-10 flex items-center justify-between">
                          <div>
                             <h5 className="font-bold text-sm">{t.lightweightReencoding}</h5>
                             <p className="text-[10px] text-green-100 opacity-90">
                               {t.reencodeDescription}
                             </p>
                          </div>
                          <div className="bg-white/20 p-2 rounded-lg font-mono text-xs">
                            <MathJax inline>
                              {String.raw`$\mathcal{X}' \leftarrow Z + \text{Pos}$`}
                            </MathJax>
                          </div>
                       </div>
                       {/* Decorative background lines */}
                       <div className="absolute inset-0 opacity-20">
                         <svg width="100%" height="100%">
                           <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                             <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                           </pattern>
                           <rect width="100%" height="100%" fill="url(#grid)" />
                         </svg>
                       </div>
                    </div>

                  </div>
                </div>

                {/* 4. LLM Output */}
                <div className="w-40 shrink-0 flex flex-col justify-center items-center gap-4 z-10">
                   <div className="w-full aspect-square bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                      <ArrowRight size={32} />
                   </div>
                   <div className="bg-slate-800 text-white p-4 rounded-xl w-full shadow-lg border-t-4 border-primary-500">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">{t.llmOutput}</div>
                      <div className="text-sm font-medium">
                        {queryType === 'local' ? (language === 'zh' ? '"一杯啤酒。"' : '"A glass of beer."') : (language === 'zh' ? '"一个男人在酒吧喝啤酒..."' : '"A man drinking beer at a bar..."')}
                      </div>
                   </div>
                </div>

                {/* Connection Lines (SVG Overlay) */}
                <svg className="absolute inset-0 pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
                  {/* Simple Bezier curves to show flow could go here, but strict layout makes simple CSS arrows easier or visual proximity */}
                </svg>

              </div>
            </motion.div>
          )}

          {/* --- VIEW 2: DATA PIPELINE (FIGURE 3) --- */}
          {view === 'data' && (
            <motion.div
              key="data"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                
                {/* Step 1: Source */}
                <div className="md:col-span-1 flex flex-col gap-4">
                   <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 text-center relative">
                      <Database className="mx-auto text-slate-400 mb-2" />
                      <h4 className="font-bold text-slate-800 text-sm">{t.sourceDataset}</h4>
                      <p className="text-xs text-slate-500">{t.sourceDescription}</p>
                      <div className="absolute -right-3 top-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center z-10">
                        <ArrowRight size={14} className="text-slate-400" />
                      </div>
                   </div>
                </div>

                {/* Step 2: Synthesis (Teacher 1) */}
                <div className="md:col-span-2 flex flex-col gap-4">
                   <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 relative">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="text-blue-600 w-5 h-5" />
                        <h4 className="font-bold text-blue-900 text-sm">{t.textTeacher}</h4>
                      </div>
                      <p className="text-xs text-blue-800 mb-3 leading-relaxed">
                        {t.textTeacherDescription}
                      </p>
                      <div className="bg-white p-2 rounded border border-blue-100 text-[10px] font-mono text-slate-600">
                        {t.textTeacherOutput}
                      </div>

                      {/* Arrow */}
                      <div className="absolute -right-3 top-1/2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center z-10">
                        <ArrowRight size={14} className="text-slate-400" />
                      </div>
                   </div>
                </div>

                {/* Step 3: Verification (Teacher 2) */}
                <div className="md:col-span-2 flex flex-col gap-4">
                   <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 relative">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="text-indigo-600 w-5 h-5" />
                        <h4 className="font-bold text-indigo-900 text-sm">{t.visionTeacher}</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <Filter className="w-3 h-3 mt-1 text-indigo-400" />
                          <p className="text-xs text-indigo-800">
                            <span className="font-bold">{t.filteringTitle}</span> {t.filteringDescription}
                            <br/><span className="opacity-75">{t.filteringResult}</span>
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Sigma className="w-3 h-3 mt-1 text-indigo-400" />
                          <p className="text-xs text-indigo-800">
                            <span className="font-bold">{t.generationTitle}</span> {t.generationDescription}
                            <br/><span className="opacity-75">{t.generationResult}</span>
                          </p>
                        </div>
                      </div>
                   </div>
                </div>

              </div>

              {/* Distillation Explanation */}
              <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-8 items-center">
                 <div className="flex-1">
                   <h4 className="font-bold text-slate-900 mb-2">{t.trainingTitle}</h4>
                   <p className="text-sm text-slate-600 leading-relaxed">
                     {t.trainingDescription}
                     <br/>
                     1. <strong>{t.vscqLoss}</strong> {t.vscqLossDescription}
                     <br/>
                     2. <strong>{t.vqaLoss}</strong> {t.vqaLossDescription}
                   </p>
                 </div>
                 <div className="flex gap-4">
                   <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                     <div className="text-2xl font-bold text-slate-900">VSCQ</div>
                     <div className="text-[10px] uppercase text-slate-500">{t.classification}</div>
                   </div>
                   <div className="text-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                     <div className="text-2xl font-bold text-slate-900">VQA</div>
                     <div className="text-[10px] uppercase text-slate-500">{t.generation}</div>
                   </div>
                 </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default InteractivePipeline;
