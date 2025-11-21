import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { motion } from 'framer-motion';

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
const ablationData = [
  { task: 'TC: Order', UNIF: 58.61, nREENC: 61.26, QTS3B: 67.88 },
  { task: 'TC: Attribute', UNIF: 57.99, nREENC: 60.76, 	67.01: 67.01 },
  { task: 'MB: Character', UNIF: 56.00, nREENC: 68.50, QTS3B: 71.50 },
  { task: 'MB: Counterfactual', UNIF: 56.50, nREENC: 67.00, QTS3B: 74.00 },
  { task: 'MB: Fine-Grained', UNIF: 50.50, nREENC: 54.50, QTS3B: 60.00 },
];

const MetricsCharts: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'efficiency' | 'accuracy' | 'ablation'>('accuracy');

  return (
    <section className="py-20 bg-white" id="results">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Experimental Results</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Evaluation on eight long-video understanding benchmarks demonstrates that QTSplus achieves massive compression with near-parity or improved accuracy.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex">
             {['efficiency', 'accuracy', 'ablation'].map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab as any)}
                 className={`px-6 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                   activeTab === tab 
                     ? 'bg-white text-slate-900 shadow-sm' 
                     : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 {tab}
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
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h4 className="text-lg font-bold text-slate-900 mb-2 text-center">Visual Token Scaling</h4>
                <p className="text-sm text-slate-500 text-center mb-6">Number of visual embeddings vs Input Video Frames</p>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scalingData} margin={{top: 20, right: 30, left: 0, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="frames" label={{ value: 'Frames', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(val) => `${val/1000}k`} />
                      <Tooltip contentStyle={{ borderRadius: '8px' }} formatter={(val: number) => val.toLocaleString()} />
                      <Legend verticalAlign="top" />
                      <Line type="monotone" dataKey="baseline" name="Baseline Qwen2.5-VL" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="ours" name="QTSplus (Ours)" stroke="#22c55e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 8}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
               </div>
               
               <div className="flex flex-col justify-center space-y-6">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h4 className="text-xl font-bold text-blue-900 mb-2">-89% Token Reduction</h4>
                    <p className="text-blue-800 text-sm">
                      The number of visual embeddings drops from ~180k to ~20k at 600 frames. The slope of growth is drastically reduced, enabling processing of hour-long videos.
                    </p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                    <h4 className="text-xl font-bold text-orange-900 mb-2">28% Latency Reduction</h4>
                    <p className="text-orange-800 text-sm">
                      Wall-clock inference time on a single A100 GPU drops from ~83s to ~60s for long inputs, validating the efficiency for real-world deployment.
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
              <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                 <h4 className="text-lg font-bold text-slate-900 mb-6 text-center">General Long-Video Benchmarks</h4>
                 <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={generalBenchmarks} barSize={40}>
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
              </div>

              {/* TempCompass Radar/Bar */}
              <div className="lg:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                 <h4 className="text-lg font-bold text-slate-900 mb-2 text-center">TempCompass: Fine-Grained Temporal Reasoning</h4>
                 <p className="text-xs text-center text-slate-500 mb-6">QTSplus significantly outperforms baseline on "Direction" (+20.5) and "Order" (+5.6)</p>
                 <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={tempCompassData} layout="vertical" margin={{left: 20}}>
                       <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                       <XAxis type="number" domain={[0, 100]} />
                       <YAxis dataKey="task" type="category" width={80} tick={{fontSize: 12, fontWeight: 600}} />
                       <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '8px' }} />
                       <Legend />
                       <Bar dataKey="Baseline" fill="#94a3b8" radius={[0, 4, 4, 0]} barSize={15} />
                       <Bar dataKey="QTSplus" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={15}>
                         {tempCompassData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.task === 'Direction' || entry.task === 'Order' ? '#8b5cf6' : '#22c55e'} />
                         ))}
                       </Bar>
                     </BarChart>
                   </ResponsiveContainer>
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
              <div className="text-center max-w-3xl mx-auto mb-8">
                <p className="text-slate-600">
                  We compare the full <strong>QTSplus</strong> model against <strong>UNIF</strong> (Uniform Sampling) and <strong>nREENC</strong> (QTSplus without Re-encoding).
                  The results confirm that both query-aware selection and temporal re-encoding are critical.
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ablationData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="task" tick={{fontSize: 12}} />
                    <YAxis domain={[40, 80]} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="UNIF" name="Uniform Sampling" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nREENC" name="No Re-encoder" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="QTS3B" name="Full QTSplus" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
                <div className="p-4 bg-slate-100 rounded-lg">
                   <span className="font-bold block text-slate-900 mb-1">Uniform Sampling (UNIF)</span>
                   Wastes budget on irrelevant frames; performs worst.
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-orange-900">
                   <span className="font-bold block mb-1">No Re-encoder (nREENC)</span>
                   Selects good tokens but loses temporal order; struggles with "Order" and "Action".
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-green-900">
                   <span className="font-bold block mb-1">Full QTSplus</span>
                   Restores temporal coherence via re-encoding; best performance on all metrics.
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
