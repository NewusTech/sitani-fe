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
    {
        nama: 'Rudi',
        bidang: 'Ketahanan Pangan',
        nip: '345345',
        pangkatGol: 'Penata Muda/IVC',
        jabatan: 'Penata'
        , masakerja: "12"
    },
    {
        nama: 'Budi',
        bidang: 'Hortikultura',
        nip: '123456',
        pangkatGol: 'Penata Muda/IIIA',
        jabatan: 'Penyuluh'
        , masakerja: "12"
    },
    {
        nama: 'Siti',
        bidang: 'Perikanan',
        nip: '654321',
        pangkatGol: 'Penata Muda/IVA',
        jabatan: 'Pengawas'
        , masakerja: "12"
    },
    {
        nama: 'Ayu',
        bidang: 'Peternakan',
        nip: '789012',
        pangkatGol: 'Penata/IIIB',
        jabatan: 'Manajer'
        , masakerja: "12"
    },
    {
        nama: 'Andi',
        bidang: 'Tanaman Pangan',
        nip: '234567',
        pangkatGol: 'Penata Muda/IIIC',
        jabatan: 'Koordinator',
        masakerja: "12"
    }
];


const DashboardKepegawaian = () => {
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
                <div className="md:text-2xl text-xl mb-4 font-semibold text-primary uppercase">Dashboard Kepegawaian</div>
            </div>
            {/* title */}
            {/* card */}
            <div className="wrap-card grid md:grid-cols-2 grid-cols-1 gap-3">
                <DashCard label='Pegawai Aktif' value={3210} />
                <DashCard label='Pegawai Pensiun' value={231} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="peuppo h-fit md:h-[60vh] mt-6 flex md:flex-row flex-col gap-3 pb-5 md:pb-0">
                <div className="tab1 border border-slate-200 rounded-lg w-full  p-4">
                    {/* head */}
                    <HeaderDash label="Data Pegawai Yang Mendekati Pensiun" link="/kepegawaian/data-pensiun" />
                    {/* head */}
                    {/* table */}
                    <Table className='mt-4'>
                        <TableHeader className='bg-primary-600/20 rounded-md'>
                            <TableRow >
                                <TableHead className="text-primary py-1">Nama</TableHead>
                                <TableHead className="text-primary py-1">NIP</TableHead>
                                <TableHead className="text-primary py-1 ">Bidang</TableHead>
                                <TableHead className="text-primary py-1 ">Usia</TableHead>
                                <TableHead className="text-primary py-1 ">Pangkat/Golongan</TableHead>
                                <TableHead className="text-primary py-1 ">Masa Kerja</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyData.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.nama}</TableCell>
                                    <TableCell>{data.bidang}</TableCell>
                                    <TableCell>{data.nip}</TableCell>
                                    <TableCell>{data.pangkatGol}</TableCell>
                                    <TableCell>{data.jabatan}</TableCell>
                                    <TableCell>{data.masakerja}</TableCell>
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

export default DashboardKepegawaian
