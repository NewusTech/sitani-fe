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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Dummy data untuk tabel
const dummyData = [
    { komoditas: 'Jagung', panen: '3400', tanam: '4354', puso: '3432', },
    { komoditas: 'Padi', panen: '3400', tanam: '4354', puso: '3432', },
    { komoditas: 'Kedelai', panen: '3400', tanam: '4354', puso: '3432', },
    { komoditas: 'Kedelai', panen: '3400', tanam: '4354', puso: '3432', },
    { komoditas: 'Cabai', panen: '3400', tanam: '4354', puso: '3432', },
];


const DashboardKJFKabupaten = () => {
    // State untuk menyimpan nilai filter yang dipilih
    const [selectedFilter, setSelectedFilter] = useState<string>('year');

    // State untuk menyimpan data yang dipilih
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    // Fungsi untuk menangani klik tombol
    const handleFilterClick = (filter: string) => {
        setSelectedFilter(filter);
    };

    // Fungsi untuk menangani perubahan nilai tahun
    const handleYearChange = (value: string) => {
        setSelectedYear(value);
        console.log('Selected Year:', value); // Log nilai tahun yang dipilih
    };

    // Fungsi untuk menangani perubahan nilai bulan
    const handleMonthChange = (value: string) => {
        setSelectedMonth(value);
        console.log('Selected Month:', value); // Log nilai bulan yang dipilih
    };
    return (
        <div className=''>
            {/* title */}
            <div className="text-xl md:text-2xl mb-4 font-semibold text-primary uppercase">Dashboard KJF Kabupaten</div>
            <div className="wrap flex flex-col gap-3 md:flex-row justify-between">
                <div className="w-full md:w-[400px]">
                    <Select >
                        <SelectTrigger>
                            <SelectValue placeholder="Kecamatan/Desa" className='text-2xl' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Desa 1">Desa 1</SelectItem>
                            <SelectItem value="Desa 2">Desa 2</SelectItem>
                            <SelectItem value="Desa 3">Desa 3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* filter */}
                <div className="wrap items-center mb-5 flex gap-3">
                    <div className="text-lg flex gap-4">
                        <button
                            className={`${selectedFilter === 'year' ? 'aktif text-primary font-semibold' : 'text-black/70'
                                }`}
                            onClick={() => handleFilterClick('year')}
                        >
                            Tahun
                        </button>
                        <button
                            className={`${selectedFilter === 'month' ? 'aktif text-primary font-semibold' : 'text-black/70'
                                }`}
                            onClick={() => handleFilterClick('month')}
                        >
                            Bulan
                        </button>
                    </div>

                    {selectedFilter === 'year' && (
                        <div className="tahun">
                            <Select
                                onValueChange={handleYearChange}
                                value={selectedYear || ''}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Tahun" className='text-2xl' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2024">2024</SelectItem>
                                    <SelectItem value="2023">2023</SelectItem>
                                    <SelectItem value="2022">2022</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {selectedFilter === 'month' && (
                        <div className="bulan">
                            <Select
                                onValueChange={handleMonthChange}
                                value={selectedMonth || ''}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Bulan" className='text-2xl' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="januari">Januari</SelectItem>
                                    <SelectItem value="februari">Februari</SelectItem>
                                    <SelectItem value="maret">Maret</SelectItem>
                                    {/* Tambahkan bulan lainnya jika perlu */}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                {/* filter */}
            </div>
            {/* title */}
            {/* card */}
            <div className="wrap-card grid md:grid-cols-3 grid-cols-1 gap-3">
                <DashCard label='Jumlah Panen Padi' value={43900} />
                <DashCard label='Jumlah Tanam Padi' value={22414} />
                <DashCard label='Jumlah Puso' value={22414} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="tablee h-fit md:h-[320px] mt-6 flex md:flex-row flex-col gap-3">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tanaman Palawija" link="/korluh/palawija" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Komoditas</TableHead>
                                <TableHead className="text-primary p-0">Panen</TableHead>
                                <TableHead className="text-primary p-0">Tanam</TableHead>
                                <TableHead className="text-primary p-0">Puso</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.panen}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.tanam}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.puso}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Sayuran dan Buah" link="/korluh/sayuran-buah" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Nama Tanaman</TableHead>
                                <TableHead className="text-primary p-0">Hasil Produksi</TableHead>
                                <TableHead className="text-primary p-0">Luas Tanaman</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.panen}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.tanam}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>
            {/*  */}
            <div className="tablee h-fit md:h-[320px] mt-3 flex md:flex-row flex-col gap-3">
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tanaman Hias" link="/korluh/tanaman-hias" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Nama Tanaman</TableHead>
                                <TableHead className="text-primary p-0">Hasil Produksi</TableHead>
                                <TableHead className="text-primary p-0">Luas Tanaman</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.panen}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.tanam}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
                {/*  */}
                <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-full overflow-auto">
                    <HeaderDash label="Tanaman Biofarmaka" link="/korluh/tanaman-biofarmaka" />
                    {/* table */}
                    <Table className='mt-1'>
                        <TableHeader className='rounded-md p-0'>
                            <TableRow className='border-none p-0'>
                                <TableHead className="text-primary p-0">Nama Tanaman</TableHead>
                                <TableHead className="text-primary p-0">Hasil Produksi</TableHead>
                                <TableHead className="text-primary p-0">Luas Tanaman</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow className='border-none p-0 py-1' key={index}>
                                    <TableCell className='p-0 py-1'>{data.komoditas}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.panen}</TableCell>
                                    <TableCell className='p-0 py-1'>{data.tanam}</TableCell>
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

export default DashboardKJFKabupaten
