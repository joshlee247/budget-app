import Link from "next/link"
import { CircleUser, Menu, Package2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import PlaidLink from "@/components/plaid-link";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {getAccounts} from "@/lib/supabase/bank.actions";

export default async function Accounts() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/login')
    }

    const accounts = await getAccounts({ userId: data.user.id })

    return (
        <>
            <Card x-chunk="dashboard-04-chunk-1">
                <CardHeader>
                    <CardTitle>Linked Accounts</CardTitle>
                    <CardDescription>
                        Used to retrieve your transactions and balances.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableBody>
                            {
                                accounts.data.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell>
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="font-medium">{account.name}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        {account.subtype[0].toUpperCase() + account.subtype.slice(1)}
                                                        <span
                                                            className="text-[10px]">●●●●</span> {account.mask}
                                                    </div>
                                                </div>
                                                <p className="text-muted-foreground">Verified</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <PlaidLink user={data.user} variant="default"/>
                </CardFooter>
            </Card>
        </>
    )
}
