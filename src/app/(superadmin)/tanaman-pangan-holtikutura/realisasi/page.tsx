import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link'
import Palawija1 from '@/components/superadmin/TanamanPangan/Palawija1'
import Palawija2 from '@/components/superadmin/TanamanPangan/Palawija2'
import Padi from '@/components/superadmin/TanamanPangan/Padi'

const RealisasiPage = () => {
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Realisasi luas panen, produktivitas dan produksi</div>
            {/* title */}
            {/* tabs */}
            <div className="tabs">
                <Tabs defaultValue="palawija1" className="w-full">
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
            {/* tabs */}
        </div>
    )
}

export default RealisasiPage