import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { StoryDisplay } from './components/StoryDisplay';
import { Spinner } from './components/Spinner';
import { Footer } from './components/Footer';
import type { StoryBlock, StorySegmentPayload } from './types';
import { generateStoryAndImagePrompts } from './services/geminiService'; // Remove generateImage

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A lone astronaut discovering a glowing forest on a distant moon.');
  const [storyBlocks, setStoryBlocks] = useState<StoryBlock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStory = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for your story.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStoryBlocks([]);

    try {
      setLoadingMessage('Crafting your story...');
      const storySegments: StorySegmentPayload[] = await generateStoryAndImagePrompts(prompt);

      // Only use the paragraph, ignore image_prompt
      const newStoryBlocks: StoryBlock[] = storySegments.map((segment, index) => ({
        id: `block-${Date.now()}-${index}`,
        paragraph: segment.paragraph,
      }));

      setStoryBlocks(newStoryBlocks);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to create the story. ${errorMessage}. Please check your API key and try again.`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [prompt]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-indigo-800 text-white flex flex-col relative overflow-x-hidden">
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900/80 via-indigo-900/60 to-indigo-800/80 -z-10"></div>
      <Header />
      <main className="flex-grow flex flex-col justify-center items-center container mx-auto px-4 py-8 md:py-12">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[320px]">
          <div className="mb-10 flex flex-col items-center w-full">
            <h2 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300 drop-shadow-lg text-center animate-fade-in">
              <span className="inline-block px-2 py-1 rounded-lg bg-gray-900/40 shadow-md border border-indigo-600/30">
                <svg className="inline-block w-8 h-8 mr-2 align-middle text-cyan-300 drop-shadow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20l9-5-9-5-9 5 9 5zm0-10V4m0 0L3 9m9-5l9 5" />
                </svg>
                Create Your Story
              </span>
            </h2>
            <div className="w-20 h-1 mt-4 rounded-full bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-300 opacity-70 shadow-lg" />
            <p className="mt-6 text-lg md:text-2xl text-gray-200 text-center max-w-2xl drop-shadow">
              Enter a theme or a starting sentence, and let our AI craft a unique short story for you.
            </p>
          </div>
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={handleGenerateStory}
            isLoading={isLoading}
          />
        </div>
        {isLoading && (
          <div className="text-center my-12">
            <Spinner />
            <p className="mt-4 text-lg text-indigo-300 animate-pulse">{loadingMessage}</p>
          </div>
        )}
        {error && (
          <div className="max-w-3xl mx-auto my-8 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg text-center">
            <p className="font-semibold">An Error Occurred</p>
            <p>{error}</p>
          </div>
        )}
        {!isLoading && storyBlocks.length > 0 && (
          <div className="mt-16 w-full">
            <StoryDisplay blocks={storyBlocks} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
