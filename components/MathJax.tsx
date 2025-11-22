import React, { useEffect, useRef } from 'react';

interface MathJaxProps {
  children: string;
  inline?: boolean;
  className?: string;
}

declare global {
  interface Window {
    MathJax: {
      typesetPromise: (elements?: HTMLElement[]) => Promise<void>;
      typeset: (elements?: HTMLElement[]) => void;
      startup: {
        promise: Promise<void>;
      };
    };
  }
}

const MathJax: React.FC<MathJaxProps> = ({ children, inline = true, className = '' }) => {
  const mathRef = useRef<HTMLSpanElement | HTMLDivElement>(null);

  useEffect(() => {
    const typesetMath = async () => {
      if (window.MathJax && mathRef.current) {
        try {
          // Wait for MathJax to be ready
          await window.MathJax.startup.promise;
          // Typeset the math
          await window.MathJax.typesetPromise([mathRef.current]);
        } catch (error) {
          console.error('MathJax typesetting failed:', error);
        }
      }
    };

    typesetMath();
  }, [children]);

  const Tag = inline ? 'span' : 'div';

  return (
    <Tag ref={mathRef as any} className={className}>
      {children}
    </Tag>
  );
};

export default MathJax;
