// import React, { useState, useEffect } from 'react';

// const Tinder = () => {
//     const [apiEndoint, setApiEndoint] = useState([]);
//     const [apiKey, setApiKey] = useState([]);
//     const [userInput, setUserInput] = useState('');
//     const [userComment, setUserComment] = useState('');
//     const [userParagraph, setUserParagraph] = useState('');
//     const [userPoint, setUserPoint] = useState('');
//     const [generatedText, setGeneratedText] = useState('');
//     const api= process.env.REACT_APP_API;

   
//     const handleInputChange = (e) => {
//         setUserInput(e.target.value);
//     };

//     const handleComment = (e) => {
//         setUserComment(e.target.value);
//     };

//     const handleParagraph = (e) => {
//         setUserParagraph(e.target.value);
//     };

//     const handlePV = (e) => {
//         setUserPoint(e.target.value);
//     };
  
//     useEffect(() => {
//         fetch(`${api}`)
//             .then(res => res.json())
//             .then(data => setApiEndoint(data[0].apiEndpoint))
//     }, []);

//     useEffect(() => {
//         fetch("https://microex.onrender.com/api")
//             .then(res => res.json())
//             .then(data => setApiKey(data[0].apiKey))
//     }, []);

//     const generateText = async () => {
//         try {
//             const prompt = `Write ${userComment} movie comments as a movie reviewer, with each comment in ${userParagraph} paragraphs. Write Point Of View as a ${userPoint};  for this Movie: ${userInput} using HTML paragraphs tag; Like this:
            
//             <h2>Comment-1: </h2>
//             <h2>Comment-2:</h2>
            
//             Then, after this, Please make an HTML table with this information: Storyline, Release date, Country of origin, Language, Budget, Runtime, Genre, Director, Writers, Stars, and Rating Out of 100. Movie Name: ${userInput}.`;
    
//             const response = await fetch(`${apiEndoint}`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${apiKey}`
//                 },
//                 body: JSON.stringify({
//                     model: "gpt-3.5-turbo-16k",
//                     messages: [
//                         {
//                             "role": "system",
//                             "content": `${prompt}`
//                         },
//                         {
//                             "role": "user",
//                             "content": `${userInput},${userComment},${userParagraph},${userPoint}`
//                         }
//                     ],
//                     "temperature": 1,
//                     "max_tokens": 3500,
//                     "top_p": 1,
//                     "frequency_penalty": 0,
//                     "presence_penalty": 0,
//                 })
//             });
    
//             const data = await response.json();
//             console.log('API Response:', data); // Log the response
//             if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
//                 const generatedHtml = data.choices[0].message.content.trim();
//                 setGeneratedText(generatedHtml); // Set generated text
//             } else {
//                 console.error('Error generating text:', data);
//             }
//         } catch (error) {
//             console.error('Error generating text:', error);
//         }
//     };
    

//     return (
//         <div className="container">
//             <h3 className="text-center bg-light rounded border p-3">
//                 FilmPlus For PC
//             </h3>
//             <div className="row">
//                 <div className="col-md-6">
//                     <input
//                         type="text"
//                         placeholder="Enter movie name for review"
//                         value={userInput}
//                         onChange={handleInputChange}
//                     />
//                 </div>
//                 <div className="col-md-6">
//                     <select value={userComment} onChange={handleComment} id='comment' className="form-select" aria-label="Default select example">
//                         <option selected> How Many Comments You Want?</option>
//                         {[...Array(10)].map((_, index) => (
//                             <option key={index + 1} value={index + 1}>{index + 1}</option>
//                         ))}
//                     </select>
//                 </div>
//             </div>
//             <div className="row mt-3">
//                 <div className="col-md-6">
//                     <select value={userParagraph} onChange={handleParagraph} className="form-select" aria-label="Default select example">
//                         <option selected> How Many Paragraphs For Each Comment?</option>
//                         {[...Array(4)].map((_, index) => (
//                             <option key={index + 1} value={index + 1}>{index + 1}</option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="col-md-6">
//                     <select value={userPoint} onChange={handlePV} className="form-select" aria-label="Default select example">
//                         <option selected> Point of View</option>
//                         <option value="Professional">Professional</option>
//                         <option value="First_Person">First Person: I, Me, My, We, Us, Our</option>
//                         <option value="Second_Person">Second Person: You, Your</option>
//                         <option value="Third_Person">Third Person: He, She, It, They, Him, Her, Them</option>
//                     </select>
//                 </div>
//             </div>

//             <button
//                 className="btn btn-primary w-100 rounded m-2 p-3"
//                 onClick={generateText}
//             >
//                 Generate Movie Comment
//             </button>

//             {/* Display generated text */}
//             <div className="generated-text" dangerouslySetInnerHTML={{ __html: generatedText }}></div>
//         </div>
//     );
// };

// export default Tinder;


import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-loader-spinner';
import ReactLanguageSelect from 'react-languages-select';
import 'react-languages-select/css/react-languages-select.css';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

