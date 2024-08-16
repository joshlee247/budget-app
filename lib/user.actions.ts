'use server'

import {plaidClient} from "@/lib/plaid";
import {supabase} from "@/lib/supabase/db";
import {revalidatePath} from "next/cache";
import {createClient} from "@/lib/supabase/server";

export const createLinkToken = async (user) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.id
            },
            client_name: `${user.user_metadata.first_name} ${user.user_metadata.last_name}`,
            products: ['auth', 'transactions'],
            language: 'en',
            country_codes: ['US'],
        }

        const response = await plaidClient.linkTokenCreate(tokenParams);

        return response.data.link_token
    } catch (error) {
        console.log(error);
    }
}

export const exchangePublicToken = async ({ publicToken, user }) => {
    try {
        // Exchange public token for access token and item ID
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        // Get account information from Plaid using the access token
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        console.log("itemId: " + itemId)
        for (const [index, account] of accountsResponse.data.accounts.entries()) {
            console.log(account);

            await createBankAccount({
                userId: user.id,
                bankId: itemId,
                accountId: account.account_id,
                accessToken
            });
        }


    } catch (e) {
        console.error("An error occurred while creating exchanging token:", e);
    }
}

export const createBankAccount = async ({ userId, bankId, accountId, accessToken }) => {
    const supabase = createClient()
    const { error } = await supabase
        .from('banks')
        .insert([
            {
                user_id: userId,
                bank_id: bankId,
                account_id: accountId,
                access_token: accessToken
            },
        ])

    if (error) {
        console.log("Error creating bank account.")
    }

    // revalidatePath("/")
}

export async function getBanks({ userId }: { userId: string }) {
    const supabase = createClient()
    let { data: banks, error } = await supabase
        .from('banks')
        .select('*')
        .eq('user_id', userId);

    if (error) {
        return
    }

    return banks
}

export async function getBank({ accountId }: { accountId: string }) {
    const supabase = createClient()
    let { data: banks, error } = await supabase
        .from('banks')
        .select('*')
        .eq('account_id', accountId);

    if (error) {
        return
    }

    return banks
}