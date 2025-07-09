import React from 'react';
import type { StoryBlock } from '../types';

interface StoryDisplayProps {
  blocks: StoryBlock[];
}

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ blocks }) => {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-16 md:space-y-24">
      {blocks.map((block) => (
        <div key={block.id} className="p-6 bg-gray-800/70 rounded-xl shadow-lg">
          <p className="text-gray-300 leading-relaxed text-lg md:text-xl">
            {block.paragraph}
          </p>
        </div>
      ))}
    </div>
  );
};
