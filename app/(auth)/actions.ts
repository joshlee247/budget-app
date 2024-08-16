'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {createClient} from "@/lib/supabase/server";

export async function login(formData) {
    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
    })

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData) {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                first_name: formData.firstName,
                last_name: formData.lastName,
            },
        },
    })


    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}