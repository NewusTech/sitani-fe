import Link from 'next/link'
import React from 'react'
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

interface Bidang {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

interface PegawaiAkanPensiun {
    nama: string;
    nip: number;
    jabatan: string;
    usia: string;
    pangkat: string;
    masa_kerja: string;
    batas_usia_pensiun: number;
    sisa_tahun_bulan_pensiun: string;
    total_bulan_sisa: number;
    bidang: Bidang;
}

interface PaginationLinks {
    prev: string | null;
    next: string | null;
}

interface Pagination {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
    links: PaginationLinks;
}

interface Data {
    totalPegawai: number;
    pegawaiSudahPensiun: number;
    pegawaiAkanPensiun: PegawaiAkanPensiun[];
    pagination: Pagination;
}

interface Response {
    status: number;
    message: string;
    data: Data;
}

const DashboardKepegawaian = () => {
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: responseData, error } = useSWR<Response>(
        '/kepegawaian/dashboard?limit=10',
        (url:string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    // Handle loading and error states
    if (!responseData) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    const { pegawaiAkanPensiun } = responseData.data;

    return (
        <div className=''>
            {/* title */}
            <div className="wrap flex justify-between">
                <div className="md:text-2xl text-xl mb-4 font-semibold text-primary uppercase">Dashboard Kepegawaian</div>
            </div>
            {/* title */}
            {/* card */}
            <div className="wrap-card grid md:grid-cols-2 grid-cols-1 gap-3">
                <DashCard label='Pegawai Aktif' value={responseData.data.totalPegawai} />
                <DashCard label='Pegawai Pensiun' value={responseData.data.pegawaiSudahPensiun} />
            </div>
            {/* card */}
            {/* tabel */}
            <div className="peuppo h-fit md:h-[60vh] mt-6 flex md:flex-row flex-col gap-3 pb-5 md:pb-0">
                <div className="tab1 border border-slate-200 rounded-lg w-full p-4">
                    {/* head */}
                    <HeaderDash label="Data Pegawai Yang Mendekati Pensiun" link="/kepegawaian/data-pensiun" />
                    {/* head */}
                    {/* table */}
                    <Table className='mt-4'>
                        <TableHeader className='bg-primary-600/20 rounded-md'>
                            <TableRow>
                                <TableHead className="text-primary py-1">Nama</TableHead>
                                <TableHead className="text-primary py-1">Bidang</TableHead>
                                <TableHead className="text-primary py-1 hidden md:table-cell">Jabatan</TableHead>
                                <TableHead className="text-primary py-1 hidden md:table-cell">Usia</TableHead>
                                <TableHead className="text-primary py-1 hidden md:table-cell">Masa Kerja</TableHead>
                                <TableHead className="text-primary py-1">Sisa Tahun</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pegawaiAkanPensiun.map((pegawai, index) => (
                                <TableRow key={index}>
                                    <TableCell>{pegawai.nama}</TableCell>
                                    <TableCell>{pegawai.bidang.nama}</TableCell>
                                    <TableCell className='hidden md:table-cell'>{pegawai.jabatan}</TableCell>
                                    <TableCell className='hidden md:table-cell'>{pegawai.usia}</TableCell>
                                    <TableCell className='hidden md:table-cell'>{pegawai.masa_kerja}</TableCell>
                                    <TableCell>{pegawai.sisa_tahun_bulan_pensiun}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {/* table */}
                </div>
            </div>
            {/* tabel */}
        </div>
    );
};

export default DashboardKepegawaian;
