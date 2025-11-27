/**
 * Brand Configuration System
 * 
 * This file defines the visual personality and style preferences for your application.
 * AI agents use this to generate consistent, branded UIs.
 * 
 * Change `activeFlavor` to instantly rebrand your entire application.
 */

export type BrandFlavor = 
  | 'minimal'      // Clean SaaS, Apple-like
  | 'bold'         // High energy, startup vibes
  | 'playful'      // Fun, creative, colorful
  | 'corporate'    // Professional, enterprise
  | 'luxury'       // Elegant, premium, refined
  | 'tech'         // Futuristic, cutting-edge
  | 'warm'         // Friendly, approachable
  | 'dark'         // Modern, sleek, dramatic

export type SpacingDensity = 'tight' | 'comfortable' | 'spacious'
export type AnimationIntensity = 'subtle' | 'moderate' | 'playful'
export type ColorVibrancy = 'muted' | 'balanced' | 'vibrant'

export interface BrandFlavorConfig {
  // Visual Identity
  flavor: BrandFlavor
  theme: string // Theme ID from theme registry
  
  // Logo & Assets
  logo: string
  logoSize: 'sm' | 'md' | 'lg'
  
  // Typography
  headingStyle: 'tight' | 'normal' | 'relaxed'
  bodySize: 'sm' | 'base' | 'lg'
  
  // Layout & Spacing
  spacing: SpacingDensity
  containerWidth: 'narrow' | 'normal' | 'wide' | 'full'
  
  // Visual Style
  colorVibrancy: ColorVibrancy
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  shadowIntensity: 'none' | 'subtle' | 'normal' | 'dramatic'
  
  // Animation
  animations: AnimationIntensity
  transitionSpeed: 'fast' | 'normal' | 'slow'
  
  // Component Preferences
  preferredHero: 'minimal' | 'gradient' | 'spotlight' | 'video' | 'split'
  preferredFeatureLayout: 'grid' | 'bento' | 'showcase'
  preferredCardStyle: 'flat' | 'elevated' | 'bordered' | 'glass'
  
  // Background Style
  backgroundTreatment: 'solid' | 'gradient' | 'pattern' | 'mesh'
  
  // Industry Context (helps AI make better decisions)
  industry?: 'saas' | 'ecommerce' | 'finance' | 'health' | 'education' | 'creative' | 'gaming' | 'ai' | 'other'
  
  // Target Audience
  audience?: 'b2b' | 'b2c' | 'developer' | 'enterprise' | 'consumer'
}

/**
 * Pre-configured brand flavors
 * Each flavor defines a complete visual personality
 */
