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

// Dummy data untuk tabel
const dummyData = [
    { komoditas: 'Jagung', harga: '34000', satuan: 'Rp/kg', },
    { komoditas: 'Padi', harga: '34000', satuan: 'Rp/kg', },
    { komoditas: 'Kedelai', harga: '34000', satuan: 'Rp/kg', },
    { komoditas: 'Kedelai', harga: '34000', satuan: 'Rp/kg', },
    { komoditas: 'Cabai', harga: '34000', satuan: 'Rp/kg', },
];

const dummyPangan = [
    {
        komoditas: "Kacang",
        rataRata: "50.000",
        maksimum: "55.000",
        minimum: "45.000",
        targetCV: "5%",
        cv: "4.8%"
    },
    {
        komoditas: "Jagung",
        rataRata: "40.000",
        maksimum: "45.000",
        minimum: "35.000",
        targetCV: "4%",
        cv: "4.1%"
    },
    {
        komoditas: "Padi",
        rataRata: "60.000",
        maksimum: "65.000",
        minimum: "55.000",
        targetCV: "3%",
        cv: "3.2%"
    },
    {
        komoditas: "Wheat",
        rataRata: "70.000",
        maksimum: "75.000",
        minimum: "65.000",
        targetCV: "6%",
        cv: "5.9%"
    }
];

const DashboardTanamanPanganHoltikultura = () => {
    // State untuk menyimpan nilai yang dipilih
    const [selectedFilter, setSelectedFilter] = useState<string>('year');

    // Fungsi untuk menangani klik tombol
    const handleFilterClick = (filter: string) => {
        setSelectedFilter(filter);
        console.log(filter); // Log nilai yang dipilih ke console
    };
    return (
        <div className=''>
            {/* title */}
            <div className="wrap flex justify-between">
                <div className="text-2xl mb-5 font-semibold text-primary uppercase">Dashboard Tanaman Pangan dan Holtikultura</div>
                {/* filter */}
                <div className="text-lg mb-5 flex gap-4">
                    <button
                        className={`${selectedFilter === 'year' ? 'aktif text-primary font-semibold' : 'text-black/70'
                            }`}
                        onClick={() => handleFilterClick('year')}
                    >
                        Year
                    </button>
                    <button
                        className={`${selectedFilter === 'month' ? 'aktif text-primary font-semibold' : 'text-black/70'
                            }`}
                        onClick={() => handleFilterClick('month')}
                    >
                        Month
                    </button>
                    <button
                        className={`${selectedFilter === 'week' ? 'aktif text-primary font-semibold' : 'text-black/70'
                            }`}
                        onClick={() => handleFilterClick('week')}
                    >
                        Week
                    </button>
                    <button
                        className={`${selectedFilter === 'today' ? 'aktif text-primary font-semibold' : 'text-black/70'
                            }`}
                        onClick={() => handleFilterClick('today')}
                    >
                        Today
                    </button>
                </div>
                {/* filter */}
            </div>
            {/* title */}
            {/* card */}
            <div className="wrap-card grid md:grid-cols-2 grid-cols-1 gap-3">
                <DashCard label='Total Lahan Sawah' value={43900} />
                <DashCard label='Total Lahan Bukan Sawah' value={22414} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="tablee h-fit md:h-[320px] mt-6 flex md:flex-row flex-col gap-3">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Palawija" link="/tanaman-pangan-holtikultura/realisasi" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Panen</TableHead>
                                <TableHead className="text-primary p-0">Produktivitas</TableHead>
                                <TableHead className="text-primary p-0">Produksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.harga}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.satuan}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Sayur dan Buah" link="/tanaman-pangan-holtikultura/realisasi" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Panen</TableHead>
                                <TableHead className="text-primary p-0">Produktivitas</TableHead>
                                <TableHead className="text-primary p-0">Produksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.harga}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.satuan}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>
            {/*  */}
            <div className="tablee h-fit md:h-[320px] mt-6 flex md:flex-row flex-col gap-3">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Palawija" link="/tanaman-pangan-holtikultura/tanaman-hias" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Panen</TableHead>
                                <TableHead className="text-primary p-0">Produktivitas</TableHead>
                                <TableHead className="text-primary p-0">Produksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.harga}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.satuan}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tanaman Biofarmaka" link="/tanaman-pangan-holtikultura/realisasi" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Panen</TableHead>
                                <TableHead className="text-primary p-0">Produktivitas</TableHead>
                                <TableHead className="text-primary p-0">Produksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.harga}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.satuan}</TableCell>
                                </TableRow>
                            ))}
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
