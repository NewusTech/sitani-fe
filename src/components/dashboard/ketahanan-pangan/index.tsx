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

const DashboardKetahananPangan = () => {
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
            <div className="wrap flex md:flex-row flex-col mb-4 justify-between">
                <div className="md:text-2xl text-xl  font-semibold text-primary uppercase">Dashboard Ketahanan Pangan</div>
                {/* filter */}
                <div className="text-base md:text-lg  flex gap-4">
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
                <DashCard label='Harga Produsen Eceran Tertinggi' value={43900} />
                <DashCard label='Harga Produsen Eceran Terendah' value={22414} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="tablee h-fit md:h-[320px] mt-6 flex md:flex-row flex-col gap-3">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Daftar Harga Produsen dan Eceran" link="/ketahanan-pangan/produsen-dan-eceran" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Komoditas</TableHead>
                                <TableHead className="text-primary p-0">Harga</TableHead>
                                <TableHead className="text-primary p-0">Satuan</TableHead>
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
                    <HeaderDash label="Data Harian Panel Pedagangan Eceran" link="/ketahanan-pangan/kuisioner-pedagang-eceran" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Komoditas</TableHead>
                                <TableHead className="text-primary p-0">Rata-rata Perbulan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.harga}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>
            {/*  */}
            <div className="tab2 border border-slate-200 my-3 rounded-lg p-4 w-full h-[350px] overflow-auto">
                <HeaderDash label="Data Coefesien Variasi CV Tingkat Produsen" link="/ketahanan-pangan/koefisien-variasi-produsen" />
                {/* table */}
                {/* table */}
                <Table className='mt-1'>
                    <TableHeader className='rounded-md p-0'>
                        <TableRow className='border-none p-0'>
                            <TableHead className="text-primary p-0">Komoditas</TableHead>
                            <TableHead className="text-primary p-0">Rata-rata</TableHead>
                            <TableHead className="text-primary p-0 hidden md:table-cell">Maksimum</TableHead>
                            <TableHead className="text-primary p-0 hidden md:table-cell">Minimum</TableHead>
                            <TableHead className="text-primary p-0 ">Target CV</TableHead>
                            <TableHead className="text-primary p-0 ">CV</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummyPangan.map((data, index) => (
                            <TableRow className='border-none p-0 py-1' key={index}>
                                <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                <TableCell className='p-0 py-1'>{data.rataRata}</TableCell>
                                <TableCell className='p-0 py-1 hidden md:table-cell'>{data.maksimum}</TableCell>
                                <TableCell className='p-0 py-1 hidden md:table-cell'>{data.minimum}</TableCell>
                                <TableCell className='p-0 py-1'>{data.targetCV}</TableCell>
                                <TableCell className='p-0 py-1'>{data.cv}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                {/* table */}
            </div>
            <div className="tab2 border border-slate-200 my-3 rounded-lg p-4 w-full h-[350px] overflow-auto">
                <HeaderDash label="Data Coefesien Variasi CV Tingkat Produksi" link="/ketahanan-pangan/koefisien-variasi-produksi" />
                {/* table */}
                {/* table */}
                <Table className='mt-1'>
                    <TableHeader className='rounded-md p-0'>
                        <TableRow className='border-none p-0'>
                            <TableHead className="text-primary p-0">Komoditas</TableHead>
                            <TableHead className="text-primary p-0">Rata-rata</TableHead>
                            <TableHead className="text-primary p-0 hidden md:table-cell">Maksimum</TableHead>
                            <TableHead className="text-primary p-0 hidden md:table-cell">Minimum</TableHead>
                            <TableHead className="text-primary p-0 ">Target CV</TableHead>
                            <TableHead className="text-primary p-0 ">CV</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dummyPangan.map((data, index) => (
                            <TableRow className='border-none p-0 py-1' key={index}>
                                <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                <TableCell className='p-0 py-1'>{data.rataRata}</TableCell>
                                <TableCell className='p-0 py-1 hidden md:table-cell'>{data.maksimum}</TableCell>
                                <TableCell className='p-0 py-1 hidden md:table-cell'>{data.minimum}</TableCell>
                                <TableCell className='p-0 py-1'>{data.targetCV}</TableCell>
                                <TableCell className='p-0 py-1'>{data.cv}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                {/* table */}
            </div>
            {/* tabel */}
        </div>
    )
}

export default DashboardKetahananPangan
