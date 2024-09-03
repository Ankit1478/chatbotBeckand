'use client'

import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [story, setStory] = useState('');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [characterNames, setCharacterNames] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [isAddingStory, setIsAddingStory] = useState(false);
  const [isAskingQuery, setIsAskingQuery] = useState(false);

  const handleAddStory = async () => {
    setIsAddingStory(true);
    try {
      await axios.post('http://localhost:3001/add', { story });
      const { data } = await axios.post('http://localhost:3001/charactername', { story });
      setCharacterNames(data.response.split(', '));
      setStory('');
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the story or fetching character names.');
    } finally {
      setIsAddingStory(false);
    }
  };

  const handleAskQuery = async () => {
    setIsAskingQuery(true);
    try {
      const res = await axios.post('http://localhost:3001/ask', { query, characterName: selectedCharacter });
      setResponse(res.data.response);
      setQuery('');
    } catch (error) {
      console.error('Error processing query:', error);
      alert('An error occurred while processing your query.');
    } finally {
      setIsAskingQuery(false);
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-md shadow-lg text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to Story AI</h1>
          <p className="text-lg">Train your AI with stories and ask questions to get insights as your favorite characters.</p>
        </div>

        {/* Story Input Section */}
        <div className="mb-8 p-6 bg-white shadow-lg rounded-md">
          <h2 className="text-2xl font-semibold mb-4">Add a Story</h2>
          <p className="text-gray-600 mb-4">Enter a story to train the AI. The AI will summarize the story and extract character names.</p>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Enter your story here..."
            className="w-full h-32 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddStory}
            disabled={isAddingStory}
            className={`mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 ${isAddingStory ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAddingStory ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Story...
              </span>
            ) : 'Add Story'}
          </button>
        </div>

        {/* Character Selection Section */}
        {characterNames.length > 0 && (
          <div className="mb-8 p-6 bg-white shadow-lg rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Select a Character</h2>
            <p className="text-gray-600 mb-4">Choose a character to ask questions from their perspective.</p>
            <select
              value={selectedCharacter}
              onChange={(e) => setSelectedCharacter(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--Select Character--</option>
              {characterNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Query Section */}
        {selectedCharacter && (
          <div className="mb-8 p-6 bg-white shadow-lg rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Ask a Question as {selectedCharacter}</h2>
            <p className="text-gray-600 mb-4">Ask a question and get a response as if it was answered by the selected character.</p>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your question here..."
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAskQuery}
              disabled={isAskingQuery}
              className={`mt-4 w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 ${isAskingQuery ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAskingQuery ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Asking Question...
                </span>
              ) : 'Ask Question'}
            </button>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="p-6 bg-gray-100 border-l-4 border-blue-600 rounded-md">
            <h2 className="text-2xl font-semibold mb-4">Response:</h2>
            <p className="text-gray-800">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}