import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const renderLabel = ({name, percent}: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`
}
