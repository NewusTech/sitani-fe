"use client"

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PrintIcon from '../../../../../public/icons/PrintIcon';
import FilterIcon from '../../../../../public/icons/FilterIcon';
import SearchIcon from '../../../../../public/icons/SearchIcon';
import UnduhIcon from '../../../../../public/icons/UnduhIcon';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from 'next/link';
import Palawija1 from '@/components/superadmin/TanamanPangan/Palawija1';
import Palawija2 from '@/components/superadmin/TanamanPangan/Palawija2';
import Padi from '@/components/superadmin/TanamanPangan/Padi';

const RealisasiPage = () => {
    const defaultTab = 'palawija1'; // Default tab
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Load the last active tab from localStorage when the component mounts
    useEffect(() => {
        const savedTab = localStorage.getItem('activeTab');
        if (savedTab && (savedTab === 'palawija1' || savedTab === 'palawija2' || savedTab === 'padi')) {
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
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">
                Realisasi luas panen, produktivitas dan produksi
            </div>
            {/* tabs */}
            <div className="tabs">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList>
                        <TabsTrigger value="palawija1">Palawija 1</TabsTrigger>
                        <TabsTrigger value="palawija2">Palawija 2</TabsTrigger>
                        <TabsTrigger value="padi">Padi</TabsTrigger>
                    </TabsList>
                    <TabsContent value="palawija1">
                        <Palawija1 />
                    </TabsContent>
                    <TabsContent value="palawija2">
                        <Palawija2 />
                    </TabsContent>
                    <TabsContent value="padi">
                        <Padi />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default RealisasiPage;
