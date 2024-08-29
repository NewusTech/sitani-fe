import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LahanSawah from '@/components/superadmin/TanamanPangan/LahanSawah'
import BukanSawah from '@/components/superadmin/TanamanPangan/BukanSawah'

const LahanPage = () => {
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Lahan Sawah dan Bukan Lahan Sawah</div>
            {/* title */}
            {/* tabs */}
            <div className="tabs">
                <Tabs defaultValue="lahanSawah" className="w-full">
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