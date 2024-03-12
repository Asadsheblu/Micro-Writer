import React, { useState, useRef } from 'react';
import setting from "../assest/setting.png"

const Home = () => {
    const [apiKey, setApiKey] = useState("");
    const [keyWord, setKeyWord] = useState("");
    const [streamingText, setStreamingText] = useState(""); // State to hold streaming text
    const [showForm, setShowForm] = useState(true); // State to toggle between form and streaming results
    const [charCount, setCharCount] = useState(0); // State to hold character count
    const [isGenerating, setIsGenerating] = useState(false); // State to track generation status
    const stopGenerationRef = useRef(false); // Ref to track if generation should be stopped

    const handelApiKey = (e) => {
        setApiKey(e.target.value);
    };

    const handelKeyword = (e) => {
        setKeyWord(e.target.value);
    };

    // Function to generate and stream text in real-time
    const generateAndStreamText = async () => {
        setIsGenerating(true);
        setShowForm(false); // Hide the form
        setStreamingText(""); // Clear streaming text
        setCharCount(0); // Reset character count
        stopGenerationRef.current = false; // Reset stop generation flag

        const prompt = `Write a  blog  with proper HTML headings. First, Write an SEO Optimized Heading with h1. Then Write the introduction in 2 paragraphs. Then start with h2 headings. Each H2 Headings 3 paragraphs. Then if needed also add h3 headings. Then,. Article Keyword: ${keyWord}`;

        try {
            while (!stopGenerationRef.current) {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                "role": "system",
                                "content": `${prompt}`
                            },
                            {
                                "role": "user",
                                "content": `${keyWord}`
                            }
                        ],
                        "temperature": 1,
                        "max_tokens": 3500,
                        "top_p": 1,
                        "frequency_penalty": 0,
                        "presence_penalty": 0,
                    })
                });

                const data = await response.json();
                if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
                    const generatedHtml = data.choices[0].message.content.trim();
                    setStreamingText(prevText => prevText + generatedHtml); // Update streaming text
                    setCharCount(prevCount => prevCount + generatedHtml.length); // Update character count
                } else {
                    console.error('Error generating text:', data);
                }
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before fetching again
            }
        } catch (error) {
            console.error('Error generating text:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Function to stop text generation
    const stopGeneration = () => {
        stopGenerationRef.current = true;
        setShowForm(true); // Show the form again
    };

    return (
        <div className='container p-5'>
            <h1 className='text-center fw-bold'>Micro Writer</h1>
            <h6 className='text-center'>Generate Unlimited SEO-Optimized Articles powered by your OpenAI API Key</h6>
            <div className='text-center m-4'>
                <span className='bg-light rounded-pill p-3 '>    <a className='text-decoration-none' href="">Follow Linkedin</a></span>
            </div>
            <div className='text-center w-50 form-container'>
                {showForm ? (
                    <div className="shadow rounded p-5 ">
                        <form className='w-100 text-center'>
                            {/* Modal */}
                            <a type="button" className="" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <img src={setting} alt=""/>
                            </a>
                            {/* Modal */}
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">API Key</label>
                                <input type="text" className="form-control" id="exampleInputEmail1"  value={apiKey} onChange={handelApiKey} placeholder='Your OpenAI APIKEY' required/>
                                <div id="emailHelp" className="form-text">Get your API Key from <a href="https://openai.com/">OpenAI</a>. By entering your API Key, you agree to be responsible for any API charges you incur for OpenAI usage. Approximately $0.01 per article generated.</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Target Keyword</label>
                                <input type="text" className="form-control" value={keyWord} onChange={handelKeyword} placeholder='Enter Your Target Keyword' required/>
                            </div>
                            <button type="button" className="btn btn-primary" onClick={generateAndStreamText} disabled={isGenerating}>Generate Article</button>
                        </form>
                    </div>
                ) : (
                    <div className="editor-container">
                        <h3>Streaming Real-Time Results:</h3>
                        <div dangerouslySetInnerHTML={{ __html: streamingText }} />
                        <p>Character Count: {charCount}</p>
                        <button type="button" className="btn btn-danger" onClick={stopGeneration}>Stop Generation</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
