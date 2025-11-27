import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { Star, Check } from 'lucide-react'
import { ReactNode } from 'react'

export interface HeroProductProps {
  // Content
  badge?: string
  title: string
  subtitle: string
  
  // Pricing
  price?: {
    amount: string
    period?: string
    originalPrice?: string
  }
  
  // Social proof
  rating?: {
    score: number
    count: number
  }
  trustBadges?: Array<{
    icon?: ReactNode
    text: string
  }>
  
  // Actions
  primaryCta: string
  onPrimaryClick?: () => void
  secondaryCta?: string
  onSecondaryClick?: () => void
  
  // Product images
  productImage: string
  additionalImages?: string[]
  
  // Features
  keyFeatures?: string[]
  
  // Styling
  className?: string
}

/**
 * HeroProduct - E-commerce/product-focused hero
 * 
 * Perfect for: E-commerce, product launches, landing pages
 * Style: Product showcase with pricing and social proof
 * 
 * @example
 * ```tsx
 * <HeroProduct
 *   badge="Limited Edition"
 *   title="Premium Wireless Headphones"
 *   subtitle="Studio-quality sound meets modern design"
 *   price={{ amount: "$299", originalPrice: "$399", period: "one-time" }}
 *   rating={{ score: 4.8, count: 1234 }}
 *   primaryCta="Buy Now"
 *   productImage="/product.png"
 *   keyFeatures={["Free shipping", "2-year warranty", "30-day returns"]}
 * />
 * ```
 */
export function HeroProduct({
  badge,
  title,
  subtitle,
  price,
  rating,
  trustBadges,
  primaryCta,
  onPrimaryClick,
  secondaryCta,
  onSecondaryClick,
  productImage,
  additionalImages,
  keyFeatures,
  className,
}: HeroProductProps) {
  const { config, classes } = useBrand()

  return (
    <section className={cn(
      'relative overflow-hidden',
      classes.sectionPadding,
      config.backgroundTreatment === 'gradient' && 'bg-gradient-to-br from-background via-muted/20 to-background',
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Product Image Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Main product image */}
            <div className="relative">
              <div className={cn(
                'relative rounded-2xl overflow-hidden',
                config.preferredCardStyle === 'elevated' && 'shadow-2xl',
                config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur border border-border'
              )}>
                <img
                  src={productImage}
                  alt={title}
                  className="w-full h-auto"
                />
              </div>

              {/* Badge overlay */}
              {badge && (
                <div className="absolute top-4 left-4">
                  <Badge className="px-3 py-1 shadow-lg bg-primary text-primary-foreground">
                    {badge}
                  </Badge>
                </div>
              )}

              {/* Background glow */}
              {config.flavor === 'playful' || config.flavor === 'tech' && (
                <div className="absolute -inset-8 bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl opacity-50 -z-10" />
              )}
            </div>

            {/* Additional images */}
            {additionalImages && additionalImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex gap-4 mt-4"
              >
                {additionalImages.map((img, index) => (
                  <div
                    key={index}
                    className={cn(
                      'w-20 h-20 rounded-lg overflow-hidden cursor-pointer',
                      'hover:ring-2 hover:ring-primary transition-all',
                      classes.shadow
                    )}
                  >
                    <img
                      src={img}
                      alt={`${title} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'h-5 w-5',
                        i < Math.floor(rating.score)
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground'
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating.score} ({rating.count.toLocaleString()} reviews)
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className={cn(
              'text-4xl md:text-5xl lg:text-6xl font-bold',
              classes.headingTracking
            )}>
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground">
              {subtitle}
            </p>

            {/* Price */}
            {price && (
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold">
                  {price.amount}
                </span>
                {price.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {price.originalPrice}
                  </span>
                )}
                {price.period && (
                  <span className="text-sm text-muted-foreground">
                    {price.period}
                  </span>
                )}
              </div>
            )}

            {/* Key Features */}
            {keyFeatures && keyFeatures.length > 0 && (
              <div className="space-y-2">
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                onClick={onPrimaryClick}
                className={cn('shadow-lg', classes.transition)}
              >
                {primaryCta}
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
            </div>

            {/* Trust badges */}
            {trustBadges && trustBadges.length > 0 && (
              <div className="flex flex-wrap gap-6 pt-4 border-t">
                {trustBadges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    {badge.icon}
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

