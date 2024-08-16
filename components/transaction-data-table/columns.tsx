"use client"

import { ColumnDef } from "@tanstack/react-table"
import {Transaction} from "@/types/transactions";
import {Badge} from "@/components/ui/badge";
import {TransactionBadge} from "@/components/transaction-data-table/transaction-badge";
import Image from "next/image";

export const transactionsColumns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "image",
        header: "",
        cell: ({ row }) => {
            const url = row.getValue("image")
            if (!url) {
                return <div className="max-w-[30px] max-h-[30px] rounded-md p-4 flex justify-center items-center bg-secondary text-secondary-foreground">{ row.getValue("name")[0].toUpperCase() }</div>
            }

            return <Image className="rounded-md" src={url} alt="Company Image" height={30} width={30} />
        },
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.getValue("category")

            return <TransactionBadge variant="default">{ category }</TransactionBadge>
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right">{formatted}</div>
        },
    },
]
