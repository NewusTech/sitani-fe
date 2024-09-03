"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'

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

import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import { useSearchParams } from 'next/navigation'
import Paginate from '@/components/ui/paginate'

const PenyuluhDataKecamatan = () => {
    interface Desa {
        id: string;
        nama: string;
        kecamatanId: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Data {
        id?: string;
        kecamatanId?: string;
        nama?: string;
        nip?: string;
        pangkat?: string;
        golongan?: string;
        keterangan?: string;
        desa?: Desa[];
    }

    interface Response {
        status: string;
        message: string;
        data: {
            data: Data[];
            pagination: Pagination;
        };
    }

    interface Pagination {
        page: number;
        perPage: number;
        totalPages: number;
        totalCount: number;
        links: {
            prev: string | null;
            next: string | null;
        };
    }


    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const searchParams = useSearchParams();

    const { data: dataUser }: SWRResponse<Response> = useSWR(
        // `/penyuluh-kecamatan/get?page=${searchParams.get("page")}&limit=1`,
        `/penyuluh-kecamatan/get?page=${searchParams.get("page")}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    const data: Data[] = [
        {
            kecamatanId: "Sukadana",
            // wilayahDesaBinaan: "Melinting, Braja Selebah, Labuhan Maringgai",
            nama: "Hardono, S.P",
            nip: "123456789",
            pangkat: "Pembina Utama",
            golongan: "IV/a",
            keterangan: "Keterangan"
        },
        {
            kecamatanId: "Sukadana",
            // wilayahDesaBinaan: "Melinting, Braja Selebah, Labuhan Maringgai",
            nama: "Hardono, S.P",
            nip: "123456789",
            pangkat: "Pembina Utama",
            golongan: "IV/a",
            keterangan: "Keterangan"
        },
    ];

    console.log(dataUser);

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Daftar Penempatan Penyuluh Pertanian Kecamatan</div>
            {/* title */}
            {/* top */}
            <div className="header flex gap-2 justify-between items-center">
                <div className="search md:w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="btn flex gap-2">
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <UnduhIcon />
                        <div className="hidden md:block">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <PrintIcon />
                        <div className="hidden md:block">
                            Print
                        </div>
                    </Button>
                </div>
            </div>
            {/*  */}
            <div className="wrap-filter flex justify-between items-center mt-4 ">
                <div className="left gap-2 flex justify-start items-center">
                    <div className="fil-kect w-[185px]">
                        <Select >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Kecamatan" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="filter-table w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="right">
                    <Link href="/penyuluhan/data-kecamatan/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium w-full'>
                        Tambah
                    </Link>
                </div>
            </div>
            {/* top */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow >
                        <TableHead className="text-primary py-3">No</TableHead>
                        <TableHead className="text-primary py-3 hidden md:table-cell">Kecamatan</TableHead>
                        <TableHead className="text-primary py-3 hidden md:table-cell">Wilayah Desa Binaan</TableHead>
                        <TableHead className="text-primary py-3">Nama</TableHead>
                        <TableHead className="text-primary py-3">NIP</TableHead>
                        <TableHead className="text-primary py-3 hidden md:table-cell">
                            Pangkat
                        </TableHead>
                        <TableHead className="text-primary py-3 hidden md:table-cell">Gol</TableHead>
                        <TableHead className="text-primary py-3 hidden md:table-cell ">Keterangan</TableHead>
                        <TableHead className="text-primary py-3 text-center">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataUser?.data?.data && dataUser?.data?.data?.length > 0 ? (
                        dataUser.data.data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {index + 1}
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    {item.kecamatanId}
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    {item.desa?.map((desa) => (
                                        <div key={desa.id}>
                                            {desa.nama}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    {item.nama}
                                </TableCell>
                                <TableCell>
                                    {item.nip}
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    {item.pangkat}
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    {item.golongan}
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    {item.keterangan}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Link className='' href="/penyuluhan/data-kecamatan/detail">
                                            <EyeIcon />
                                        </Link>
                                        <Link
                                            href={`/penyuluhan/data-kecamatan/edit/${item.id}`}
                                        >
                                            <EditIcon />
                                        </Link>
                                        <DeletePopup onDelete={() => { }} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className='text-center'>Tidak Ada Data</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* table */}

            <Paginate url='/penyuluhan/data-kecamatan' pagination={dataUser?.data?.pagination} />
        </div>
    )
}

export default PenyuluhDataKecamatan