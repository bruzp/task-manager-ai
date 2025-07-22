import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { MessageCircle, Minus } from 'lucide-react';
import React from 'react';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export default function FloatingChat() {
  const [messages, setMessages] = React.useState<Message[]>([{ role: 'ai', content: 'I am your Task AI assistant. How can I help you today?' }]);
  const [input, setInput] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(route('ai-tasks.process'), {
        message: userMsg,
      });

      setMessages((prev) => [...prev, { role: 'ai', content: response.data.reply ?? 'No response' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'ai', content: 'Error: something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 w-full max-w-sm">
      {open ? (
        <Card className="shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Task AI</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <Minus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <ScrollArea className="h-72 rounded-md border p-2">
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`rounded-md p-2 text-sm ${
                      msg.role === 'user' ? 'ml-auto max-w-[75%] bg-blue-100 text-right' : 'mr-auto max-w-[75%] bg-gray-100 text-left'
                    }`}
                  >
                    <div className="prose prose-sm">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage} disabled={loading}>
                {loading ? '...' : 'Send'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-end">
          <Button onClick={() => setOpen(true)} className="rounded-full shadow-xl">
            <MessageCircle className="mr-2" /> Chat with Task AI
          </Button>
        </div>
      )}
    </div>
  );
}
