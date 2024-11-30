import axios from 'axios';

// const API_URL = `${import.meta.env.TELEGRAM_BOT_API_URL}/api/send-telegram-message`;
const API_URL = 'http://localhost:3005/api/send-telegram-message';

export class TelegramService {

  static async sendTelegramMessage(message: String): Promise<String> {
    try {
      const payload = {
        // Telegram group chat Id
        chatId: -1002319055220,
        message,
      };
      console.log('send Telegram message', message);
      const response = await axios.post<String>(API_URL, payload);
      return response.data;
    } catch (error) {
      console.error('Failed to send telegram message:', error);
      // Return mock data for now
      return 'Succesfully sent message';
    }
  }
}
