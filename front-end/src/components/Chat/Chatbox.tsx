import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TelegramService } from "@/services/telegramService";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const escalateTerms = ['complain', 'PIC', 'help'];

  useEffect(() => {
    // Simulating a welcome message from the chatbot
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your CTOS Report Assistant. How can I help you today?",
        sender: "bot",
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim() !== "") {
      const userMessage: Message = {
        id: Date.now(),
        text: input,
        sender: "user",
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      if (escalateTerms.some((term) => input.toLowerCase().includes(term))) {
        // Escalate to human support
        setTimeout(() => {
          const botResponse: Message = {
            id: Date.now() + 1,
            text: "We will prioritize your request and ensure that you are promptly connected with a CTOS officer for further assistance. Kindly wait while our customer service team assists you.",
            sender: "bot",
          };
          setMessages((prevMessages) => [...prevMessages, botResponse]);
        }, 1000);

        const ticketSupportMessage= `TicketId: ${Date.now() + 1}\nUsername: Rowan Sebastian Atkinson\nMessage: ${input}`;
        

        // Send message to telegram customer service
      TelegramService.sendTelegramMessage(ticketSupportMessage);

      } else {
        // Simulating bot response
        setTimeout(() => {
          const botResponse: Message = {
            id: Date.now() + 1,
            text: "Thank you for your message. I'm processing your request and will get back to you shortly.",
            sender: "bot",
          };
          setMessages((prevMessages) => [...prevMessages, botResponse]);
        }, 1000);
      }

     
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="p-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chat with CTOS Report Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full pr-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <div className="flex mt-4">
            <Input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="mr-2"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbox;
