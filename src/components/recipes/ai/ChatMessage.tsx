import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react'
import { ReactNode } from 'react'

export interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system'
  content: string | ReactNode
  avatar?: string
  name?: string
  timestamp?: Date | string
  loading?: boolean
  error?: boolean
  onCopy?: () => void
  onFeedback?: (type: 'positive' | 'negative') => void
  onRetry?: () => void
  className?: string
}

/**
 * ChatMessage - Professional chat message component
 * 
 * Perfect for: AI assistants, chatbots, messaging apps
 * 
 * @example
 * ```tsx
 * <ChatMessage
 *   role="assistant"
 *   content="I can help you with that! Here's what I found..."
 *   avatar="/ai-avatar.png"
 *   name="AI Assistant"
 *   onCopy={() => copyToClipboard()}
 *   onFeedback={(type) => sendFeedback(type)}
 * />
 * ```
 */
export function ChatMessage({
  role,
  content,
  avatar,
  name,
  timestamp,
  loading = false,
  error = false,
  onCopy,
  onFeedback,
  onRetry,
  className,
}: ChatMessageProps) {
  const { config } = useBrand()
  
  const isUser = role === 'user'
  const isSystem = role === 'system'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3',
        isUser && 'flex-row-reverse',
        isSystem && 'justify-center',
        className
      )}
    >
      {!isSystem && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className={cn(
            isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
          )}>
            {name?.[0] || (isUser ? 'U' : 'AI')}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        'flex flex-col gap-1',
        isUser ? 'items-end' : 'items-start',
        'flex-1 max-w-[80%]'
      )}>
        {/* Name and timestamp */}
        {(name || timestamp) && !isSystem && (
          <div className={cn(
            'flex items-center gap-2 text-xs text-muted-foreground',
            isUser && 'flex-row-reverse'
          )}>
            {name && <span className="font-medium">{name}</span>}
            {timestamp && (
              <span>
                {typeof timestamp === 'string' 
                  ? timestamp 
                  : timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              </span>
            )}
          </div>
        )}
        
        {/* Message bubble */}
        <Card className={cn(
          'inline-block px-4 py-3',
          isUser && 'bg-primary text-primary-foreground',
          isSystem && 'bg-muted/50 text-center text-sm text-muted-foreground',
          error && 'border-destructive bg-destructive/10',
          config.borderRadius,
          !isUser && !isSystem && (
            config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur-sm'
          )
        )}>
          {loading ? (
            <TypingIndicator />
          ) : (
            <div className={cn(
              'prose prose-sm dark:prose-invert max-w-none',
              isUser && 'text-primary-foreground'
            )}>
              {typeof content === 'string' ? (
                <p className="m-0">{content}</p>
              ) : (
                content
              )}
            </div>
          )}
        </Card>
        
        {/* Action buttons (assistant messages only) */}
        {!isUser && !isSystem && !loading && !error && (
          <div className="flex items-center gap-1">
            {onCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
                className="h-7 px-2 text-xs"
              >
                <Copy className="h-3 w-3" />
              </Button>
            )}
            {onFeedback && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback('positive')}
                  className="h-7 px-2 text-xs"
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback('negative')}
                  className="h-7 px-2 text-xs"
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        )}
        
        {/* Retry button (error state) */}
        {error && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-2"
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Retry
          </Button>
        )}
      </div>
    </motion.div>
  )
}

/**
 * TypingIndicator - Animated typing indicator
 */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-current opacity-60"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

