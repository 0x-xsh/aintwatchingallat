'use client'

import React, { useState } from 'react';
import { DNA } from 'react-loader-spinner';
import AIWriter from 'react-aiwriter';

const isValidYoutubeLink = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(embed\/|v\/|watch\?v=|watch\?.+&v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  return youtubeRegex.test(url);
};

interface YoutubeInputProps {
  onSubmit: (value: string) => void;
}

const YoutubeInput: React.FC<YoutubeInputProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
  };

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Paste YouTube link"
        style={{
          width: '70%',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #ccc',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          fontSize: '1em',
          outline: 'none',
          marginBottom: '10px',
        }}
      />
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: '15px',
            borderRadius: '8px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            fontSize: '1em',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string[] | null>(null);

  const handleSubmit = async (inputValue: string) => {
    if (!isValidYoutubeLink(inputValue)) {
      setError('Invalid YouTube link. Please enter a valid URL.');
    } else {
      setError(null);
      setResponse(null);
      setIsLoading(true);
            
      const videoId = inputValue.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1] || null;
      
      try {
        const staticData = await fetch(`https://aint-server.onrender.com/transcript?id=${videoId}`);
        const jsonData = await staticData.json();
        const res = jsonData['resumed_captions'];
        setResponse(res);
        console.log(res);
      } catch (error) {
        
        setError('Error fetching summary. Please try again.');
      }

      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '4em', marginBottom: '10px', color: '#333' }}>Ain't Watching Allat</h1>

      <p style={{ textAlign: 'center', fontSize: '1em', marginBottom: '20px', color: '#666', fontWeight: 'bold' }}>
        Your AI-powered YouTube Video Summarizer! Enter the YouTube video's link, hit "Submit," and get concise summaries in seconds.
      </p>

      <YoutubeInput onSubmit={handleSubmit} />

      {isLoading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <DNA visible={true} height="80" width="80" ariaLabel="dna-loading" wrapperStyle={{}} wrapperClass="dna-wrapper" />
        </div>
      )}

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '10px', opacity: 0.7, fontSize: '0.9em' }}>{error}</p>
      )}

      <div style={{ textAlign: 'left', marginTop: '20px', width: '90%', maxWidth: '70%',  maxHeight: '40vh', overflowY: 'scroll' }}>
        {response != null && (
          <AIWriter>
            {response.map((data, index) => (
              <div key={index} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p>{data}</p>
              </div>
            ))}
          </AIWriter>
        )}
      </div>
    </div>
  );
};

export default Home;
