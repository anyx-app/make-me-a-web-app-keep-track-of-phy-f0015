import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { signIn, signUp } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      type AuthLocationState = { from?: { pathname?: string } }
      const to = (location.state as AuthLocationState | undefined)?.from?.pathname || '/dashboard'
      navigate(to, { replace: true })
    }
  }, [user, location, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = isSignUp ? await signUp(email, password) : await signIn(email, password)
      
      if (response.error) {
        setError(response.error)
      } else if (isSignUp) {
        setError('Account created! Please sign in.')
        setIsSignUp(false)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-accent/5">
      <Card className="w-full max-w-md border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-primary">BookHarmony</CardTitle>
            <CardDescription className="text-base mt-2">
              {isSignUp ? 'Create your account' : 'Sign in to your library'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
              }}
              className="text-primary hover:underline font-medium"
              type="button"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
