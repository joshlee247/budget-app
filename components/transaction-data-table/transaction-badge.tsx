import React from 'react';
import {Badge, BadgeProps} from "@/components/ui/badge";
import {cva} from "class-variance-authority";
import {cn} from "@/lib/utils";

const badgeVariants = cva(
    "text-xs",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                "Food and Drink" :
                    "bg-pink-400 text-primary-foreground",
                "Travel" :
                    "bg-sky-500 text-primary-foreground"
            },
        },
    }
)

export function TransactionBadge({ className, variant, ...props }) {
    return (
        <Badge variant="primary" className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}
