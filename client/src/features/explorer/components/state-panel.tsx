import { AlertCircle, SearchX } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface StatePanelProps {
  title: string
  description: string
  destructive?: boolean
}

export function StatePanel({ title, description, destructive = false }: StatePanelProps) {
  const Icon = destructive ? AlertCircle : SearchX

  return (
    <Alert variant={destructive ? "destructive" : "default"}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-4 shrink-0" />
        <div>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
