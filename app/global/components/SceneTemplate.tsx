"use client";
import { useState } from "react";
import TypingEffect from "./TypingEffect";
import MDtoHTML from "./MDtoHTML";
import MailConversation from "./MailConversation";
import { Mail } from "lucide-react";
import type { Message } from "./MailConversation";

export type SceneTemplateProps = {
  storyEntries: any[];
  requirementsMarkdown: string;
  title: string;
  objective: string;
  children?: React.ReactNode;
  mailConversation: Message[];
  onAddMail?: (newMail: Message) => void;
};

function SceneTemplate({
  storyEntries,
  requirementsMarkdown,
  title,
  objective,
  children,
  mailConversation,
  onAddMail
}: SceneTemplateProps) {
  const [showTask, setShowTask] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleComplete = () => setShowTask(true);

  if (showTask) {
    return (
      <div className="h-screen bg-gray-100 flex flex-col relative">
        {/* Mail Icon Button (top right) */}
        <button
          className="fixed top-6 right-8 z-50 rounded-full text-black shadow-lg "
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          aria-label={isDrawerOpen ? "Close Mail" : "Open Mail"}
        >
          <Mail className="w-7 h-7" />
          {mailConversation.length > 1 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {mailConversation.length}
            </span>
          )}
        </button>

        {/* Overlay */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-opacity-10 z-40 transition-opacity duration-300"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}

        {/* Side Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {isDrawerOpen && (
            <MailConversation 
              initialConversation={mailConversation} 
              onClose={() => setIsDrawerOpen(false)}
            />
          )}
        </div>

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
