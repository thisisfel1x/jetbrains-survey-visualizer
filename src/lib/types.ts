interface TriviaQuestion {
    category: string
    type: string
    difficulty: string
    question: string
    correct_answer: string
    incorrect_answers: string[]
}

interface TriviaCategory {
    id: number
    name: string
}

interface CategoryData {
    name: string
    count: number
}

interface CategoriesApiResponse {
    trivia_categories: TriviaCategory[]
}

interface DifficultyData {
    name: string
    count: number
}

interface TriviaApiResponse {
    response_code: number
    results: TriviaQuestion[]
}

interface ApiError {
    code: number
    message: string
}

interface TriviaDataResult {
    categories: TriviaCategory[]
    questions: TriviaQuestion[]
    error?: ApiError
}
