import {getBank, getBanks} from "@/lib/user.actions";
import {plaidClient} from "@/lib/plaid";
import {Transaction} from "@/types/transactions";

// Get bank info
export const getInstitution = async ({ institutionId }: { institutionId: string }) => {
    try {
        const institutionResponse = await plaidClient.institutionsGetById({
            institution_id: institutionId,
            country_codes: ["US"],
        });

        return institutionResponse.data.institution;
    } catch (error) {
        console.error("An error occurred while getting the accounts:", error);
    }
};

export const getAccounts = async ({ userId }: { userId: string }) => {
    try {
        // Get banks from db
        const banks = await getBanks({ userId });

        // Create a Set to track unique bank IDs and filter unique banks
        const uniqueBanks = Array.from(new Set(banks.map(bank => bank.bank_id)))
            .map(id => banks.find(bank => bank.bank_id === id));

        // Fetch accounts for each unique bank
        const accounts = await Promise.all(
            uniqueBanks.map(async (bank) => {
                try {
                    // Get all account info from Plaid for the current bank
                    const accountsResponse = await plaidClient.accountsGet({
                        access_token: bank.access_token,
                    });

                    // Map over all accounts for this bank and return them
                    return accountsResponse.data.accounts.map(accountData => ({
                        id: accountData.account_id,
                        availableBalance: accountData.balances.available ?? 0,
                        currentBalance: accountData.balances.current ?? 0,
                        institutionId: accountsResponse.data.item.institution_id,
                        name: accountData.name,
                        officialName: accountData.official_name ?? 'Untitled',
                        mask: accountData.mask ?? '',
                        type: accountData.type,
                        subtype: accountData.subtype ?? '',
                        appwriteItemId: bank.id,  // Linking this account to the bank entry
                    }));
                } catch (error) {
                    console.error(`Error fetching data for bank ID ${bank.id}:`, error);
                    return []; // Return an empty array for this bank if there's an error
                }
            })
        );

        // Flatten the array of account arrays into a single array
        const flattenedAccounts = accounts.flat();

        const totalBanks = flattenedAccounts.length;
        const totalCurrentBalance = flattenedAccounts.reduce((total, account) => {
            return total + account.currentBalance;
        }, 0);

        return { data: flattenedAccounts, accounts: totalBanks, total_balance: totalCurrentBalance }
    } catch (error) {
        console.error("An error occurred while getting the accounts:", error);
    }
};

// Get one bank account
export const getAccount = async ({ accountId }: { accountId: string }) => {
    try {
        // get bank from db
        const bank = await getBank({ accountId });
        const access_token = bank[0].access_token
        // get account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
            access_token: access_token,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
            institutionId: accountsResponse.data.item.institution_id!,
        });

        const transactions = await getTransactions({
            accessToken: access_token,
        });

        const account = {
            id: accountData.account_id,
            availableBalance: accountData.balances.available!,
            currentBalance: accountData.balances.current!,
            institutionId: institution.institution_id,
            name: accountData.name,
            officialName: accountData.official_name,
            mask: accountData.mask!,
            type: accountData.type as string,
            subtype: accountData.subtype! as string,
            appwriteItemId: bank.id,
        };

        // sort transactions by date such that the most recent transaction is first
        transactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return {
            data: account,
            transactions: transactions,
        };
    } catch (error) {
        console.error("An error occurred while getting the account:", error);
    }
};

export const getTransactions = async ({
                                          accessToken,
                                      }: { accessToken: string }) => {
    let hasMore = true;
    let transactions: Transaction[] = [];

    try {
        // Iterate through each page of new transaction updates for item
        while (hasMore) {
            const response = await plaidClient.transactionsSync({
                access_token: accessToken,
            });

            const data = response.data;

            transactions = response.data.added.map((transaction) => ({
                id: transaction.transaction_id,
                name: transaction.name,
                paymentChannel: transaction.payment_channel,
                type: transaction.payment_channel,
                accountId: transaction.account_id,
                amount: transaction.amount,
                pending: transaction.pending,
                category: transaction.category ? transaction.category[0] : "",
                date: transaction.date,
                image: transaction.logo_url,
            }));

            hasMore = data.has_more;
        }

        return transactions
    } catch (error) {
        console.error("An error occurred while getting the accounts:", error);
    }
};