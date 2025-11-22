
import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

// --- DATA ---

// Figure 4: Efficiency Scaling
const scalingData = [
  { frames: 100, baseline: 28000, ours: 3500 },
  { frames: 200, baseline: 56000, ours: 7000 },
  { frames: 300, baseline: 84000, ours: 10000 },
  { frames: 400, baseline: 112000, ours: 13000 },
  { frames: 500, baseline: 140000, ours: 16000 },
  { frames: 600, baseline: 168000, ours: 19000 },
];

// Table 1: General Results
const generalBenchmarks = [
  { name: 'Video-MME', Baseline: 57.81, QTSplus: 57.07, fullMark: 100 },
  { name: 'LVBench', Baseline: 39.44, QTSplus: 37.90, fullMark: 100 },
  { name: 'MLVU-Test', Baseline: 31.78, QTSplus: 27.37, fullMark: 100 },
];

// Table 1: TempCompass Specifics (Where QTSplus shines)
const tempCompassData = [
  { task: 'Action', Baseline: 97.93, QTSplus: 97.04 },
  { task: 'Attribute', Baseline: 74.31, QTSplus: 69.20 },
  { task: 'Direction', Baseline: 43.58, QTSplus: 64.07 }, // HUGE GAIN
  { task: 'Order', Baseline: 63.91, QTSplus: 69.54 }, // GAIN
  { task: 'Speed', Baseline: 51.42, QTSplus: 49.27 },
];

// Table 3: Ablation Study (UNIF vs nREENC vs QTS3B)
// Corrected syntax for QTS3B key
const ablationData = [
  { task: 'TC: Order', UNIF: 58.61, nREENC: 61.26, QTS3B: 67.88 },
  { task: 'TC: Attribute', UNIF: 57.99, nREENC: 60.76, QTS3B: 67.01 },
  { task: 'MB: Character', UNIF: 56.00, nREENC: 68.50, QTS3B: 71.50 },
  { task: 'MB: Counterfact', UNIF: 56.50, nREENC: 67.00, QTS3B: 74.00 },
  { task: 'MB: Fine-Grain', UNIF: 50.50, nREENC: 54.50, QTS3B: 60.00 },
];

// New: MVBench Fine-Grained Detail
const mvBenchData = [
  { task: 'Action Seq', Baseline: 78.00, QTSplus: 69.00 },
  { task: 'Unexpected', Baseline: 79.50, QTSplus: 82.50 }, // Better
  { task: 'Object Exist', Baseline: 93.50, QTSplus: 92.00 },
  { task: 'Scene Trans', Baseline: 91.50, QTSplus: 91.00 },
  { task: 'Moving Attr', Baseline: 96.50, QTSplus: 91.50 },
];

