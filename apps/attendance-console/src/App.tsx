import { useState } from 'react'
import { Button } from '@/components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-foreground text-3xl font-semibold tracking-tight">
          Attendance Console
        </h1>
        <p className="text-muted-foreground">
          Tailwind CSS and shadcn/ui are ready to go.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => setCount((c) => c + 1)}>Count is {count}</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </div>
  )
}

export default App
