import React from 'react';

const Abstract: React.FC = () => {
  return (
    <section className="py-12 bg-white px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Abstract</h3>
        <p className="text-lg text-slate-700 leading-relaxed text-justify">
          Despite the recent advances in the video understanding ability of multimodal large language models (MLLMs),
          <span className="font-semibold text-slate-900"> long video understanding remains a challenge</span>. 
          One of the main issues is that the number of vision tokens grows linearly with video length, which causes an explosion 
          in attention cost, memory, and latency. To solve this challenge, we present 
          <span className="font-bold text-primary-600"> Query-aware Token Selector (QTSplus)</span>, 
          a lightweight yet powerful visual token selection module that serves as an information gate between the vision encoder and LLMs. 
        </p>
        <p className="text-lg text-slate-700 leading-relaxed mt-4 text-justify">
          Given a text query and video tokens, QTSplus dynamically selects the most important visual evidence for the input text query by 
          (i) scoring visual tokens via cross-attention, (ii) predicting an instance-specific retention budget based on the complexity of the query, 
          and (iii) selecting Top-n tokens. Furthermore, a small re-encoder preserves temporal order using absolute time information. 
          Integrated into Qwen2.5-VL, <span className="bg-green-100 px-1 rounded">QTSplus compresses the vision stream by up to 89%</span> and reduces end-to-end latency by 28% on long videos.
        </p>
      </div>
    </section>
  );
};

export default Abstract;