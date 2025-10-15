import {getErrorMessage} from "@/lib/constants";

/**
 * Fetches the list of all available trivia categories and cleans their names.
 * @returns {Promise<TriviaCategory[]>} A promise that resolves to an array of categories.
 */
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

/**
 * Fetches a specific number of questions from the OpenTDB API.
 * @param {number} [amount=50] - The number of questions to fetch. Defaults to 50.
 * @returns {Promise<{ questions: TriviaQuestion[]; error?: ApiError }>} A promise resolving to an object with questions or an error.
 */
export async function fetchQuestions(amount: number = 50): Promise<{ questions: TriviaQuestion[]; error?: ApiError }> {
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

/**
 * Fetches both categories and questions concurrently for efficiency.
 * @param {number} [amount=50] - The number of questions to fetch. Defaults to 50.
 * @returns {Promise<TriviaDataResult>} A promise resolving to an object containing all app data.
 */
export async function fetchTriviaData(amount: number = 50): Promise<TriviaDataResult> {
    const [categories, questionsResult] = await Promise.all([fetchCategories(), fetchQuestions(amount)])

    return {
        categories,
        questions: questionsResult.questions,
        error: questionsResult.error,
    }
}