const AiMovieCommentGenerator = () => {
    const [userInput, setUserInput] = useState('');
    const [userComment, setUserComment] = useState('');
    const [userParagraph, setUserParagraph] = useState('');
    const [userPoint, setUserPoint] = useState('');
    const [userLanguage, setUserLanguage] = useState(null);
    const [generatedText, setGeneratedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCKEditorReady, setIsCKEditorReady] = useState(false);
    const [editorInstance, setEditorInstance] = useState(null);

    useEffect(() => {
        setIsCKEditorReady(true);
    }, []);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleComment = (e) => {
        setUserComment(e.target.value);
    };

    const handleParagraph = (e) => {
        setUserParagraph(e.target.value);
    };

    const handlePV = (e) => {
        setUserPoint(e.target.value);
    };

    const handleLanguage = (language) => {
        setUserLanguage(language);
    };

    const generateText = async () => {
        setIsLoading(true);

        try {
            const languageLabel = userLanguage ? userLanguage.label : '';
            const prompt = `Write ${userComment} movie comments as a movie reviewer, with each comment in ${userParagraph} paragraphs. Write Point Of View as a ${userPoint}; Language: ${languageLabel}; for this Movie: ${userInput} using HTML paragraphs tag; Like this:
            
            <h2>Comment-1: </h2>
            <h2>Comment-2:</h2>
            
            Then, after this, Please make an HTML table with this information: Storyline, Release date, Country of origin, Language, Budget, Runtime, Genre, Director, Writers, Stars, and Rating Out of 100. Movie Name: ${userInput}.`;
            
            // Fetch data from OpenAI API...
        } catch (error) {
            console.error('Error generating text:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyText = () => {
        if (editorInstance) {
            const textToCopy = generatedText;
            navigator.clipboard.writeText(textToCopy)
                .then(() => alert("Text copied to clipboard"))
                .catch(err => console.error('Error copying text: ', err));
        }
    };

    const handleClearText = () => {
        setUserInput('');
        setGeneratedText('');
    };

    return (
        <div className="container">
            <h3 className="text-center bg-light rounded border p-3">
                FilmPlus For PC
            </h3>
            <div className="row">
                <div className="col-md-6">
                    <input
                        type="text"
                        placeholder="Enter movie name for review"
                        value={userInput}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="col-md-6">
                    <select value={userComment} onChange={handleComment} id='comment' className="form-select" aria-label="Default select example">
                        <option selected> How Many Comments You Want?</option>
                        {[...Array(10)].map((_, index) => (
                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-6">
                    <select value={userParagraph} onChange={handleParagraph} className="form-select" aria-label="Default select example">
                        <option selected> How Many Paragraphs For Each Comment?</option>
                        {[...Array(4)].map((_, index) => (
                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <select value={userPoint} onChange={handlePV} className="form-select" aria-label="Default select example">
                        <option selected> Point of View</option>
                        <option value="Professional">Professional</option>
                        <option value="First_Person">First Person: I, Me, My, We, Us, Our</option>
                        <option value="Second_Person">Second Person: You, Your</option>
                        <option value="Third_Person">Third Person: He, She, It, They, Him, Her, Them</option>
                    </select>
                </div>
            </div>
            <div className="text-center col-md-6 mt-3 border">
                <label>Choose Your Language</label>
                <ReactLanguageSelect
                    value={userLanguage}
                    onChange={handleLanguage}
                    defaultLanguage="en"
                />
            </div>

            {isLoading ? (
                <ProgressBar
                    visible={true}
                    height="80"
                    width="80"
                    color="#4fa94d"
                    ariaLabel="progress-bar-loading"
                    wrapperStyle={{}}
                    wrapperclassName=""
                />
            ) : (
                <button
                    className="btn btn-primary w-100 rounded m-2 p-3"
                    onClick={generateText}
                    disabled={isLoading}
                >
                    Generate Movie Comment
                </button>
            )}

            {generatedText && (
                <div className="editor-container">
                    {isCKEditorReady ? (
                        <CKEditor
                            editor={ClassicEditor}
                            data={generatedText}
                            config={{
                                stylesSet: [
                                    { name: "Heading 1", element: "h1" },
                                    { name: "Heading 2", element: "h2" },
                                    { name: "Heading 3", element: "h3" },
                                    { name: "Paragraph", element: "p" },
                                    { name: "Bold", element: "strong" },
                                    { name: "Italic", element: "em" },
                                    { name: "Link", element: "a", attributes: { className: "link" } },
                                    { name: "Blockquote", element: "blockquote" },
                                    { name: "Code Block", element: "pre" },
                                    { name: "Unordered List", element: "ul" },
                                    { name: "Ordered List", element: "ol" },
                                    { name: "List Item", element: "li" },
                                    { name: "Table", element: "table" },
                                    { name: "Table Row", element: "tr" },
                                    { name: "Table Header", element: "th" },
                                    { name: "Table Data", element: "td" },
                                ],
                                removeFormatAttributes: true,
                                table: {
                                    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
                                },
                            }}
                            onReady={(editor) => {
                                setEditorInstance(editor);
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setGeneratedText(data);
                            }}
                            style={{ height: "400px", width: "100%" }}
                        />
                    ) : (
                        <p>Loading CKEditor...</p>
                    )}
                    <button
                        className="btn btn-primary rounded m-2"
                        onClick={handleCopyText}
                        disabled={!editorInstance}
                    >
                        Copy Text
                    </button>
                    <button
                        className="btn btn-primary rounded m-2"
                        onClick={handleClearText}
                    >
                        Clear Text
                    </button>
                </div>
            )}
        </div>
    );
};

export default AiMovieCommentGenerator;
