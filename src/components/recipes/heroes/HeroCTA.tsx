import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'

export interface PricingTier {
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  cta: string
  highlighted?: boolean
}

export interface HeroCTAProps {
  // Content
  badge?: string
  title: string
  subtitle: string
  
  // Lead capture
  showEmailCapture?: boolean
  emailPlaceholder?: string
  emailCta?: string
  onEmailSubmit?: (email: string) => void
  
  // Pricing tiers
  pricingTiers?: PricingTier[]
  
  // Social proof
  customerLogos?: string[]
  testimonial?: {
    quote: string
    author: string
    role: string
    avatar?: string
  }
  
  // Trust elements
  guaranteeText?: string
  
  // Styling
  className?: string
}

/**
 * HeroCTA - Conversion-focused hero with pricing/capture
 * 
 * Perfect for: SaaS pricing pages, product launches, campaigns
 * Style: Focused on conversion with clear pricing tiers
 * 
 * @example
 * ```tsx
 * <HeroCTA
 *   badge="Limited Time Offer"
 *   title="Start Building Today"
 *   subtitle="Choose the perfect plan for your needs"
 *   showEmailCapture
 *   pricingTiers={[
 *     {
 *       name: "Starter",
 *       price: "$29",
 *       period: "/ month",
 *       features: ["Feature 1", "Feature 2"],
 *       cta: "Start Free Trial"
 *     }
 *   ]}
 * />
 * ```
 */
export function HeroCTA({
  badge,
  title,
  subtitle,
  showEmailCapture = false,
  emailPlaceholder = 'Enter your email',
  emailCta = 'Get Started',
  onEmailSubmit,
  pricingTiers,
  customerLogos,
  testimonial,
  guaranteeText,
  className,
}: HeroCTAProps) {
  const { config, classes } = useBrand()
  const [email, setEmail] = useState('')

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && onEmailSubmit) {
      onEmailSubmit(email)
      setEmail('')
    }
  }

  return (
    <section className={cn(
      'relative overflow-hidden',
      classes.sectionPadding,
      config.backgroundTreatment === 'gradient' && 'bg-gradient-to-b from-background via-muted/30 to-background',
      className
    )}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-6"
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

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={cn(
              'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
              classes.headingTracking
            )}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8"
          >
            {subtitle}
          </motion.p>

          {/* Email Capture */}
          {showEmailCapture && (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8"
            >
              <Input
                type="email"
                placeholder={emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" size="lg">
                {emailCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.form>
          )}

          {/* Guarantee text */}
          {guaranteeText && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-muted-foreground"
            >
              {guaranteeText}
            </motion.p>
          )}
        </div>

        {/* Pricing Tiers */}
        {pricingTiers && pricingTiers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={cn(
              'grid gap-6 max-w-6xl mx-auto',
              {
                1: 'grid-cols-1 max-w-md',
                2: 'grid-cols-1 md:grid-cols-2',
                3: 'grid-cols-1 md:grid-cols-3',
              }[Math.min(pricingTiers.length, 3)]
            )}
          >
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={cn(
                  'relative p-8',
                  tier.highlighted && 'border-primary border-2 shadow-xl',
                  config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur',
                  config.preferredCardStyle === 'elevated' && classes.shadow,
                  classes.transition
                )}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  {tier.description && (
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  )}
                </div>

                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">{tier.price}</span>
                  {tier.period && (
                    <span className="text-muted-foreground ml-2">{tier.period}</span>
                  )}
                </div>

                <Button
                  className="w-full mb-6"
                  size="lg"
                  variant={tier.highlighted ? 'default' : 'outline'}
                >
                  {tier.cta}
                </Button>

                <div className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Customer Logos */}
        {customerLogos && customerLogos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-muted-foreground mb-6">
              Trusted by leading companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:opacity-80 hover:grayscale-0 transition-all">
              {customerLogos.map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  alt={`Customer ${index + 1}`}
                  className="h-8 object-contain"
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Testimonial */}
        {testimonial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <Card className="p-8 text-center">
              <blockquote className="text-lg mb-4">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div className="text-left">
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  )
}

