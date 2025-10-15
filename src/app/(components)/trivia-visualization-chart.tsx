"use client"

import {useEffect, useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {LoadingSpinner} from "@/components/loading-spinner";
import {fetchTriviaData} from "@/app/(components)/actions";
import {Badge} from "@/components/ui/badge";
import {RefreshCw} from "lucide-react";
import {EmptyState} from "@/components/empty-state";
import {CategoryChart} from "@/app/(components)/category-chart";
import {DifficultyChart} from "@/app/(components)/difficulty-chart";
import Image from "next/image";
import jetbrainsAcademy from "@/public/images/jetbrains-academy.png";

export default function TriviaVisualizationChart() {

    // Define states for component
    const [questions, setQuestions] = useState<TriviaQuestion[]>([])
    const [filteredQuestions, setFilteredQuestions] = useState<TriviaQuestion[]>([])

    // Loading state
    const [isLoading, setLoading] = useState<boolean>(true)

    // Category management
    const [categories, setCategories] = useState<TriviaCategory[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

    // Error Handling
    const [error, setError] = useState<ApiError | null>(null)

    // Load data on initial render
    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            setFilteredQuestions(questions.filter((q) => q.category === selectedCategory))
        } else {
            setFilteredQuestions(questions)
        }
    }, [selectedCategory, questions])

    /**
     * Fetches trivia data from the server.
     * @param {number} [count] - The number of questions to fetch.
     */
    const loadData = async (count?: number) => {
        setLoading(true)
        setError(null)
        try {
            const {categories, questions, error: apiError} = await fetchTriviaData(count)

            if (apiError) {
                setError(apiError)
                setQuestions([])
                setFilteredQuestions([])
            } else {
                setCategories(categories)
                setQuestions(questions)
                setFilteredQuestions(questions)
            }
        } catch (error) {
            setError({
                code: -1,
                message: "An unexpected error occurred. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

    /**
     * Processes the list of filtered questions to count questions per category.
     * @returns {CategoryData[]} An array of objects with category names and their counts.
     */
    const getCategoryData = (): CategoryData[] => {
        const categoryCount: Record<string, number> = {}

        filteredQuestions.forEach((q) => {
            categoryCount[q.category] = (categoryCount[q.category] || 0) + 1
        })

        return Object.entries(categoryCount)
            .map(([name, count]) => ({name, count}))
            .sort((a, b) => b.count - a.count)
    }

    /**
     * Processes the list of filtered questions to count questions per difficulty.
     * @returns {DifficultyData[]} An array of objects with difficulty levels and their counts.
     */
    const getDifficultyData = (): DifficultyData[] => {
        const difficultyCount: Record<string, number> = {
            easy: 0,
            medium: 0,
            hard: 0,
        }

        filteredQuestions.forEach((q) => {
            difficultyCount[q.difficulty] = (difficultyCount[q.difficulty] || 0) + 1
        })

        return Object.entries(difficultyCount).map(([name, count]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            count,
        }))
    }

    // Render loading spinner
    if (isLoading) {
        return <LoadingSpinner message="Loading OpenTriviaDB data..."/>
    }

    // Render error message if an error is present
    if (error) {
        return (
            <EmptyState
                title="Unable to load OpenTriviaDB data"
                description={error.message}
                icon="error"
                actionLabel="Try Again"
                onAction={() => loadData()}
            />
        )
    }

    // Render empty state if no questions are received
    if (questions.length === 0) {
        return (
            <EmptyState
                title="No questions available"
                description="No OpenTriviaDB questions were found. Try adjusting your settings or reload to fetch new data."
                icon="empty"
                actionLabel="Reload"
                onAction={() => loadData()}
            />
        )
    }

    // Otherwise, render data page
    const categoryData = getCategoryData()
    const difficultyData = getDifficultyData()

    return (
        <div className="min-h-screen p-6 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-2">
                            <div className="flex items-center gap-4">
                                <div className="relative w-full flex-shrink-0">
                                    <Image
                                        src={jetbrainsAcademy}
                                        alt="Logo"
                                        width={500}
                                    />
                                </div>
                            </div>
                            <p className="text-muted-foreground text-lg">
                                Visualizing questions from OpenTriviaDB for JetBrains Internship Challenge
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => loadData()} variant="outline" size="icon" disabled={isLoading}>
                                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}/>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Total Questions</CardDescription>
                            <CardTitle className="text-3xl">{filteredQuestions.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Categories</CardDescription>
                            <CardTitle className="text-3xl">{categoryData.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardDescription>Difficulty Levels</CardDescription>
                            <CardTitle className="text-3xl">3</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Category Filter */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter by Category</CardTitle>
                        <CardDescription>Select a category to filter the data visualizations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={selectedCategory === null ? "default" : "outline"}
                                onClick={() => setSelectedCategory(null)}
                                size="sm"
                            >
                                All Categories
                            </Button>
                            {categories.map((category) => {
                                // Check if this category has questions in the current dataset
                                const hasQuestions = questions.some((q) => q.category === category.name)
                                return (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategory === category.name ? "default" : "outline"}
                                        onClick={() => setSelectedCategory(category.name)}
                                        size="sm"
                                        disabled={!hasQuestions}
                                        className={!hasQuestions ? "opacity-50" : ""}
                                    >
                                        {category.name}
                                    </Button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Category Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Questions by Category</CardTitle>
                            <CardDescription>Distribution of questions across different categories</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CategoryChart data={categoryData}/>
                        </CardContent>
                    </Card>

                    {/* Difficulty Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Questions by Difficulty</CardTitle>
                            <CardDescription>Distribution of questions across difficulty levels</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DifficultyChart data={difficultyData}/>
                        </CardContent>
                    </Card>
                </div>

                {/* Category List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Overview</CardTitle>
                        <CardDescription>Question distribution across categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 space-y-3">
                            {categoryData.map(({name, count}) => {
                                const percentage = ((count / filteredQuestions.length) * 100).toFixed(1)
                                return (
                                    <div
                                        key={name}
                                        className="group flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedCategory(name)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span
                                                    className="text-sm font-medium truncate">{name.replace(/&amp;/g, '&')}</span>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className="text-xs text-muted-foreground">{percentage}%</span>
                                                    <Badge variant="secondary"
                                                           className="min-w-[2.5rem] justify-center">
                                                        {count}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-300"
                                                    style={{width: `${percentage}%`}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}