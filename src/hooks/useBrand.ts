import { useEffect } from 'react'
import { useTheme } from '@/theme/ThemeProvider'
import { 
  getBrandConfig, 
  getBrandClasses, 
  type BrandFlavor,
  getBrandFlavorConfig
} from '@/config/brand'

/**
 * Hook to access brand configuration and utilities
 * 
 * @example
 * ```tsx
 * function HeroSection() {
 *   const { config, classes, isMinimal, isBold } = useBrand()
 *   
 *   return (
 *     <section className={classes.sectionPadding}>
 *       {config.preferredHero === 'gradient' ? (
 *         <HeroGradient />
 *       ) : (
 *         <HeroMinimal />
 *       )}
 *     </section>
 *   )
 * }
 * ```
 */
export function useBrand() {
  const { setTheme } = useTheme()
  const config = getBrandConfig()
  const classes = getBrandClasses(config)

  // Auto-apply theme when brand config changes
  useEffect(() => {
    setTheme(config.theme)
  }, [config.theme, setTheme])

  return {
    // Configuration
    config,
    classes,
    
    // Flavor checks (for conditional rendering)
    isMinimal: config.flavor === 'minimal',
    isBold: config.flavor === 'bold',
    isPlayful: config.flavor === 'playful',
    isCorporate: config.flavor === 'corporate',
    isLuxury: config.flavor === 'luxury',
    isTech: config.flavor === 'tech',
    isWarm: config.flavor === 'warm',
    isDark: config.flavor === 'dark',
    
    // Industry checks
    isSaaS: config.industry === 'saas',
    isFinance: config.industry === 'finance',
    isHealth: config.industry === 'health',
    isCreative: config.industry === 'creative',
    isGaming: config.industry === 'gaming',
    isAI: config.industry === 'ai',
    
    // Utility functions
    getFlavorConfig: (flavor: BrandFlavor) => getBrandFlavorConfig(flavor),
    getClasses: (flavor?: BrandFlavor) => 
      flavor ? getBrandClasses(getBrandFlavorConfig(flavor)) : classes,
  }
}

/**
 * Get brand-aware animation variants for Framer Motion
 */
export function useBrandAnimations() {
  const { config } = useBrand()
  
  const intensity = {
    subtle: { distance: 10, scale: 1.02, duration: 0.4 },
    moderate: { distance: 20, scale: 1.05, duration: 0.5 },
    playful: { distance: 30, scale: 1.1, duration: 0.6 },
  }[config.animations]

  return {
    fadeInUp: {
      initial: { opacity: 0, y: intensity.distance },
      animate: { opacity: 1, y: 0 },
      transition: { duration: intensity.duration },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: intensity.duration },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: intensity.duration },
    },
    hoverLift: {
      whileHover: { y: -intensity.distance / 2, scale: intensity.scale },
      transition: { duration: 0.2 },
    },
    staggerContainer: {
      animate: {
        transition: {
          staggerChildren: intensity.duration / 4,
        },
      },
    },
  }
}

