"use client"

import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"

interface CategoryData {
    name: string
    count: number
}

interface CategoryChartProps {
    data: CategoryData[]
}

export function CategoryChart({data}: CategoryChartProps) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0 0)"/>
                <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    tick={{fill: "oklch(0.65 0 0)", fontSize: 12}}
                />
                <YAxis tick={{fill: "oklch(0.65 0 0)"}}/>
                <Tooltip
                    contentStyle={{
                        backgroundColor: "oklch(0.18 0 0)",
                        border: "1px solid oklch(0.25 0 0)",
                        borderRadius: "0.5rem",
                        color: "oklch(0.95 0 0)",
                    }}
                    labelStyle={{color: "oklch(0.95 0 0)"}}
                    itemStyle={{color: "oklch(0.95 0 0)"}}
                />
                <Bar dataKey="count" fill="oklch(0.6 0.22 265)" radius={[4, 4, 0, 0]}/>
            </BarChart>
        </ResponsiveContainer>
    )
}
