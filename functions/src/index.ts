import * as functions from 'firebase-functions';
import axios, { AxiosResponse } from 'axios';

// break the app if the API key is missing
if (!functions.config().openai.apikey) {
  throw new Error('Missing Environment Variable OPENAI_API_KEY');
}

export const review = functions.https.onCall(async (data, context) => {
  
  const body = data;
  const value = body.value;
  
  let prompt = value + "のコードレビューを450字以内の日本語でお願いします。";

  if (body.statement !== '') {
    prompt = value + "というコードで" + body.statement + "エラーが起こるので450字以内の日本語で解決方法を教えてください。";
  }

  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [{ "role": "user", "content": prompt }],
  };

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${functions.config().openai.apikey}`,
  };

  if (functions.config().openai.apiorg) {
    requestHeaders['OpenAI-Organization'] = functions.config().apiorg;
  }
  try {
    const response: AxiosResponse<any> = await axios({
      method: 'post',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: requestHeaders,
      data: JSON.stringify(payload),
    });
    // return response with 200 and stringify json text
    console.log(response.data.choices[0]);
    return { text: response.data.choices[0].message.content };
  } catch (error) {
    console.error(error);
    return {
      text: `ERROR with API integration. ${error}`,
    };
  }
})
