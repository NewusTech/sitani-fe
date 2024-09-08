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
    { kecamatan: 'Way Jepara', desa: 'Jepara', namaPoktan: 'Rudi', namaKetua: 'Rahmat' },
    { kecamatan: 'Way Bungur', desa: 'Sido Mulyo', namaPoktan: 'Agus', namaKetua: 'Budi' },
    { kecamatan: 'Mataram Baru', desa: 'Sri Rejeki', namaPoktan: 'Wawan', namaKetua: 'Andi' },
    { kecamatan: 'Mataram Baru', desa: 'Sri Rejeki', namaPoktan: 'Wawan', namaKetua: 'Andi' },
    { kecamatan: 'Mataram Baru', desa: 'Sri Rejeki', namaPoktan: 'Wawan', namaKetua: 'Andi' },
];

const DashboardPSP = () => {
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
                <div className="text-2xl mb-5 font-semibold text-primary uppercase">Dashboard PSP</div>
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
            <div className="wrap-card grid md:grid-cols-3 grid-cols-1 gap-3">
                <DashCard label='Penerima UPPO' value={30000} />
                <DashCard label='Penerima Bantuan Subsidi' value={30000} />
                <DashCard label='Penerima Bantuan Non Subsidi' value={30000} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="peuppo h-fit md:h-[60vh] mt-6 flex md:flex-row flex-col gap-3 pb-5 md:pb-0">
                <div className="tab1 border border-slate-200 rounded-lg w-full md:w-[60%]  p-4">
                    {/* head */}
                    <HeaderDash label="Data Penerima UPPO" link="/psp/data-penerima-uppo" />
                    {/* head */}
                    {/* table */}
                    <Table className='mt-4'>
                        <TableHeader className='bg-primary-600/20 rounded-md'>
                            <TableRow >
                                <TableHead className="text-primary py-1">Kecamatan</TableHead>
                                <TableHead className="text-primary py-1">Desa</TableHead>
                                <TableHead className="text-primary py-1 ">Nama Poktan</TableHead>
                                <TableHead className="text-primary py-1 ">Nama Ketua</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.kecamatan}</TableCell>
                                    <TableCell>{data.desa}</TableCell>
                                    <TableCell>{data.namaPoktan}</TableCell>
                                    <TableCell className="">{data.namaKetua}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
                {/*  */}
                <div className="wrap-right flex flex-col w-full md:w-[40%] h-full gap-4">
                    <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-1/2 overflow-auto">
                        <HeaderDash label="Data Bantuan Subsidi" link="/psp/data-bantuan" />
                        {/* table */}
                        <Table className='mt-1'>
                            <TableHeader className='rounded-md p-0'>
                                <TableRow className='border-none p-0'>
                                    <TableHead className="text-primary p-0">Kecamatan</TableHead>
                                    <TableHead className="text-primary p-0">Desa</TableHead>
                                    <TableHead className="text-primary p-0 ">Periode</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dummyData.map((data, index) => (
                                    <TableRow className='border-none p-1' key={index}>
                                        <TableCell className='p-1'>{data.kecamatan}</TableCell>
                                        <TableCell className='p-1'>{data.desa}</TableCell>
                                        <TableCell className='p-1'>{data.namaPoktan}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* table */}
                    </div>
                    <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-1/2 overflow-auto">
                        <HeaderDash label="Data Bantuan Non Subsidi" link="/psp/data-bantuan" />
                        {/* table */}
                        {/* table */}
                        <Table className='mt-1'>
                            <TableHeader className='rounded-md p-0'>
                                <TableRow className='border-none p-0'>
                                    <TableHead className="text-primary p-0">Kecamatan</TableHead>
                                    <TableHead className="text-primary p-0">Desa</TableHead>
                                    <TableHead className="text-primary p-0 ">Periode</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {dummyData.map((data, index) => (
                                    <TableRow className='border-none p-1' key={index}>
                                        <TableCell className='p-1'>{data.kecamatan}</TableCell>
                                        <TableCell className='p-1'>{data.desa}</TableCell>
                                        <TableCell className='p-1'>{data.namaPoktan}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/* table */}
                    </div>
                </div>
            </div>
            {/* tabel */}
        </div>
    )
}

export default DashboardPSP
