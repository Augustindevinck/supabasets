import axios from 'axios';
import { createModuleLogger } from '@/lib/logger';

const gptLogger = createModuleLogger('OpenAI-GPT');

// Use this if you want to make a call to OpenAI GPT-4 for instance. userId is used to identify the user on openAI side.
export const sendOpenAi = async (
  messages: { role: string; content: string }[],
  userId: number,
  max = 100,
  temp = 1
) => {
  const url = 'https://api.openai.com/v1/chat/completions';
  const timer = gptLogger.startTimer('OpenAI API call');

  const body = JSON.stringify({
    model: 'gpt-4',
    messages,
    max_tokens: max,
    temperature: temp,
    user: userId,
  });

  const options = {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
  };

  try {
    gptLogger.debug('Sending request to OpenAI', {
      userId,
      messageCount: messages.length,
      model: 'gpt-4',
    });

    const res = await axios.post(url, body, options);
    const answer = res.data.choices[0].message.content;
    
    const duration = timer();
    gptLogger.info('OpenAI request successful', {
      userId,
      duration: `${duration.toFixed(2)}ms`,
    });

    return answer;
  } catch (e) {
    timer();
    gptLogger.error('OpenAI request failed', e as Error, {
      userId,
      url,
    });
    return null;
  }
};
