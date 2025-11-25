import React from 'react';
import { motion } from 'framer-motion';
import { Author, Affiliation } from '../types';

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
  { name: "Wenqing Wu", affiliation: [1, 7] },
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

const AuthorsAffiliations: React.FC = () => {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      <div className="max-w-4xl mx-auto py-10 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-slate-700 mb-6 sm:mb-8"
        >
          {authors.map((author, idx) => (
            <span key={author.name} className="inline-flex items-center">
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="hidden sm:flex flex-wrap justify-center gap-x-6 gap-y-1 text-xs text-slate-500"
        >
          {affiliations.map((aff) => (
            <span key={aff.id} className="whitespace-nowrap">
              <sup>{aff.id}</sup>{aff.name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AuthorsAffiliations;
