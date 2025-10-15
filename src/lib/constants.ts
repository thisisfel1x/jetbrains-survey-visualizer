export const CHART_COLORS = [
    "oklch(0.6 0.22 265)",
    "oklch(0.7 0.19 162)",
    "oklch(0.75 0.18 85)",
    "oklch(0.65 0.24 305)",
    "oklch(0.7 0.21 40)",
]

export function getErrorMessage(code: number): string {
    switch (code) {
        case 0:
            return "Success"
        case 1:
            return "No Results: The API doesn't have enough questions for your query."
        case 2:
            return "Invalid Parameter: The arguments passed aren't valid."
        case 3:
            return "Token Not Found: Session token does not exist."
        case 4:
            return "Token Empty: Session token has returned all possible questions."
        case 5:
            return "Rate Limit: Too many requests. Please wait a few seconds and try again."
        default:
            return "Unknown error occurred"
    }
}