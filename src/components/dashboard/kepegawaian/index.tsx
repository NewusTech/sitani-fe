"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Loader, Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import DeletePopup from '@/components/superadmin/PopupDelete';

interface Response {
    status: string,
    data: ResponseData,
    message: string
}

interface ResponseData {
    data: Data[]
}

interface Data {
    id?: number;
    nama?: string;
    nip?: number;
    tempatLahir?: string;
    tglLahir?: string;
    pangkat?: string;
    golongan?: string;
    tmtPangkat?: string;
    jabatan?: string;
    tmtJabatan?: string;
    namaDiklat?: string;
    tglDiklat?: string;
    totalJam?: number;
    namaPendidikan?: string;
    tahunLulus?: number;
    jenjangPendidikan?: string;
    usia?: string;
    masaKerja?: string;
    keterangan?: string;
    status?: string;
}

const Card = ({
    color,
    title,
    text,
}: {
    color: string;
    title: string;
    text: string;
}) => {
    return (
        <div
            className={`${color} rounded-[16px] w-full h-[155px] flex flex-col items-center justify-center gap-y-10`}
        >
            <h5 className="text-neutral-50 font-semibold text-sm w-[187px] text-center">
                {title}
            </h5>
            <h1 className="text-neutral-50 text-3xl font-medium">{text}</h1>
        </div>
    );
};

const DashboardKepegawaian = () => {
    const [startDate, setstartDate] = React.useState<Date>();
    const [endDate, setendDate] = React.useState<Date>();

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataKepegawaian }: SWRResponse<Response> = useSWR(
        `/kepegawaian/get`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res?.data)
    );

    console.log(dataKepegawaian)

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/kepegawaian/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(id)
            mutate('/kepegawaian/get');
        } catch (error) {
            console.error('Failed to delete:', error);
            console.log(id)
        }
    };
    return (
        <section className="space-y-2 lg:space-y-4">
            <div className="w-full py-4 px-4 md:px-8 lg:px-8 rounded-[16px] shadow bg-neutral-50">
                <div className="flex justify-end space-x-4 items-center">
                    <div className="flex gap-x-3 text-slate-400">
                        <p className="text-neutral-900">Tahun</p>
                    </div>
                    <div className="w-full lg:w-2/12">
                        <Select
                        // value={selectedYear.toString()}
                        // onValueChange={(e: any) => setSelectedYear(e)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tahun</SelectLabel>
                                    {/* {years?.map((year) => (
                                        <SelectItem key={year} value={year.toString()}>
                                            {year}
                                        </SelectItem>
                                    ))} */}
                                    <SelectItem value="2022">2022</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-x-0 mt-2 lg:space-x-4 lg:mt-4 lg:flex lg:justify-between">
                    <Card
                        color="bg-gradient-to-b from-blue-400 via-blue-400 via-32% to-blue-400 mb-2"
                        text="10"
                        title="Jumlah Data Pegawai"
                    />
                    <Card
                        color="bg-gradient-to-b from-secondary via-secondary via-36% to-secondary"
                        text="10"
                        title="Jumlah Data Pegawai Pensiun"
                    />
                </div>
            </div>

            <div className="rounded-[16px] bg-neutral-50 w-full p-2 lg:p-8 shadow">
                <div className="text-lg lg:text-xl font-semibold text-primary uppercase text-center">Data Pegawai <br /> Yang Mendekati Pensiun</div>
                {/* table */}
                <Table className='border border-slate-200 mt-5 lg:mt-4'>
                    <TableHeader className='bg-primary-600'>
                        <TableRow >
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                No
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Nama/NIP
                                <br /> Tempat/Tgl Lahir
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Pangkat/Gol Ruang
                                TMT Pangkat
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 border border-slate-200 text-center">
                                Jabatan <br />
                                TMT Jabatan
                            </TableHead>
                            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center hidden md:table-cell">
                                Diklat Struktural
                            </TableHead>
                            <TableHead colSpan={3} className="text-primary py-1 border border-slate-200 text-center hidden md:table-cell">
                                Pendidikan Umum
                            </TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 hidden md:table-cell">Usia</TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 hidden md:table-cell">Masa Kerja</TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1 hidden md:table-cell">Ket</TableHead>
                            <TableHead rowSpan={2} className="text-primary py-1">Status</TableHead>
                        </TableRow>
                        <TableRow>
                            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
                                Nama  DIklat
                            </TableHead>
                            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
                                Tanggal
                            </TableHead>
                            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
                                Jam
                            </TableHead>
                            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
                                Nama
                            </TableHead>
                            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
                                Tahun Lulus
                            </TableHead>
                            <TableHead className="text-primary py-1 hidden md:table-cell border border-slate-200 text-center">
                                Jenjang
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataKepegawaian?.data.data && dataKepegawaian?.data.data.length > 0 ? (
                            dataKepegawaian?.data.data.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className=''>
                                        {item.nama} <br />
                                        {item.nip} <br />
                                        {item.tempatLahir}, {item.tglLahir}
                                    </TableCell>
                                    <TableCell className=''>
                                        {item.pangkat} / {item.golongan} <br />
                                        TMT: {item.tmtPangkat}
                                    </TableCell>
                                    <TableCell className=''>
                                        {item.jabatan} <br />
                                        TMT: {item.tmtJabatan}
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell'>
                                        {item.namaDiklat} <br />
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell'>
                                        {item.tglDiklat} <br />
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell'>
                                        {item.totalJam} Jam
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell'>
                                        {item.namaPendidikan} <br />
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell'>
                                        {item.tahunLulus} <br />
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell'>
                                        {item.jenjangPendidikan}
                                    </TableCell>
                                    <TableCell className='hidden md:table-cell'>{item.usia}</TableCell>
                                    <TableCell className='hidden md:table-cell'>{item.masaKerja}</TableCell>
                                    <TableCell className='hidden md:table-cell'>{item.keterangan}</TableCell>
                                    <TableCell className=''>
                                        <div className="p-1 text-xs rounded bg-slate-200 text-center">
                                            {item.status}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* table */}

                {/* pagination */}
                <div className="pagination md:mb-[0px] flex md:justify-end justify-center">
                    <Pagination className='md:justify-end'>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    2
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
                {/* pagination */}
            </div>
        </section>
    );
};

export default DashboardKepegawaian;
