import axios from 'axios';

const API_KEY = process.env.REACT_APP_LLM_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateTodos(creditReport: string): Promise<string[]> {
  try {
    const response = await axios.post(API_URL, {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates todo items to improve a user's credit score based on their credit report."
        },
        {
          role: "user",
          content: `Based on the following credit report, generate 5 specific todo items to help improve the credit score: ${creditReport}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const todoItems = response.data.choices[0].message.content.split('\n');
    return todoItems.map(item => item.replace(/^\d+\.\s*/, '').trim());
  } catch (error) {
    console.error('Error generating todos:', error);
    throw error;
  }
}

