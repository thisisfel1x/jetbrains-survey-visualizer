import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
    message?: string
}

export function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">{message}</p>
            </div>
        </div>
    )
}