import Link from 'next/link';
import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import HeaderDash from '@/components/HeaderDash';
import DashCard from '@/components/DashCard';
import useSWR, { SWRResponse } from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage';
import PaginationTable from '@/components/PaginationTable';

const DashboardPSP = () => {
    // State untuk menyimpan nilai yang dipilih
    const [selectedFilter, setSelectedFilter] = useState<string>('year');

    // date
    const formatDateToDDMMYYYY = (isoString: string | number | Date) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero if needed
        const year = date.getFullYear(); // Get full year

        return `${day}/${month}/${year}`; // Return formatted date
    };

    // Fungsi untuk menangani klik tombol
    const handleFilterClick = (filter: string) => {
        setSelectedFilter(filter);
        console.log(filter); // Log nilai yang dipilih ke console
    };

    // Interface untuk data API
    interface Kecamatan {
        id: number;
        nama: string;
    }

    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
    }

    interface Bantuan {
        id: number;
        kecamatanId: number;
        desaId: number;
        jenisBantuan: string;
        periode: string;
        keterangan: string;
        kecamatan: Kecamatan;
        desa: Desa;
    }

    interface PenerimaUppo {
        id: number;
        kecamatanId: number;
        desaId: number;
        namaPoktan: string;
        ketuaPoktan: string;
        titikKoordinat: string;
        kecamatan: Kecamatan;
        desa: Desa;
    }

    interface PSPDashboardData {
        bantuanNonSubsidiCount: number;
        bantuanSubsidiCount: number;
        uppoCount: number;
        pspBantuanNonSubsidi: Bantuan[];
        pspBantuanSubsidi: Bantuan[];
        pspPenerimaUppo: PenerimaUppo[];
    }

    interface Response {
        status: number;
        message: string;
        data: PSPDashboardData;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

console.log("filter = ", selectedFilter);
    const { data: dataPSP }: SWRResponse<Response> = useSWR(
        `/psp/dashboard/get?type=${selectedFilter}&uppoLimit=10&bantuanLimit=10`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    const bantuanSubsidi = dataPSP?.data?.pspBantuanSubsidi || [];
    const bantuanNonSubsidi = dataPSP?.data?.pspBantuanNonSubsidi || [];
    const penerimaUppo = dataPSP?.data?.pspPenerimaUppo || [];

    return (
        <div>
            {/* Title */}
            <div className="wrap flex md:flex-row flex-col mb-4 justify-between">
                <div className="md:text-2xl text-xl font-semibold text-primary uppercase">Dashboard PSP</div>
                {/* Filter */}
                <div className="text-base md:text-lg flex gap-4">
                    {['year', 'month', 'week', 'today'].map((filter) => (
                        <button
                            key={filter}
                            className={`${selectedFilter === filter ? 'aktif text-primary font-semibold' : 'text-black/70'}`}
                            onClick={() => handleFilterClick(filter)}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            {/* Card */}
            <div className="wrap-card grid md:grid-cols-3 grid-cols-1 gap-3">
                <DashCard label='Penerima UPPO' value={dataPSP?.data?.uppoCount || 0} />
                <DashCard label='Penerima Bantuan Subsidi' value={dataPSP?.data?.bantuanSubsidiCount || 0} />
                <DashCard label='Penerima Bantuan Non Subsidi' value={dataPSP?.data?.bantuanNonSubsidiCount || 0} />
            </div>
            {/* Tabel */}
            <div className="peuppo h-fit md:h-[60vh] mt-6 flex md:flex-row flex-col gap-3 pb-5 md:pb-0">
                {/* Penerima UPPO Table */}
                <div className="tab1 border border-slate-200 rounded-lg w-full md:w-[60%] p-4">
                    <HeaderDash label="Data Penerima UPPO" link="/psp/data-penerima-uppo" />
                    <Table className='mt-4'>
                        <TableHeader className='bg-primary-600/20 rounded-md'>
                            <TableRow>
                                <TableHead className="text-primary py-1">Kecamatan</TableHead>
                                <TableHead className="text-primary py-1">Desa</TableHead>
                                <TableHead className="text-primary py-1">Nama Poktan</TableHead>
                                <TableHead className="text-primary py-1">Nama Ketua</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {penerimaUppo.map((data) => (
                                <TableRow key={data.id}>
                                    <TableCell>{data.kecamatan.nama}</TableCell>
                                    <TableCell>{data.desa.nama}</TableCell>
                                    <TableCell>{data.namaPoktan}</TableCell>
                                    <TableCell>{data.ketuaPoktan}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Right Side Tables */}
                <div className="wrap-right flex flex-col w-full md:w-[40%] h-full gap-4">
                    {/* Data Bantuan Subsidi */}
                    <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-1/2 overflow-auto">
                        <HeaderDash label="Data Bantuan Subsidi" link="/psp/data-bantuan" />
                        <Table className='mt-1'>
                            <TableHeader className='rounded-md p-0'>
                                <TableRow className='border-none p-0'>
                                    <TableHead className="text-primary p-0">Kecamatan</TableHead>
                                    <TableHead className="text-primary p-0">Desa</TableHead>
                                    <TableHead className="text-primary p-0">Periode</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bantuanSubsidi.map((data) => (
                                    <TableRow className='border-none p-1' key={data.id}>
                                        <TableCell className='p-1'>{data.kecamatan.nama}</TableCell>
                                        <TableCell className='p-1'>{data.desa.nama}</TableCell>
                                        <TableCell className='p-1'>
                                            {formatDateToDDMMYYYY(data.periode)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {/* Data Bantuan Non Subsidi */}
                    <div className="tab2 border border-slate-200 rounded-lg p-4 w-full h-1/2 overflow-auto">
                        <HeaderDash label="Data Bantuan Non Subsidi" link="/psp/data-bantuan" />
                        <Table className='mt-1'>
                            <TableHeader className='rounded-md p-0'>
                                <TableRow className='border-none p-0'>
                                    <TableHead className="text-primary p-0">Kecamatan</TableHead>
                                    <TableHead className="text-primary p-0">Desa</TableHead>
                                    <TableHead className="text-primary p-0">Periode</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bantuanNonSubsidi.map((data) => (
                                    <TableRow className='border-none p-1' key={data.id}>
                                        <TableCell className='p-1'>{data.kecamatan.nama}</TableCell>
                                        <TableCell className='p-1'>{data.desa.nama}</TableCell>
                                        <TableCell className='p-1'>{formatDateToDDMMYYYY(data.periode)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPSP;
