import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { ChatMessage, ChatMessageProps } from './ChatMessage'
import { Send, Paperclip, Mic, StopCircle } from 'lucide-react'
import { useState, useRef, useEffect, ReactNode } from 'react'

export interface ChatInterfaceProps {
  messages: ChatMessageProps[]
  onSendMessage: (message: string) => void
  placeholder?: string
  loading?: boolean
  disabled?: boolean
  header?: ReactNode
  footer?: ReactNode
  suggestedPrompts?: string[]
  enableVoice?: boolean
  enableAttachments?: boolean
  maxHeight?: string
  className?: string
}

/**
 * ChatInterface - Complete chat UI with messages and input
 * 
 * Perfect for: AI assistants, customer support, messaging
 * 
 * @example
 * ```tsx
 * const [messages, setMessages] = useState<ChatMessageProps[]>([])
 * 
 * <ChatInterface
 *   messages={messages}
 *   onSendMessage={(msg) => handleSendMessage(msg)}
 *   placeholder="Ask me anything..."
 *   suggestedPrompts={["How do I...", "Tell me about..."]}
 *   enableVoice
 * />
 * ```
 */
export function ChatInterface({
  messages,
  onSendMessage,
  placeholder = 'Type a message...',
  loading = false,
  disabled = false,
  header,
  footer,
  suggestedPrompts,
  enableVoice = false,
  enableAttachments = false,
  maxHeight = '600px',
  className,
}: ChatInterfaceProps) {
  const { config, classes } = useBrand()
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || loading || disabled) return
    onSendMessage(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Card className={cn(
      'flex flex-col overflow-hidden',
      config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur-sm',
      config.preferredCardStyle === 'elevated' && classes.shadow,
      config.preferredCardStyle === 'bordered' && 'border-2',
      className
    )}>
      {/* Header */}
      {header && (
        <div className="border-b p-4">
          {header}
        </div>
      )}
      
      {/* Messages area */}
      <ScrollArea 
        ref={scrollRef}
        className="flex-1"
        style={{ maxHeight }}
      >
        <div className={cn('p-4 space-y-4', config.spacing === 'spacious' && 'space-y-6')}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="rounded-full bg-primary/10 p-6">
                <svg
                  className="h-12 w-12 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Start a conversation</h3>
                <p className="text-sm text-muted-foreground">
                  Send a message to get started
                </p>
              </div>
              
              {/* Suggested prompts */}
              {suggestedPrompts && suggestedPrompts.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {suggestedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => onSendMessage(prompt)}
                      disabled={loading || disabled}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))
          )}
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          {/* Attachments button */}
          {enableAttachments && (
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          )}
          
          {/* Text input */}
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={loading || disabled}
              rows={1}
              className="min-h-[40px] resize-none"
            />
          </div>
          
          {/* Voice button */}
          {enableVoice && (
            <Button
              variant={isRecording ? 'destructive' : 'ghost'}
              size="icon"
              onClick={() => setIsRecording(!isRecording)}
              disabled={disabled}
            >
              {isRecording ? (
                <StopCircle className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
          )}
          
          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading || disabled}
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Footer */}
      {footer && (
        <div className="border-t p-4">
          {footer}
        </div>
      )}
    </Card>
  )
}

