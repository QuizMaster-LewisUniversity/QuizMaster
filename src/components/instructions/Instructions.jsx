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
            Browse through available categories, search custom quizzes, or build your own custom deck to host or study.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-accent">2. Scoring & Rules</h2>
          <p className="text-gray-300">
            Each question has a countdown timer. Point values scale down as time elapses, so answer quickly for maximum points!
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-accent">3. Flashcards & Study Mode</h2>
          <p className="text-gray-300">
            Use Study Mode for self-paced review before taking a quiz. You can mark favorites and monitor your accuracy over time.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-2 text-accent">4. Classrooms & Live Session</h2>
          <p className="text-gray-300">
            Teachers and hosts can start interactive live quizzes in Classrooms for group study and real-time multiplayer scoring.
          </p>
        </div>
      </div>
    </div>
  );
}