export const brandFlavors: Record<BrandFlavor, BrandFlavorConfig> = {
  minimal: {
    flavor: 'minimal',
    theme: 'default-light',
    logo: '/anyx-logo.png',
    logoSize: 'md',
    headingStyle: 'tight',
    bodySize: 'base',
    spacing: 'spacious',
    containerWidth: 'narrow',
    colorVibrancy: 'muted',
    borderRadius: 'sm',
    shadowIntensity: 'subtle',
    animations: 'subtle',
    transitionSpeed: 'fast',
    preferredHero: 'minimal',
    preferredFeatureLayout: 'showcase',
    preferredCardStyle: 'flat',
    backgroundTreatment: 'solid',
    industry: 'saas',
    audience: 'b2b',
  },
  
  bold: {
    flavor: 'bold',
    theme: 'sunset-light',
    logo: '/anyx-logo.png',
    logoSize: 'lg',
    headingStyle: 'tight',
    bodySize: 'lg',
    spacing: 'tight',
    containerWidth: 'wide',
    colorVibrancy: 'vibrant',
    borderRadius: 'lg',
    shadowIntensity: 'dramatic',
    animations: 'playful',
    transitionSpeed: 'fast',
    preferredHero: 'gradient',
    preferredFeatureLayout: 'bento',
    preferredCardStyle: 'elevated',
    backgroundTreatment: 'gradient',
    industry: 'saas',
    audience: 'b2c',
  },
  
  playful: {
    flavor: 'playful',
    theme: 'sunset-light',
    logo: '/anyx-logo.png',
    logoSize: 'lg',
    headingStyle: 'relaxed',
    bodySize: 'lg',
    spacing: 'comfortable',
    containerWidth: 'normal',
    colorVibrancy: 'vibrant',
    borderRadius: 'full',
    shadowIntensity: 'normal',
    animations: 'playful',
    transitionSpeed: 'normal',
    preferredHero: 'gradient',
    preferredFeatureLayout: 'grid',
    preferredCardStyle: 'elevated',
    backgroundTreatment: 'mesh',
    industry: 'creative',
    audience: 'b2c',
  },
  
  corporate: {
    flavor: 'corporate',
    theme: 'professional-light',
    logo: '/anyx-logo.png',
    logoSize: 'sm',
    headingStyle: 'normal',
    bodySize: 'base',
    spacing: 'comfortable',
    containerWidth: 'wide',
    colorVibrancy: 'muted',
    borderRadius: 'sm',
    shadowIntensity: 'subtle',
    animations: 'subtle',
    transitionSpeed: 'normal',
    preferredHero: 'split',
    preferredFeatureLayout: 'grid',
    preferredCardStyle: 'bordered',
    backgroundTreatment: 'solid',
    industry: 'finance',
    audience: 'enterprise',
  },
  
  luxury: {
    flavor: 'luxury',
    theme: 'default-dark',
    logo: '/anyx-logo.png',
    logoSize: 'md',
    headingStyle: 'relaxed',
    bodySize: 'lg',
    spacing: 'spacious',
    containerWidth: 'narrow',
    colorVibrancy: 'muted',
    borderRadius: 'none',
    shadowIntensity: 'subtle',
    animations: 'subtle',
    transitionSpeed: 'slow',
    preferredHero: 'minimal',
    preferredFeatureLayout: 'showcase',
    preferredCardStyle: 'flat',
    backgroundTreatment: 'solid',
    industry: 'other',
    audience: 'b2c',
  },
  
  tech: {
    flavor: 'tech',
    theme: 'ocean-dark',
    logo: '/anyx-logo.png',
    logoSize: 'md',
    headingStyle: 'tight',
    bodySize: 'base',
    spacing: 'comfortable',
    containerWidth: 'wide',
    colorVibrancy: 'vibrant',
    borderRadius: 'md',
    shadowIntensity: 'dramatic',
    animations: 'moderate',
    transitionSpeed: 'fast',
    preferredHero: 'spotlight',
    preferredFeatureLayout: 'bento',
    preferredCardStyle: 'glass',
    backgroundTreatment: 'mesh',
    industry: 'ai',
    audience: 'developer',
  },
  
  warm: {
    flavor: 'warm',
    theme: 'sunset-light',
    logo: '/anyx-logo.png',
    logoSize: 'md',
    headingStyle: 'normal',
    bodySize: 'lg',
    spacing: 'comfortable',
    containerWidth: 'normal',
    colorVibrancy: 'balanced',
    borderRadius: 'lg',
    shadowIntensity: 'normal',
    animations: 'moderate',
    transitionSpeed: 'normal',
    preferredHero: 'gradient',
    preferredFeatureLayout: 'showcase',
    preferredCardStyle: 'elevated',
    backgroundTreatment: 'gradient',
    industry: 'health',
    audience: 'b2c',
  },
  
  dark: {
    flavor: 'dark',
    theme: 'default-dark',
    logo: '/anyx-logo.png',
    logoSize: 'md',
    headingStyle: 'tight',
    bodySize: 'base',
    spacing: 'comfortable',
    containerWidth: 'wide',
    colorVibrancy: 'vibrant',
    borderRadius: 'lg',
    shadowIntensity: 'dramatic',
    animations: 'moderate',
    transitionSpeed: 'normal',
    preferredHero: 'spotlight',
    preferredFeatureLayout: 'bento',
    preferredCardStyle: 'glass',
    backgroundTreatment: 'mesh',
    industry: 'gaming',
    audience: 'consumer',
  },
}

/**
 * Active brand configuration
 * Change this to rebrand your entire application
 */
export const activeFlavor: BrandFlavor = 'minimal'

/**
 * Get the current brand configuration
 */
export function getBrandConfig(): BrandFlavorConfig {
  return brandFlavors[activeFlavor]
}

/**
 * Get brand config for a specific flavor
 */
export function getBrandFlavorConfig(flavor: BrandFlavor): BrandFlavorConfig {
  return brandFlavors[flavor]
}

/**
 * Utility: Get Tailwind classes based on brand config
 */
export function getBrandClasses(config = getBrandConfig()) {
  return {
    // Container
    container: `max-w-${config.containerWidth === 'narrow' ? '4xl' : config.containerWidth === 'normal' ? '6xl' : config.containerWidth === 'wide' ? '7xl' : 'full'}`,
    
    // Spacing
    sectionPadding: config.spacing === 'tight' ? 'py-12' : config.spacing === 'comfortable' ? 'py-20' : 'py-32',
    cardPadding: config.spacing === 'tight' ? 'p-4' : config.spacing === 'comfortable' ? 'p-6' : 'p-8',
    
    // Border radius
    borderRadius: `rounded-${config.borderRadius}`,
    
    // Shadows
    shadow: config.shadowIntensity === 'none' ? '' : 
            config.shadowIntensity === 'subtle' ? 'shadow-sm' :
            config.shadowIntensity === 'normal' ? 'shadow-md' : 'shadow-xl',
    
    // Typography
    headingTracking: config.headingStyle === 'tight' ? 'tracking-tight' : 
                     config.headingStyle === 'normal' ? 'tracking-normal' : 'tracking-wide',
    bodySize: `text-${config.bodySize}`,
    
    // Transitions
    transition: config.transitionSpeed === 'fast' ? 'transition-all duration-150' :
                config.transitionSpeed === 'normal' ? 'transition-all duration-300' :
                'transition-all duration-500',
  }
}

