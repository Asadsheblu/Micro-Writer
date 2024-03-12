import React, { useState, useEffect } from 'react';
import setting from "../assest/setting.png";
import { Spinner } from 'react-bootstrap';

const Home = () => {
    const [apiKey, setApiKey] = useState("");
    const [keyWord, setKeyWord] = useState("");
    const [streamingText, setStreamingText] = useState([]);
    const [showForm, setShowForm] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedResponse, setGeneratedResponse] = useState(null); // State to hold the generated response
    const [wordCount, setWordCount] = useState(0); // State to hold the word count
    const [currentWordIndex, setCurrentWordIndex] = useState(0); // State to hold the index of the currently streaming word

    useEffect(() => {
        setError(null); // Reset error on component mount
    }, []);

    const handelApiKey = (e) => {
        setApiKey(e.target.value);
    };

    const handelKeyword = (e) => {
        setKeyWord(e.target.value);
    };

    const generateAndStreamText = async () => {
        setLoading(true);
        setShowForm(false);
        const prompt = `Write a blog with proper HTML headings. First, Write an SEO Optimized Heading with h1. Then Write the introduction in 2 paragraphs. Then start with h2 headings. Each H2 Headings 3 paragraphs. Then if needed also add h3 headings. Then,. Article Keyword: ${keyWord}`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-16k",
                    messages: [
                        { "role": "system", "content": `${prompt}` },
                        { "role": "user", "content": `${keyWord}` }
                    ],
                    "temperature": 1,
                    "max_tokens": 3500,
                    "top_p": 1,
                    "frequency_penalty": 0,
                    "presence_penalty": 0,
                })
            });

            const { choices } = await response.json();
            if (choices && choices.length > 0 && choices[0].message && choices[0].message.content) {
                const generatedText = choices[0].message.content.trim();
                const words = generatedText.split(/\s+/);
                setGeneratedResponse(generatedText); // Set the generated response
                setStreamingText(words);
                setWordCount(words.length); // Update word count
            } else {
                setError('Error generating text. Please try again.');
            }
        } catch (error) {
            setError('Error generating text. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex(prevIndex => prevIndex + 1);
        }, 300); // Change this value to control the streaming speed

        return () => clearInterval(interval);
    }, [streamingText]);

    return (
        <div className='container p-5'>
            <h1 className='text-center fw-bold'>Micro Writer</h1>
            <h6 className='text-center'>Generate Unlimited SEO-Optimized Articles powered by your OpenAI API Key</h6>
            <div className='text-center m-4'>
                <span className='bg-light rounded-pill p-3 '><a className='text-decoration-none' href="">Follow Linkedin</a></span>
            </div>
            <div className='text-center w-100 form-container'>
                {loading ? (
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                ) : (
                    showForm ? (
                        <div className="shadow rounded p-5 ">
                            <form className='w-100 text-center'>
                                <a type="button" className="" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <img src={setting} alt=""/>
                                </a>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label">API Key</label>
                                    <input type="text" className="form-control" id="exampleInputEmail1"  value={apiKey} onChange={handelApiKey} placeholder='Your OpenAI APIKEY' required/>
                                    <div id="emailHelp" className="form-text">Get your API Key from <a href="https://openai.com/">OpenAI</a>. By entering your API Key, you agree to be responsible for any API charges you incur for OpenAI usage. Approximately $0.01 per article generated.</div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Target Keyword</label>
                                    <input type="text" className="form-control" value={keyWord} onChange={handelKeyword} placeholder='Enter Your Target Keyword' required/>
                                </div>
                                <button type="button" className="btn btn-primary" onClick={generateAndStreamText}>Generate Article</button>
                                {error && <div className="text-danger mt-2">{error}</div>}
                            </form>
                        </div>
                    ) : (
                      <div>
                      {/* <h3>Generated Response:</h3> */}
                      <div className='d-none' dangerouslySetInnerHTML={{ __html: generatedResponse }} />
                      <h3>Streaming Real-Time Results:</h3>
                      <div dangerouslySetInnerHTML={{ __html:   streamingText.slice(0, currentWordIndex).join(' ')} }>
                        
                      </div>
                     
                  </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Home;
