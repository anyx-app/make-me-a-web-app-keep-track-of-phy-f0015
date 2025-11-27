import { motion } from 'framer-motion'

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <img 
          src="/anyx-logo.png" 
          alt="AnyX Logo" 
          className="w-32 h-32 mx-auto mb-8 opacity-90"
        />
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          AnyX
        </h1>
        <p className="text-xl text-muted-foreground">
          Your React Boilerplate
        </p>
      </motion.div>
    </div>
  )
}
