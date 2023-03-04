import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { functions } from '../firebase'

const Home = () => {
  const navigate = useNavigate();
  const [output, setOutput] = useState([]);
  const [review, setReview] = useState('');
  const [value, setValue] = useState([]);
  const [showChatButton, setShowChatButton] = useState(false);

  const handleEditorChange = (value, event) => {
    setValue(value)
  };

  const handleExecute = async () => {
    try {
      console.log(value)
      const body = { codeString:  value}
      console.log(body)
      const sendRequest = async (body) => {
        const requestFunction = functions.httpsCallable('execute');
        const response = await requestFunction(body);
        return response;
      };
      const response = await sendRequest(body);
      console.log(response)
      setOutput(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReview = async () => {
    try {
      const body = { value:  value}
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatButton(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

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
      <div className="flex justify-between items-center bg-white p-4">
        <button className="text-gray-500 hover:text-gray-700 focus:outline-none focus:underline" onClick={() => navigate(-1)}>
          Back
        </button>
        <button
          className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={handleExecute}
        >
          Execute
        </button>
      </div>
      <div className="h-full flex flex-row justify-center items-center" data-aos="zoom-y-out">
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 h-full flex flex-col justify-between">
              <label htmlFor="code" className="block text-gray-700 font-bold mb-2">
                Code Editor
              </label>
              <Editor
                height="78vh"
                theme="vs-dark"
                defaultLanguage="javascript"
                defaultValue="// some comment"
                onChange={handleEditorChange}
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center pt-4 pr-4" data-aos="zoom-y-out">
          <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 h-full">
              <label htmlFor="output" className="block text-gray-700 font-bold mb-2">
                Output
              </label>
              <div
                id="output"
                name="output"
                className="w-full h-64 border border-gray-300 p-2 rounded"
                contentEditable={false}
              >
                {output}
              </div>
              </div>
      </div>
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mt-4">
        <div className="p-4 h-full">
          <label htmlFor="review" className="block text-gray-700 font-bold mb-2">
            Review
          </label>
          <div
            id="review"
            name="review"
            className="w-full h-64 border border-gray-300 p-2 rounded"
            contentEditable={false}
          >
          {displayedReview}
          </div>
        </div>
      </div>
    </div>
    {showChatButton && (
      <div className="fixed bottom-4 right-4" data-aos="zoom-y-out">
        <button
          type="button"
          data-te-ripple-init
          data-te-ripple-color="light"
          className="inline-block rounded-full bg-info p-6 uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:bg-info-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-info-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          onClick={handleReview}>
          お困りですか？
        </button>
      </div>
    )}
  </div>
</div>
  )
};

export default Home;