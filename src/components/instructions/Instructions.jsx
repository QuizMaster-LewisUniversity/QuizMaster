import React from 'react';
import { Link } from 'react-router-dom';

export default function Instructions() {
  return (
    <div className="min-h-screen bg-primary text-white p-6 max-w-4xl mx-auto flex flex-col gap-6">
      <header className="flex justify-between items-center border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold">Quizmaster Instructions</h1>
        <Link 
          to="/dashboard" 
          className="bg-secondary hover:bg-opacity-80 px-4 py-2 rounded-lg font-medium transition"
        >
          ← Back to Dashboard
        </Link>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-accent">1. Select or Create a Quiz</h2>
          <p className="text-gray-300">
            Browse through available categories, search quizzes and flashcards, and you can also create your own quizzes and flashcards.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-accent">2. Scoring & Rules</h2>
          <p className="text-gray-300">
            Each question is 1 point. You can shuffle the questions before taking the quiz (not during the quiz). After answering every question you submit the quiz and your score will be calculated.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-accent">3. Flashcards & Study Mode</h2>
          <p className="text-gray-300">
            You can use flashcards to review material and study for quizzes. You can mark favorite quizzes and monitor your accuracy over time.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-accent">4. Polls</h2>
          <p className="text-gray-300">
            Teachers can create interactive polls to engage students and gather real-time feedback.
          </p>
        </div>
      </div>
    </div>
  );
}