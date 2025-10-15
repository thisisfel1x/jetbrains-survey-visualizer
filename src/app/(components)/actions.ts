import {getErrorMessage} from "@/lib/constants";

export async function fetchCategories(): Promise<TriviaCategory[]> {
    try {
        const response = await fetch("https://opentdb.com/api_category.php");
        const data: CategoriesApiResponse = await response.json();

        if (!data.trivia_categories) {
            return [];
        }

        // Bug: replace &amp; -> & for category overview section
        return data.trivia_categories.map(category => {
            return {
                ...category,
                name: category.name.replace(/&amp;/g, '&')
            };
        });
    } catch (error) {
        console.error("Error fetching categories:", error)
        return []
    }
}

export async function fetchQuestions(amount = 50): Promise<{ questions: TriviaQuestion[]; error?: ApiError }> {
    try {
        const response = await fetch(`https://opentdb.com/api.php?amount=${amount}`)
        const data: TriviaApiResponse = await response.json()

        if (data.response_code !== 0) {
            return {
                questions: [],
                error: {
                    code: data.response_code,
                    message: getErrorMessage(data.response_code),
                },
            }
        }

        return {questions: data.results || []}
    } catch (error) {
        console.error("Error fetching questions:", error)
        return {
            questions: [],
            error: {
                code: -1,
                message: "Network error: Failed to fetch questions. Please check your connection.",
            },
        }
    }
}

export async function fetchTriviaData(amount = 50): Promise<TriviaDataResult> {
    const [categories, questionsResult] = await Promise.all([fetchCategories(), fetchQuestions(amount)])

    return {
        categories,
        questions: questionsResult.questions,
        error: questionsResult.error,
    }
}