import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { useState, useRef } from 'react'

export interface HeroVideoProps {
  // Content
  badge?: string
  title: string
  subtitle: string
  
  // Actions
  primaryCta: string
  onPrimaryClick?: () => void
  secondaryCta?: string
  onSecondaryClick?: () => void
  
  // Video
  videoUrl: string
  posterImage?: string
  
  // Layout
  overlayOpacity?: number // 0-100
  contentPosition?: 'center' | 'left' | 'bottom'
  
  // Controls
  showVideoControls?: boolean
  autoPlay?: boolean
  loop?: boolean
  
  // Styling
  className?: string
}

/**
 * HeroVideo - Full-width video background hero
 * 
 * Perfect for: Apps, games, creative products, events
 * Style: Immersive video background with overlay content
 * 
 * @example
 * ```tsx
 * <HeroVideo
 *   title="Experience the Future"
 *   subtitle="Revolutionary platform that changes everything"
 *   primaryCta="Watch Demo"
 *   videoUrl="/hero-video.mp4"
 *   posterImage="/poster.jpg"
 *   overlayOpacity={60}
 * />
 * ```
 */
export function HeroVideo({
  badge,
  title,
  subtitle,
  primaryCta,
  onPrimaryClick,
  secondaryCta,
  onSecondaryClick,
  videoUrl,
  posterImage,
  overlayOpacity = 50,
  contentPosition = 'center',
  showVideoControls = true,
  autoPlay = true,
  loop = true,
  className,
}: HeroVideoProps) {
  const { classes } = useBrand()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(true)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section className={cn(
      'relative overflow-hidden min-h-screen flex items-center',
      className
    )}>
      {/* Video Background */}
      <div className="absolute inset-0 -z-10">
        <video
          ref={videoRef}
          autoPlay={autoPlay}
          loop={loop}
          muted={isMuted}
          playsInline
          poster={posterImage}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-background"
          style={{ opacity: overlayOpacity / 100 }}
        />
        
        {/* Gradient overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/80" />
      </div>

      {/* Video Controls */}
      {showVideoControls && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 right-8 flex gap-2 z-20"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            className="bg-background/80 backdrop-blur"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className="bg-background/80 backdrop-blur"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className={cn(
          'max-w-4xl',
          contentPosition === 'center' && 'mx-auto text-center',
          contentPosition === 'bottom' && 'mt-auto'
        )}>
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(
                contentPosition === 'center' && 'flex justify-center',
                'mb-6'
              )}
            >
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-sm bg-background/80 backdrop-blur border-primary/20"
              >
                {badge}
              </Badge>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={cn(
              'text-5xl md:text-6xl lg:text-7xl font-bold mb-6',
              classes.headingTracking,
              'drop-shadow-lg'
            )}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl md:text-2xl text-foreground/90 mb-8 drop-shadow"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={cn(
              'flex flex-wrap gap-4',
              contentPosition === 'center' && 'justify-center'
            )}
          >
            <Button 
              size="lg" 
              onClick={onPrimaryClick}
              className="shadow-xl bg-primary hover:bg-primary/90 backdrop-blur"
            >
              {primaryCta}
            </Button>
            
            {secondaryCta && (
              <Button 
                size="lg" 
                variant="outline" 
                onClick={onSecondaryClick}
                className="bg-background/80 backdrop-blur"
              >
                {secondaryCta}
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1, 
          delay: 1,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/60"
      >
        <span className="text-sm">Scroll</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}

