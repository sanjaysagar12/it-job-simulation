import React from "react";
import { marked } from "marked";
import 'github-markdown-css/github-markdown.css';

interface MDtoHTMLProps {
  markdown: string;
  className?: string;
}

const MDtoHTML: React.FC<MDtoHTMLProps> = ({ markdown, className }) => {
  const html = marked.parse(markdown || "");
  return (
    <div
      className={`markdown-body ${className || ''}`}
      style={{ 
        backgroundColor: 'white',
        color: '#1f2937',
        colorScheme: 'light'
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MDtoHTML;
