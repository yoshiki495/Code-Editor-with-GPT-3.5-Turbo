import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { functions } from '../firebase'

const CodeEditorScreen = () => {
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState('');
  const [value, setValue] = useState([]);
  const [statement, setStatement] = useState('');

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    };

  const handleEditorChange = (value, event) => {
    setValue(value)
  };

  const handleStatementChange = (event) => {
    setStatement(event.target.innerText);
  }

  const handleReview = async () => {
    try {
      const body = { value:  value, statement: statement }
      const sendRequest = async (body) => {
        const requestFunction = functions.httpsCallable('review');
        const response = await requestFunction(body);
        return response;
      };
      const response = await sendRequest(body);
      setReview(response.data.text);
    } catch (error) {
      console.error(error);
    }
  };

  const [displayedReview, setDisplayedReview] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedReview(review.substring(0, i));
      i++;
      if (i > review.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [review]);

  return (
    <div className="bg-gray-100 min-h-screen">
    <div className="flex justify-center items-center bg-white p-4">
    <p className="text-gray-500 hover:text-gray-700 focus:outline-none focus:underline font-medium text-2xl">
        Code Editor with GPT-3.5 turbo
    </p>
    </div>
      <div className="h-full flex flex-row justify-center items-center" data-aos="zoom-y-out">
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
                <label htmlFor="code" className="block text-gray-700 font-bold mr-2">
                Code Editor
                </label>
                <div className="relative inline-flex">
                <select className="appearance-none bg-gray-100 border border-gray-300 py-2 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                    id="grid-state"
                    value={language}
                    onChange={handleLanguageChange}>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="json">JSON</option>
                    <option value="xml">XML</option>
                    <option value="markdown">Markdown</option>
                    <option value="sql">SQL</option>
                    <option value="yaml">YAML</option>
                    <option value="dockerfile">Dockerfile</option>
                    <option value="c">C</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="csharp">C#</option>
                    <option value="ruby">Ruby</option>
                    <option value="php">PHP</option>
                    <option value="swift">Swift</option>
                    <option value="rust">Rust</option>
                    <option value="perl">Perl</option>
                </select>
                </div>
            </div>
            <Editor
                height="78vh"
                theme="vs-dark"
                defaultValue="// some comment"
                onChange={handleEditorChange}
                language={language}
            />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center pt-4 pr-4" data-aos="zoom-y-out">
          <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 h-full overflow-y-auto">
              <label htmlFor="output" className="block text-gray-700 font-bold mb-2">
                Error Statement
              </label>
              <div
                id="statement"
                name="statement"
                className="w-full h-64 border border-gray-300 p-2 rounded"
                contentEditable={true}
                onBlur={handleStatementChange}
              >
              </div>
              </div>
      </div>
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mt-4">
        <div className="p-4 h-full overflow-y-auto">
          <label htmlFor="review" className="block text-gray-700 font-bold mb-2">
            Review
          </label>
          <div
            id="review"        name="review"
            className="w-full h-64 border border-gray-300 p-2 rounded"
            contentEditable={false}
          >
          {displayedReview}
          </div>
        </div>
      </div>
    </div>
    <div className="fixed bottom-4 right-4" data-aos="zoom-y-out">
    <button
        type="button"
        data-te-ripple-init
        data-te-ripple-color="light"
        className="inline-block rounded-full bg-info p-6 mr-4 uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-info-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-info-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
        onClick={handleReview}>
        レビューをもらう
    </button>
    <button
        type="button"
        data-te-ripple-init
        data-te-ripple-color="danger"
        className="inline-block rounded-full bg-danger p-6 uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-danger-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-danger-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-danger-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
        onClick={handleReview}>
        エラーを解決する
    </button>
    </div>
    </div>
</div>
  )
};
export default CodeEditorScreen;
