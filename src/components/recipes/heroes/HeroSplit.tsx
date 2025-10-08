import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { ArrowRight, Play } from 'lucide-react'
import { ReactNode } from 'react'

export interface HeroSplitProps {
  // Content
  badge?: string
  title: string
  subtitle: string
  description?: string
  
  // Actions
  primaryCta: string
  primaryCtaIcon?: ReactNode
  onPrimaryClick?: () => void
  secondaryCta?: string
  onSecondaryClick?: () => void
  
  // Media (right side)
  image?: string
  video?: string
  customMedia?: ReactNode
  
  // Layout
  imagePosition?: 'left' | 'right'
  contentAlignment?: 'left' | 'center'
  
  // Features list
  features?: Array<{
    icon?: ReactNode
    text: string
  }>
  
  // Styling
  className?: string
}

/**
 * HeroSplit - Modern split-screen hero with image/video
 * 
 * Perfect for: SaaS products, apps, B2B services
 * Layout: Content on one side, visual on the other
 * 
 * @example
 * ```tsx
 * <HeroSplit
 *   badge="New Release"
 *   title="Build Faster with AI"
 *   subtitle="The most powerful development platform"
 *   primaryCta="Start Free Trial"
 *   image="/product-screenshot.png"
 *   features={[
 *     { text: "No credit card required" },
 *     { text: "14-day free trial" },
 *   ]}
 * />
 * ```
 */
export function HeroSplit({
  badge,
  title,
  subtitle,
  description,
  primaryCta,
  primaryCtaIcon,
  onPrimaryClick,
  secondaryCta,
  onSecondaryClick,
  image,
  video,
  customMedia,
  imagePosition = 'right',
  contentAlignment = 'left',
  features,
  className,
}: HeroSplitProps) {
  const { config, classes } = useBrand()

  const contentSide = imagePosition === 'right' ? 'left' : 'right'

  return (
    <section className={cn(
      'relative overflow-hidden',
      classes.sectionPadding,
      config.backgroundTreatment === 'gradient' && 'bg-gradient-to-b from-background via-background to-muted/20',
      className
    )}>
      <div className="container mx-auto px-4">
        <div className={cn(
          'grid gap-12 lg:grid-cols-2 lg:gap-16 items-center',
          imagePosition === 'left' && 'lg:flex-row-reverse'
        )}>
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: contentSide === 'left' ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className={cn(
              imagePosition === 'left' && 'lg:order-2',
              contentAlignment === 'center' && 'text-center mx-auto',
              'max-w-2xl'
            )}
          >
            {/* Badge */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={cn(
                  contentAlignment === 'center' && 'flex justify-center',
                  'mb-6'
                )}
              >
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'px-4 py-2 text-sm',
                    config.colorVibrancy === 'vibrant' && 'bg-primary/10 text-primary border-primary/20'
                  )}
                >
                  {badge}
                </Badge>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn(
                'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
                classes.headingTracking
              )}
            >
              {title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl md:text-2xl text-muted-foreground mb-6"
            >
              {subtitle}
            </motion.p>

            {/* Description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg text-muted-foreground mb-8"
              >
                {description}
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className={cn(
                'flex flex-wrap gap-4 mb-8',
                contentAlignment === 'center' && 'justify-center'
              )}
            >
              <Button 
                size="lg" 
                onClick={onPrimaryClick}
                className={cn('shadow-lg', classes.transition)}
              >
                {primaryCta}
                {primaryCtaIcon || <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
              
              {secondaryCta && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={onSecondaryClick}
                  className={classes.transition}
                >
                  {secondaryCta}
                </Button>
              )}
            </motion.div>

            {/* Features List */}
            {features && features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className={cn(
                  'flex flex-wrap gap-6',
                  contentAlignment === 'center' && 'justify-center'
                )}
              >
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    {feature.icon || (
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Media Side */}
          <motion.div
            initial={{ opacity: 0, x: imagePosition === 'right' ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              'relative',
              imagePosition === 'left' && 'lg:order-1'
            )}
          >
            {customMedia ? (
              customMedia
            ) : video ? (
              <div className={cn(
                'relative rounded-xl overflow-hidden',
                classes.shadow,
                config.preferredCardStyle === 'glass' && 'border border-border/50 backdrop-blur'
              )}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                >
                  <source src={video} type="video/mp4" />
                </video>
              </div>
            ) : image ? (
              <div className={cn(
                'relative rounded-xl overflow-hidden',
                classes.shadow,
                config.preferredCardStyle === 'glass' && 'border border-border/50'
              )}>
                <img
                  src={image}
                  alt={title}
                  className="w-full h-auto"
                />
                
                {/* Decorative elements for tech/playful flavors */}
                {(config.flavor === 'tech' || config.flavor === 'playful') && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
                )}
              </div>
            ) : (
              // Placeholder
              <div className={cn(
                'relative rounded-xl overflow-hidden bg-muted aspect-video flex items-center justify-center',
                classes.shadow
              )}>
                <Play className="h-16 w-16 text-muted-foreground" />
              </div>
            )}

            {/* Background decoration */}
            {config.backgroundTreatment !== 'solid' && (
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-transparent blur-3xl opacity-50 -z-10" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

