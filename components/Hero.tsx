import React from 'react';
import { Author, Affiliation } from '../types';
import { FileText, Github, Database, MonitorPlay, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

const authors: Author[] = [
  { name: "Siyou Li", affiliation: [1] },
  { name: "Huanan Wu", affiliation: [2], isCorresponding: true, email: "hwu110@sheffield.ac.uk" },
  { name: "Juexi Shao", affiliation: [1] },
  { name: "Yinghao Ma", affiliation: [1] },
  { name: "Yujian Gan", affiliation: [1] },
  { name: "Yihao Luo", affiliation: [3] },
  { name: "Yuwei Wang", affiliation: [4] },
  { name: "Dong Nie", affiliation: [5] },
  { name: "Lu Wang", affiliation: [6] },
  { name: "Wengqing Wu", affiliation: [1, 7] },
  { name: "Le Zhang", affiliation: [1, 8] },
  { name: "Massimo Poesio", affiliation: [1, 9] },
  { name: "Juntao Yu", affiliation: [1], email: "juntao.yu@qmul.ac.uk" },
];

const affiliations: Affiliation[] = [
  { id: 1, name: "Queen Mary University of London" },
  { id: 2, name: "University of Sheffield" },
  { id: 3, name: "Imperial College London" },
  { id: 4, name: "Pengcheng Laboratory" },
  { id: 5, name: "Meta Inc" },
  { id: 6, name: "Meituan Inc" },
  { id: 7, name: "Nanjing University of Science" },
  { id: 8, name: "University of Birmingham" },
  { id: 9, name: "Utrecht University" },
];

const Hero: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const t = translations[language].hero;

  return (
    <header className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-green-400 to-primary-600" />

       {/* Language Toggle Button */}
       <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
         <div className="flex gap-2 bg-white rounded-full p-1 shadow-md border border-slate-200">
           <button
             onClick={() => setLanguage('en')}
             className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
               language === 'en'
                 ? 'bg-primary-600 text-white shadow-sm'
                 : 'text-slate-600 hover:bg-slate-50'
             }`}
           >
             <Globe className="w-3 h-3" />
             EN
           </button>
           <button
             onClick={() => setLanguage('zh')}
             className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
               language === 'zh'
                 ? 'bg-primary-600 text-white shadow-sm'
                 : 'text-slate-600 hover:bg-slate-50'
             }`}
           >
             <Globe className="w-3 h-3" />
             中文
           </button>
         </div>
       </div>
       
       <div className="max-w-5xl mx-auto text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              Seeing the Forest <span className="text-primary-600">and</span> the Trees
            </h1>
            <h2 className="text-xl sm:text-2xl text-slate-600 font-medium mb-8">
              Query-Aware Tokenizer for Long-Video Multimodal Language Models
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-700 mb-8 max-w-4xl mx-auto"
          >
            {authors.map((author, idx) => (
              <span key={idx} className="inline-flex items-center">
                <span className={author.isCorresponding ? "font-semibold text-primary-700" : ""}>
                  {author.name}
                  <sup className="ml-0.5 text-xs text-slate-500">
                    {author.affiliation.join(',')}
                  </sup>
                </span>
                {idx < authors.length - 1 && <span className="mx-2 text-slate-300">|</span>}
              </span>
            ))}
          </motion.div>

          <div className="hidden sm:flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-slate-500 mb-10 max-w-4xl mx-auto">
             {affiliations.map((aff) => (
                <span key={aff.id} className="whitespace-nowrap">
                  <sup>{aff.id}</sup>{aff.name}
                </span>
             ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a href="#" className="inline-flex items-center px-5 py-2.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-700 transition-colors">
              <FileText className="w-4 h-4 mr-2" />
              {t.paper}
            </a>
            <a href="https://github.com/Siyou-Li/QTSplus" className="inline-flex items-center px-5 py-2.5 rounded-full bg-slate-100 text-slate-900 font-medium border border-slate-200 hover:bg-slate-200 transition-colors">
              <Github className="w-4 h-4 mr-2" />
              {t.code}
            </a>
            <a href="https://github.com/vincentha766/QTSplus-Dataset" className="inline-flex items-center px-5 py-2.5 rounded-full bg-slate-100 text-slate-900 font-medium border border-slate-200 hover:bg-slate-200 transition-colors">
              <Database className="w-4 h-4 mr-2" />
              {t.dataset}
            </a>
            <a href="https://huggingface.co/collections/AlpachinoNLP/qtsplus" className="inline-flex items-center px-5 py-2.5 rounded-full bg-yellow-50 text-yellow-700 font-medium border border-yellow-200 hover:bg-yellow-100 transition-colors">
              <span className="mr-2">🤗</span>
              {t.huggingFace}
            </a>
          </motion.div>
       </div>
    </header>
  );
};

export default Hero;