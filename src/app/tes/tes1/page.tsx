"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InputSearch from '@/components/ui/InputSearch'

const frameworks = [
    { value: "next.js", label: "Next.js" },
    { value: "sveltekit", label: "SvelteKit" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" },
]

const handleSelect = (value: string) => {
    console.log("Selected value:", value)
}


const Tes1 = () => {
    return (
        <div>
            <Tabs defaultValue="account" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="password">Password</TabsTrigger>
                </TabsList>
                <TabsContent value="account">Make changes to your account here.</TabsContent>
                <TabsContent value="password">Change your password here.</TabsContent>
            </Tabs>

            {/*  */}
            <div className="mt-4">
                <InputSearch
                    options={frameworks}
                    placeholder="Search framework..."
                    buttonLabel="Select a framework..."
                    onSelect={handleSelect}
                />
            </div>
            {/*  */}

        </div>
    )
}

export default Tes1