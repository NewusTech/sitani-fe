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
    { kecamatan: 'Way Jepara', nama: 'Rudi', desa: 'Jepara', NIP: '32432423', Gol: 'penata' },
    { kecamatan: 'Way Bungur', nama: 'Rudi', desa: 'Sido Mulyo', NIP: '32432423', Gol: 'penata' },
    { kecamatan: 'Mataram Baru', nama: 'Rudi', desa: 'Sri Rejeki', NIP: '32432423', Gol: 'penata' },
    { kecamatan: 'Mataram Baru', nama: 'Rudi', desa: 'Sri Rejeki', NIP: '32432423', Gol: 'peenata' },
    { kecamatan: 'Mataram Baru', nama: 'Rudi', desa: 'Sri Rejeki', NIP: '32432423', Gol: 'penata' },
];

const DashboardPenyuluhan = () => {
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
                <div className="text-xl md:text-2xl mb-4 font-semibold text-primary uppercase">Dashboard Penyuluhan</div>
            </div>
            {/* title */}
            {/* card */}
            <div className="wrap-card grid md:grid-cols-2 grid-cols-1 gap-3">
                <DashCard label='Penyuluh Kabupaten' value={430} />
                <DashCard label='Penyuluh Kecamatan' value={324} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="peuppo h-fit md:h-[60vh] mt-6 flex md:flex-row flex-col gap-3 pb-5 md:pb-0">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Penyuluh Kabupaten" link="/penyuluhan/data-kabupaten" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Kecamatan</TableHead>
                                <TableHead className="text-primary p-0">Nama</TableHead>
                                <TableHead className="text-primary p-0">NIP</TableHead>
                                <TableHead className="text-primary p-0 ">Gol</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.kecamatan}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.nama}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.NIP}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.Gol}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Penyuluh Kecamatan" link="/penyuluhan/data-kecamatan" />
                    {/* table */}
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                            <TableHead className="text-primary p-0">Kecamatan</TableHead>
                                <TableHead className="text-primary p-0">Nama</TableHead>
                                <TableHead className="text-primary p-0">Desa</TableHead>
                                <TableHead className="text-primary p-0">NIP</TableHead>
                                <TableHead className="text-primary p-0 ">Gol</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                   <TableCell className='p-0 py-1'>{data.kecamatan}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.nama}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.desa}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.NIP}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.Gol}</TableCell>
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

export default DashboardPenyuluhan
