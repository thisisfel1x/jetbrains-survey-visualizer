"use client"

import {AlertCircle, Database, RefreshCw} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"

interface EmptyStateProps {
    title?: string
    description?: string
    icon?: "error" | "empty"
    actionLabel?: string
    onAction?: () => void
}

export function EmptyState({
                               title = "No data available",
                               description = "There are no questions to display at the moment.",
                               icon = "empty",
                               actionLabel,
                               onAction,
                           }: EmptyStateProps) {
    const Icon = icon === "error" ? AlertCircle : Database

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="max-w-md w-full">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="rounded-full bg-secondary p-4">
                            <Icon className="h-8 w-8 text-muted-foreground"/>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">{title}</h3>
                            <p className="text-sm text-muted-foreground text-balance">{description}</p>
                        </div>
                        {actionLabel && onAction && (
                            <Button onClick={onAction} className="mt-4">
                                <RefreshCw className="h-4 w-4 mr-2"/>
                                {actionLabel}
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
