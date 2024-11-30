import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OllamaChatService } from "@/services/ollamaChatService";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatServiceRef = useRef<OllamaChatService | null>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const initializeChatService = async () => {
      try {
        setIsInitializing(true);
        chatServiceRef.current = new OllamaChatService(user);
        await chatServiceRef.current.initialize();

        // Get initial message from the service
        const initialMessage = await chatServiceRef.current.getInitialMessage();
        setMessages([
          {
            id: 1,
            text: initialMessage,
            sender: "bot",
          },
        ]);
      } catch (error) {
        console.error("Failed to initialize chat service:", error);
        setMessages([
          {
            id: 1,
            text: "I apologize, but I'm having trouble connecting to the service. Please try again later.",
            sender: "bot",
          },
        ]);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeChatService();
  }, [user]);

  useEffect(() => {
    // Scroll to bottom with a slight delay to ensure content is rendered
    const scrollTimeout = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(scrollTimeout);
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() !== "" && !isLoading) {
      const userMessage: Message = {
        id: Date.now(),
        text: input,
        sender: "user",
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        if (!chatServiceRef.current) {
          throw new Error("Chat service not initialized");
        }

        const response = await chatServiceRef.current.sendMessage(input);
        const botResponse: Message = {
          id: Date.now() + 1,
          text: response,
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } catch (error) {
        console.error("Error getting response:", error);
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: "I apologize, but I encountered an error processing your request. Please try again.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
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
    <div className="h-[90vh] max-h-[90vh] p-4 flex flex-col overflow-hidden">
      <Card className="flex-1 flex flex-col min-h-0 shadow-lg">
        <CardHeader className="flex-none border-b">
          <CardTitle>Chat with CTOS Report Assistant</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0 p-4 gap-4">
          <ScrollArea className="flex-1 pr-4 min-h-0">
            <div className="space-y-4">
              {isInitializing ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-[80%] break-words shadow-sm ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.sender === "user" ? (
                        <div className="whitespace-pre-wrap">
                          {message.text}
                        </div>
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-muted-foreground/20 prose-pre:text-foreground prose-code:text-foreground prose-code:bg-muted-foreground/20 prose-code:before:content-none prose-code:after:content-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                          >
                            {message.text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <div className="flex-none flex gap-2 pt-2 border-t">
            <Input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading || isInitializing}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || isInitializing || input.trim() === ""}
              className="flex-none px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbox;
