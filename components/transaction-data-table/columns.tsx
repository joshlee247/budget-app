"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Transaction} from "@/types/transactions";

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
]
