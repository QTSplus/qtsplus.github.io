import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../locales/translations';

const Abstract: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[language].abstract;

  return (
    <section className="py-12 bg-white px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">{t.title}</h3>
        <p className="text-lg text-slate-700 leading-relaxed text-justify">
          {t.content1}
          <span className="font-semibold text-slate-900"> {t.content1Bold}</span>
          {language === 'en' ? '. One of the main issues is that the number of vision tokens grows linearly with video length, which causes an explosion in attention cost, memory, and latency. To solve this challenge, we present ' : '。'}
          <span className="font-bold text-primary-600"> {t.qtsName}</span>
          {language === 'en' ? ', ' : '，'}
          {t.qtsDescription}
        </p>
        <p className="text-lg text-slate-700 leading-relaxed mt-4 text-justify">
          {t.content2}
          <span className="bg-green-100 px-1 rounded">{t.highlight}</span>
          {t.highlightEnd}
        </p>
      </div>
    </section>
  );
};

export default Abstract;