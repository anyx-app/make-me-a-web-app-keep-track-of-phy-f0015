import { useEffect, useState } from 'react'
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { getSupabase } from '@/sdk/supabase'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (user) {
      type AuthLocationState = { from?: { pathname?: string } }
      const to = (location.state as AuthLocationState | undefined)?.from?.pathname || '/dashboard'
      navigate(to, { replace: true })
    }
  }, [user, location, navigate])

  const handleBasicLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // This is a placeholder - implement your own auth logic here
    console.log('Login attempt:', { email, password })
    alert('Configure Supabase or implement your own authentication')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <Card className="w-full max-w-md">
        {getSupabase() ? (
          <SupabaseAuth
            supabaseClient={getSupabase()!}
            providers={["google", "github"]}
            appearance={{ theme: ThemeSupa }}
            view="sign_in"
            onlyThirdPartyProviders={false}
            showLinks
            socialLayout="horizontal"
          />
        ) : (
          <>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBasicLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
                <div className="text-center">
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                    Forgot password?
                  </a>
                </div>
              </form>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>Don't have an account? <a href="#" className="text-primary hover:underline">Sign up</a></p>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
