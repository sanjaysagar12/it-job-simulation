"use client";
import { useState } from "react";
import TypingEffect from "./TypingEffect";
import MDtoHTML from "./MDtoHTML";

export type SceneTemplateProps = {
  storyEntries: any[];
  requirementsMarkdown: string;
  title: string;
  objective: string;
  children?: React.ReactNode;
};

function SceneTemplate({
  storyEntries,
  requirementsMarkdown,
  title,
  objective,
  children
}: SceneTemplateProps) {
  const [showTask, setShowTask] = useState(false);

  const handleComplete = () => setShowTask(true);

  if (showTask) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col relative">
        {/* Main Content */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                  <p className="text-gray-600 mt-1">{objective}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Requirements */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="markdown-body">
                <MDtoHTML
                  markdown={requirementsMarkdown}
                  
                />
              </div>
            </div>
            
            {/* Children content */}
            {children && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <TypingEffect
      entries={storyEntries}
      onComplete={handleComplete}
    />
  );
}

export default SceneTemplate;
