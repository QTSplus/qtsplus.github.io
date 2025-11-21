import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Data approximated from Figure 4
const scalingData = [
  { frames: 100, baseline: 28000, ours: 3500 },
  { frames: 200, baseline: 56000, ours: 7000 },
  { frames: 300, baseline: 84000, ours: 10000 },
  { frames: 400, baseline: 112000, ours: 13000 },
  { frames: 500, baseline: 140000, ours: 16000 },
  { frames: 600, baseline: 168000, ours: 19000 },
];

const latencyData = [
  { frames: 100, baseline: 12, ours: 10 },
  { frames: 200, baseline: 25, ours: 22 },
  { frames: 300, baseline: 40, ours: 32 },
  { frames: 400, baseline: 55, ours: 42 },
  { frames: 500, baseline: 70, ours: 51 },
  { frames: 600, baseline: 85, ours: 60 },
];

const accuracyData = [
  { name: 'Video-MME', Baseline: 57.81, QTSplus: 57.07, diff: -0.74 },
  { name: 'LVBench', Baseline: 39.44, QTSplus: 37.90, diff: -1.54 },
  { name: 'MLVU-Test', Baseline: 31.78, QTSplus: 27.37, diff: -4.41 },
  { name: 'TempCompass (Dir)', Baseline: 43.58, QTSplus: 64.07, diff: 20.49 },
  { name: 'TempCompass (Order)', Baseline: 63.91, QTSplus: 69.54, diff: 5.63 },
];

const MetricsCharts: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-slate-900 mb-2 text-center">Performance & Efficiency</h3>
        <p className="text-center text-slate-600 mb-12">Drastic reduction in compute with competitive accuracy.</p>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Chart 1: Embeddings Scale */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h4 className="text-lg font-semibold mb-4 text-slate-800">Visual Embeddings vs Video Length</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scalingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="frames" label={{ value: 'Frames', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(val) => `${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Line type="monotone" dataKey="baseline" name="Baseline Qwen2.5-VL" stroke="#94a3b8" strokeWidth={2} dot={{r: 4}} />
                  <Line type="monotone" dataKey="ours" name="QTSplus" stroke="#22c55e" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              QTSplus reduces embeddings by ~89% (linear scaling with extremely low slope).
            </p>
          </div>

          {/* Chart 2: Latency */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
            <h4 className="text-lg font-semibold mb-4 text-slate-800">End-to-End Latency (seconds)</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="frames" label={{ value: 'Frames', position: 'insideBottom', offset: -5 }} />
                  <YAxis />
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#94a3b8" strokeWidth={2} dot={{r: 4}} />
                  <Line type="monotone" dataKey="ours" name="QTSplus" stroke="#f97316" strokeWidth={3} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Reduces inference latency by ~28% on long videos on a single A100.
            </p>
          </div>
        </div>

        {/* Accuracy Bar Chart */}
        <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
            <h4 className="text-lg font-semibold mb-6 text-slate-800 text-center">Benchmark Accuracy Comparison</h4>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} />
                  <YAxis domain={[0, 80]} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="Baseline" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="QTSplus" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
             <p className="text-sm text-slate-600 mt-4 text-center max-w-3xl mx-auto">
               QTSplus achieves near-parity on general benchmarks while significantly outperforming on temporal reasoning tasks like <span className="font-mono font-semibold">TempCompass</span> (+20.5 pts on Direction).
            </p>
        </div>
      </div>
    </section>
  );
};

export default MetricsCharts;