'use client'

import React, {useCallback, useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {PlaidLinkOnSuccess, usePlaidLink} from "react-plaid-link";
import {useRouter} from "next/navigation";
import {createLinkToken, exchangePublicToken} from "@/lib/user.actions";
import {CirclePlus} from "lucide-react";

function PlaidLink({ user, variant }) {
    const router = useRouter();

    const [token, setToken] = useState('');

    useEffect(() => {
        const getLinkToken = async () => {
            const data = await createLinkToken(user);

            setToken(data);
        }

        getLinkToken();
    }, [user]);

    const onSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token: string) => {
        await exchangePublicToken({
            publicToken: public_token,
            user,
        })

        router.push('/plaid_success');
    }, [user])

    const config = {
        token,
        onSuccess
    }

    const { open, ready } = usePlaidLink(config);

    return (
        <Button variant={variant} onClick={() => open()} disabled={!ready}>
            <CirclePlus className="mr-2 h-4 w-4" /> Add Account
        </Button>
    );
}

export default PlaidLink;