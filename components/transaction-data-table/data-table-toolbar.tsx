"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import {DataTableFacetedFilter} from "@/components/transaction-data-table/data-table-faceted-filter";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {DataTableViewOptions} from "@/components/transaction-data-table/data-table-view-options";
import {PizzaIcon, PlaneIcon} from "lucide-react";

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

const categories = [
    {
        value: "Food and Drink",
        label: "Food & drink",
        icon: PizzaIcon,
    },
    {
        value: "Travel",
        label: "Travel",
        icon: PlaneIcon,
    },
    {
        value: "Entertainment",
        label: "Entertainment",
        icon: PlaneIcon,
    },
    {
        value: "Transportation",
        label: "Transportation",
        icon: PlaneIcon,
    },
    {
        value: "Payment",
        label: "Payment",
        icon: PlaneIcon,
    },
]

export function DataTableToolbar<TData>({
                                            table,
                                        }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search transactions..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getColumn("category") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("category")}
                        title="Categories"
                        options={categories}
                    />
                )}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}