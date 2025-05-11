'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteWord() {
  const [english, setEnglish] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/words/delete?english=${encodeURIComponent(english)}`,
        {
          method: 'DELETE',
        },
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setEnglish('');
      } else {
        setMessage(data.message || 'Failed to delete word');
      }
    } catch (error) {
      setMessage('Error connecting to the server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Delete Word</h1>
      
      <form onSubmit={handleDelete} className="max-w-md mx-auto space-y-6">
        <div>
          <label htmlFor="english" className="block text-sm font-medium mb-2">
            English Word
          </label>
          <input
            type="text"
            id="english"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter English word to delete"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Deleting...' : 'Delete Word'}
        </button>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.includes('successfully')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
} 