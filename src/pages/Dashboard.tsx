import { useAuth } from '@/hooks/useAuth'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Signed in as: {user?.email}</p>
      <button onClick={signOut} className="px-3 py-2 rounded bg-neutral-900 text-white">Sign out</button>
    </div>
  )
}


