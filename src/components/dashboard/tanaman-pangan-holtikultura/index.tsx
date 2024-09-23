import Link from 'next/link'
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import HeaderDash from '@/components/HeaderDash'
import DashCard from '@/components/DashCard';
import useSWR, { SWRResponse } from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const DashboardTanamanPanganHoltikultura = () => {
    // State untuk menyimpan nilai yang dipilih
    const [selectedFilter, setSelectedFilter] = useState<string>('year');

    // Fungsi untuk menangani klik tombol
    const handleFilterClick = (filter: string) => {
        setSelectedFilter(filter);
        console.log(filter); // Log nilai yang dipilih ke console
    };

    // Interface untuk data API
    interface TPHRealisasiPalawija1 {
        jagungPanen: number;
        jagungProduktivitas: number;
        jagungProduksi: number;
        kedelaiPanen: number;
        kedelaiProduktivitas: number;
        kedelaiProduksi: number;
        kacangTanahPanen: number;
        kacangTanahProduktivitas: number;
        kacangTanahProduksi: number;
    }

    interface TPHRealisasiPalawija2 {
        kacangHijauPanen: number;
        kacangHijauProduktivitas: number;
        kacangHijauProduksi: number;
        ubiKayuPanen: number;
        ubiKayuProduktivitas: number;
        ubiKayuProduksi: number;
        ubiJalarPanen: number;
        ubiJalarProduktivitas: number;
        ubiJalarProduksi: number;
    }

    interface TPHRealisasiPadi {
        produktivitasLahanKering: number;
        produktivitasLahanSawah: number;
        produksiLahanKering: number;
        produksiLahanSawah: number;
        panenLahanKering: number;
        panenLahanSawah: number;
        produktivitasTotal: number;
        produksiTotal: number;
        panenTotal: number;
    }

    interface TPHDashboardData {
        lahanBukanSawahSum: number;
        lahanSawahSum: number;
        tphRealisasiPalawija1: TPHRealisasiPalawija1;
        tphRealisasiPalawija2: TPHRealisasiPalawija2;
        tphRealisasiPadi: TPHRealisasiPadi;
        tahun: number;
    }

    interface Response {
        status: number;
        message: string;
        data: TPHDashboardData;
    }

    // otomatis hitung tahun
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 1;
    // const [tahun, setTahun] = React.useState("2024");
    const [tahun, setTahun] = React.useState(() => new Date().getFullYear().toString());
    // otomatis hitung tahun


    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    console.log("filter = ", selectedFilter);
    const { data: dataTPH }: SWRResponse<Response> = useSWR(
        `/tph/dashboard/get?year=${tahun}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    return (
        <div className=''>
            {/* title */}
            <div className="wrap flex md:flex-row flex-col mb-4 justify-between">
                <div className="md:text-2xl text-xl  font-semibold text-primary uppercase">Dashboard Tanaman Pangan dan Holtikultura</div>
                {/* filter */}
                <div className="w-[130px]">
                    <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                        <SelectTrigger>
                            <SelectValue placeholder="Tahun">
                                {tahun ? tahun : "Tahun"}
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className='text-xs' value="Semua Tahun">Semua Tahun</SelectItem>
                            {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                const year = startYear + index;
                                return (
                                    <SelectItem className='text-xs' key={year} value={year.toString()}>
                                        {year}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>
                {/* filter */}
            </div>
            {/* title */}
            {/* card */}
            <div className="wrap-card grid md:grid-cols-2 grid-cols-1 gap-3">
                <DashCard label='Total Lahan Sawah' value={dataTPH?.data?.lahanSawahSum || 0} />
                <DashCard label='Total Lahan Bukan Sawah' value={dataTPH?.data?.lahanBukanSawahSum || 0} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="tablee h-fit md:h-[320px] mt-6 flex md:flex-row flex-col gap-3">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Palawija 1" link="/tanaman-pangan-holtikutura/realisasi" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-1'>
                            <TableRow className='border-none p-1'>
                                <TableHead className="text-primary p-1">Komoditas</TableHead>
                                <TableHead className="text-primary p-1">Panen (Ha)</TableHead>
                                <TableHead className="text-primary p-1">Produktivitas (Ton/Ha)</TableHead>
                                <TableHead className="text-primary p-1">Produksi (Ton)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className='border-none p-1 py-1'>
                                <TableCell className='p-1 py-1'>Jagung</TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija1.jagungPanen || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija1.jagungProduktivitas || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija1.jagungProduksi || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className='border-none p-1 py-1'>
                                <TableCell className='p-1 py-1'>Kedelai</TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija1.kedelaiPanen || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija1.kedelaiProduktivitas || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija1.kedelaiProduksi || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className='border-none p-1 py-1'>
                                <TableCell className='p-1 py-1'>Kacang Tanah</TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija1.kacangTanahPanen || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija1.kacangTanahProduktivitas || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija1.kacangTanahProduksi || 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Palawija 2" link="/tanaman-pangan-holtikutura/realisasi" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-1'>
                            <TableRow className='border-none p-1'>
                                <TableHead className="text-primary p-1">Komoditas</TableHead>
                                <TableHead className="text-primary p-1">Panen (Ha)</TableHead>
                                <TableHead className="text-primary p-1">Produktivitas (Ton/Ha)</TableHead>
                                <TableHead className="text-primary p-1">Produksi (Ton)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className='border-none p-1 py-1'>
                                <TableCell className='p-1 py-1'>Kacang Hijau</TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija2.kacangHijauPanen || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija2.kacangHijauProduktivitas || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija2.kacangHijauProduksi || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className='border-none p-1 py-1'>
                                <TableCell className='p-1 py-1'>Ubi Kayu</TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija2.ubiKayuPanen || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija2.ubiKayuProduktivitas || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija2.ubiKayuProduksi || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className='border-none p-1 py-1'>
                                <TableCell className='p-1 py-1'>Ubi Jalar</TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija2.ubiJalarPanen || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija2.ubiJalarProduktivitas || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPalawija2.ubiJalarProduksi || 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>
            {/*  */}
            <div className="tablee h-fit md:h-[320px] mt-6 flex md:flex-row flex-col gap-3">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Padi" link="/tanaman-pangan-holtikutura/realisasi" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-1'>
                            <TableRow className='border-none p-1'>
                                <TableHead className="text-primary p-1">Jenis Lahan</TableHead>
                                <TableHead className="text-primary p-1">Panen (Ha)</TableHead>
                                <TableHead className="text-primary p-1">Produktivitas (Ton/Ha)</TableHead>
                                <TableHead className="text-primary p-1">Produksi (Ton)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className='border-none p-1 py-1'>
                                <TableCell className='p-1 py-1'>Lahan Kering</TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPadi.panenLahanKering || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPadi.produktivitasLahanKering || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPadi.produksiLahanKering || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className='border-none p-1 py-1'>
                                <TableCell className='p-1 py-1'>Lahan Sawah</TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPadi.panenLahanSawah || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPadi.produktivitasLahanSawah || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPadi.produksiLahanSawah || 0}
                                </TableCell>
                            </TableRow>
                            <TableRow className='border-none p-1 py-1'>
                                <TableCell className='p-1 py-1'>Total</TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPadi.panenTotal || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPadi.produksiTotal || 0}
                                </TableCell>
                                <TableCell className='p-1 py-1'>
                                    {dataTPH?.data?.tphRealisasiPadi.produktivitasTotal || 0}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>
            {/* tabel */}
        </div>
    )
}

export default DashboardTanamanPanganHoltikultura
