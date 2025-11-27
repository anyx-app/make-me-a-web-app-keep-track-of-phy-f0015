import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeInLeft, fadeInRight } from '../animations'

interface FeatureShowcaseProps {
  title: string
  description: string
  features: Array<{ title: string; description: string }>
  imageSide?: 'left' | 'right'
  className?: string
}

export function FeatureShowcase({
  title,
  description,
  features,
  imageSide = 'right',
  className,
}: FeatureShowcaseProps) {
  const imageContent = (
    <motion.div
      className="relative w-full h-[400px] rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-sm border border-border"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={imageSide === 'right' ? fadeInRight : fadeInLeft}
    >
      {/* Placeholder for actual image/component */}
      <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-50">
        🎨
      </div>
    </motion.div>
  )

  const textContent = (
    <motion.div
      className="space-y-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={imageSide === 'right' ? fadeInLeft : fadeInRight}
    >
      <div>
        <h2 className="text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl text-muted-foreground">{description}</p>
      </div>
      
      <div className="space-y-4">
        {features.map((feature, idx) => (
          <div key={idx} className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {idx + 1}
            </div>
            <div>
              <h4 className="font-semibold mb-1">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <section className={cn('py-20 px-4', className)}>
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {imageSide === 'left' ? (
          <>
            {imageContent}
            {textContent}
          </>
        ) : (
          <>
            {textContent}
            {imageContent}
          </>
        )}
      </div>
    </section>
  )
}

