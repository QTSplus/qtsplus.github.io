import React from 'react';
import Hero from './components/Hero';
import Abstract from './components/Abstract';
import InteractivePipeline from './components/InteractivePipeline';
import MetricsCharts from './components/MetricsCharts';

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary-200 selection:text-primary-900">
      <Hero />
      <main>
        <Abstract />
        <InteractivePipeline />
        <MetricsCharts />
        
        {/* Dataset / Teaser Section */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold mb-4">Trained on 300k Video-Caption Pairs</h3>
            <p className="text-slate-300 mb-8">
              We construct long-video QA and single-choice question datasets (QTS-VSCQ, QTS-VQA) via a controlled generation pipeline 
              using Qwen3-235B and Qwen2.5-VL.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
               <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                 <div className="text-3xl font-bold text-primary-400">855k</div>
                 <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">MCQ Items</div>
               </div>
               <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                 <div className="text-3xl font-bold text-primary-400">300k</div>
                 <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Videos</div>
               </div>
               <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                 <div className="text-3xl font-bold text-primary-400">~89%</div>
                 <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Compression</div>
               </div>
               <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                 <div className="text-3xl font-bold text-primary-400">2x</div>
                 <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Efficiency</div>
               </div>
            </div>
          </div>
        </section>

        {/* Citation */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Citation</h3>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm font-mono text-xs sm:text-sm text-slate-600 overflow-x-auto">
              <pre>{`@article{li2025seeing,
  title={Seeing the Forest and the Trees: Query-Aware Tokenizer for Long-Video Multimodal Language Models},
  author={Li, Siyou and Wu, Huanan and Shao, Juexi and Ma, Yinghao and Gan, Yujian and Luo, Yihao and Wang, Yuwei and Nie, Dong and Wang, Lu and Wu, Wengqing and Zhang, Le and Poesio, Massimo and Yu, Juntao},
  journal={arXiv preprint},
  year={2025}
}`}</pre>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-white border-t border-slate-100 text-center text-slate-500 text-sm">
        <p>© 2025 QTSplus Project. Queen Mary University of London & Collaborators.</p>
      </footer>
    </div>
  );
}

export default App;