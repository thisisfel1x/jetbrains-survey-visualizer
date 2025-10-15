"use client"

import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts"
import {CHART_COLORS} from "@/lib/constants";
import {renderLabel} from "@/lib/utils";

interface DifficultyChartProps {
    data: DifficultyData[]
}

export function DifficultyChart({data}: DifficultyChartProps) {
    // @ts-ignore
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={120}
                    dataKey="count"
                    style={{fontSize: "14px", fontWeight: 500}}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]}/>
                    ))}
                </Pie>
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
            </PieChart>
        </ResponsiveContainer>
    )
}
