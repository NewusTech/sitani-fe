"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
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
import PaginationTable from '@/components/PaginationTable'
import Swal from 'sweetalert2';


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

const PenyuluhDataKecamatan = () => {
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    };
    // pagination
    // serach
    const [search, setSearch] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };
    // serach
    // limit
    const [limit, setLimit] = useState(10);
    // limit
    const { data: dataKecamatan }: SWRResponse<Response> = useSWR(
        // `/penyuluh-kecamatan/get?page=${searchParams.get("page")}&limit=1`,
        `/penyuluh-kecamatan/get?page=${currentPage}&search=${search}&limit=${limit}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // DELETE
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/penyuluh-kecamatan/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil dihapus!',
                text: 'Data sudah disimpan sistem!',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
                customClass: {
                    title: 'text-2xl font-semibold text-green-600',
                    icon: 'text-green-500 animate-bounce',
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400', // Gradasi warna yang lembut
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });
            // alert
            console.log(id)
            // Update the local data after successful deletion
            mutate(`/penyuluh-kecamatan/get?page=${currentPage}&search=${search}&limit=${limit}`);
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal menghapus data!';
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan!',
                text: errorMessage,
                showConfirmButton: true,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                customClass: {
                    title: 'text-2xl font-semibold text-red-600',
                    icon: 'text-red-500 animate-bounce',
                },
                backdrop: 'rgba(0, 0, 0, 0.4)',
            });
            console.error("Failed to create user:", error);
        }
    };

    // console.log(dataKecamatan);

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Daftar Penempatan Penyuluh Pertanian Kecamatan</div>
            {/* title */}
            {/* top */}
            <div className="header flex gap-2 justify-between items-center">
                <div className="search md:w-[50%]">
                    <Input
                        autoFocus
                        type="text"
                        placeholder="Cari"
                        value={search}
                        onChange={handleSearchChange}
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="btn flex gap-2">
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                        <UnduhIcon />
                        <div className="hidden md:block transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
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
                    <Link href="/penyuluhan/data-kecamatan/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium w-full transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Tambah Data
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
                    {dataKecamatan?.data?.data && dataKecamatan?.data?.data?.length > 0 ? (
                        dataKecamatan.data.data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {(currentPage - 1) * limit + (index + 1)}
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    {item.kecamatanId}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {item?.desa?.map((desa, index) => (
                                        <span key={desa.id}>
                                            {desa.nama}
                                            {index < (item?.desa?.length ?? 0) - 1 && ", "}
                                        </span>
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
                                        <DeletePopup onDelete={() => handleDelete(item.id || '')} />
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
            {/* pagination */}
            <div className="pagi flex items-center lg:justify-end justify-center">
                {dataKecamatan?.data.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataKecamatan?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default PenyuluhDataKecamatan