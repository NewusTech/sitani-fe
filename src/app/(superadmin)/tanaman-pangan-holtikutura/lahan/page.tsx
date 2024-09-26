"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LahanSawah from '@/components/superadmin/TanamanPangan/LahanSawah'
import BukanSawah from '@/components/superadmin/TanamanPangan/BukanSawah'
import { useEffect, useState } from "react";

const LahanPage = () => {
    const defaultTab = 'lahanSawah'; // Default tab
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Load the last active tab from localStorage when the component mounts
    useEffect(() => {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab && (savedTab === 'lahanSawah' || savedTab === 'bukanSawah')) {
            setActiveTab(savedTab);
        } else {
            // If no saved tab or invalid tab, use the default value
            localStorage.setItem('activeTab', defaultTab);
            setActiveTab(defaultTab);
        }
    }, []);

    // Update localStorage whenever the active tab changes
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        localStorage.setItem('activeTab', tab);
    };

    return (
        <div>
            {/* title */}
            <div className="md:text-2xl text-xl mb-5 font-semibold text-primary">Lahan Sawah dan Bukan Lahan Sawah</div>
            {/* title */}
            {/* tabs */}
            <div className="tabs">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList>
                        <TabsTrigger value="lahanSawah">Lahan Sawah</TabsTrigger>
                        <TabsTrigger value="bukanSawah">Lahan Bukan Sawah</TabsTrigger>
                    </TabsList>
                    <TabsContent value="lahanSawah">
                        <LahanSawah />
                    </TabsContent>
                    <TabsContent value="bukanSawah">
                        <BukanSawah />
                    </TabsContent>
                </Tabs>
            </div>
            {/* tabs */}
        </div>
    )
}

export default LahanPage
