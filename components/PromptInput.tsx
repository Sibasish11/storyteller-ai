import React from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onSubmit, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-gray-800/90 rounded-2xl shadow-2xl border border-indigo-700/40 p-8 flex flex-col items-center">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g., A knight who is afraid of the dark..."
          className="w-full h-24 p-4 pr-32 text-gray-200 bg-gray-900/80 border-2 border-indigo-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300 resize-none text-lg"
          disabled={isLoading}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="absolute bottom-8 right-8 px-6 py-2 font-semibold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-md shadow-lg hover:from-indigo-500 hover:to-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
        >
          {isLoading ? 'Creating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
};