const MetricsCharts: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].metrics;

  const [activeTab, setActiveTab] = useState<'efficiency' | 'accuracy' | 'ablation'>('accuracy');

  return (
    <section className="py-20 bg-white" id="results">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.sectionTitle}</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            {t.sectionDescription}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex">
             {(['efficiency', 'accuracy', 'ablation'] as const).map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                   activeTab === tab
                     ? 'bg-white text-slate-900 shadow-sm'
                     : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 {t[tab]}
               </button>
             ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          {/* EFFICIENCY */}
          {activeTab === 'efficiency' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-12"
            >
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="text-lg font-bold text-slate-900 mb-2 text-center">{t.tokenScalingTitle}</h4>
                <p className="text-sm text-slate-500 text-center mb-6">{t.tokenScalingDescription}</p>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scalingData} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="frames" label={{ value: t.frames, position: 'insideBottom', offset: -5, style: {fill: '#64748b'} }} />
                      <YAxis tickFormatter={(val) => `${val/1000}k`} tick={{fill: '#64748b'}} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(val: number) => val.toLocaleString()} />
                      <Legend verticalAlign="top" />
                      <Line type="monotone" dataKey="baseline" name={t.baselineLabel} stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="ours" name={t.qtsLabel} stroke="#22c55e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
               </div>

               <div className="flex flex-col justify-center space-y-6">
                  <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                    <h4 className="text-2xl font-bold text-blue-900 mb-2">{t.tokenReduction}</h4>
                    <p className="text-blue-800 text-base leading-relaxed">
                      {t.tokenReductionDescription}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-8 rounded-2xl border border-orange-100">
                    <h4 className="text-2xl font-bold text-orange-900 mb-2">{t.latencyReduction}</h4>
                    <p className="text-orange-800 text-base leading-relaxed">
                      {t.latencyReductionDescription}
                    </p>
                  </div>
               </div>
            </motion.div>
          )}

          {/* ACCURACY */}
          {activeTab === 'accuracy' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-12 gap-8"
            >
              {/* Main Benchmarks */}
              <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                 <h4 className="text-lg font-bold text-slate-900 mb-6 text-center">{t.generalBenchmarks}</h4>
                 <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={generalBenchmarks} barSize={40} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="name" tick={{fontSize: 12}} />
                       <YAxis domain={[0, 70]} />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                       <Legend />
                       <Bar dataKey="Baseline" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                       <Bar dataKey="QTSplus" fill="#22c55e" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
                 <p className="text-xs text-center text-slate-500 mt-4">
                    {t.nearParity}
                 </p>
              </div>

              {/* Fine-grained Analysis */}
              <div className="lg:col-span-7 grid grid-rows-2 gap-6">
                 {/* TempCompass */}
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center px-4 mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{t.tempCompassTitle}</h4>
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">+20.5 Direction / +5.6 Order</span>
                   </div>
                   <div className="h-40">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={tempCompassData} layout="vertical" barGap={0} barSize={10}>
                         <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                         <XAxis type="number" domain={[0, 100]} hide />
                         <YAxis dataKey="task" type="category" width={70} tick={{fontSize: 11, fontWeight: 600}} />
                         <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '8px' }} />
                         <Legend wrapperStyle={{fontSize: '11px'}} />
                         <Bar dataKey="Baseline" fill="#cbd5e1" radius={[0, 2, 2, 0]} />
                         <Bar dataKey="QTSplus" fill="#8b5cf6" radius={[0, 2, 2, 0]} />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </div>

                 {/* MVBench Subset */}
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center px-4 mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{t.mvBenchTitle}</h4>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{t.mvBenchHighlight}</span>
                   </div>
                   <div className="h-40">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={mvBenchData} barSize={20} margin={{top: 5, right: 5, left: -20, bottom: 0}}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                         <XAxis dataKey="task" tick={{fontSize: 10}} />
                         <YAxis domain={[50, 100]} tick={{fontSize: 11}} />
                         <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                         <Bar dataKey="Baseline" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                         <Bar dataKey="QTSplus" fill="#22c55e" radius={[4, 4, 0, 0]} />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </div>
              </div>
            </motion.div>
          )}

          {/* ABLATION */}
          {activeTab === 'ablation' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center max-w-3xl mx-auto mb-4">
                <p className="text-slate-600 leading-relaxed">
                  {t.ablationDescription}
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ablationData} margin={{top: 20, right: 30, left: 0, bottom: 5}} barSize={30} barGap={5}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="task" tick={{fontSize: 12, fontWeight: 600, fill: '#475569'}} />
                    <YAxis domain={[40, 80]} tick={{fill: '#64748b'}} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      cursor={{fill: 'rgba(0,0,0,0.03)'}}
                    />
                    <Legend verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}} />
                    <Bar dataKey="UNIF" name={t.uniformSamplingName} fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nREENC" name={t.noReencoderName} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="QTS3B" name={t.fullQtsName} fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-center text-sm">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                   <span className="font-bold block text-slate-900 text-lg mb-2">{t.uniformSamplingTitle}</span>
                   <p className="text-slate-500">{t.uniformSamplingDescription}</p>
                </div>
                <div className="p-5 bg-orange-50/50 rounded-xl border border-orange-200">
                   <span className="font-bold block text-orange-900 text-lg mb-2">{t.noReencoderTitle}</span>
                   <p className="text-orange-800/80">{t.noReencoderDescription}</p>
                </div>
                <div className="p-5 bg-green-50/50 rounded-xl border border-green-200">
                   <span className="font-bold block text-green-900 text-lg mb-2">{t.fullQtsTitle}</span>
                   <p className="text-green-800/80">{t.fullQtsDescription}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MetricsCharts;
