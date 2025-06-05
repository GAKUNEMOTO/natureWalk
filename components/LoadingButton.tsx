'use client'

import { HtmlContext } from "next/dist/server/route-modules/pages/vendored/contexts/entrypoints";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading: boolean
    loadingText: string
    children: ReactNode
    variant?: "default" | "outline" | "ghost" | "link" | "destructive"
    size?: "default" | "sm" | "lg" | "icon"
}

export function LoadingButton({
    loading,
    loadingText,
    children,
    variant = "default",
    size = "default",
    ...props
}: LoadingButtonProps) {
    return (
       <Button
            variant={variant}
            size={size}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loadingText || children}
                </>
            ) : (
                children
            )}
        </Button>
    );
}