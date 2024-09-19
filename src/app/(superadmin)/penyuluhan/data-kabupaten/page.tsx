"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import Swal from 'sweetalert2';
import PaginationTable from '@/components/PaginationTable'
import FilterTable from '@/components/FilterTable'
import PenyuluhKabPrint from '@/components/Print/Penyuluhan/PenyuluhanKab'


const PenyuluhDataKabupaten = () => {

    // INTEGRASI
    // GET LIST
    interface Kecamatan {
        id: string;
        nama: string
    }
    interface User {
        id?: string; // Ensure id is a string
        nama: string;
        nip: string;
        pangkat: string;
        golongan: string;
        keterangan: string;
        kecamatan: Kecamatan[];
    }

    interface Response {
        status: string,
        data: {
            data: User[];
            pagination: Pagination;
        },
        message: string
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
    const { data: dataKabupaten }: SWRResponse<Response> = useSWR(
        `/penyuluh-kabupaten/get?page=${currentPage}&search=${search}&limit=${limit}`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    // GET LIST
    // DELETE
    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/penyuluh-kabupaten/delete/${id}`, {
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
            mutate(`/penyuluh-kabupaten/get?page=${currentPage}&search=${search}&limit=${limit}`);
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
        } mutate(`/penyuluh-kabupaten/get?page=${currentPage}&search=${search}&limit=${limit}`);
    };
    // INTEGRASI

    // Filter table
    const columns = [
        { label: "Wilayah Desa Binaan", key: "wilayah" },
        { label: "Nama", key: "nama" },
        { label: "NIP", key: "nip" },
        { label: "Pangakt", key: "pangkat" },
        { label: "Keterangan", key: "keterangan" },
        { label: "Aksi", key: "aksi" }
    ];

    const getDefaultCheckedKeys = () => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth <= 768) {
                return ["wilayah", "nama", "aksi"];
            } else {
                return ["wilayah", "nama", "nip", "pangkat", "keterangan", "aksi"];
            }
        }
        return [];
    };

    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setVisibleColumns(getDefaultCheckedKeys());
        const handleResize = () => {
            setVisibleColumns(getDefaultCheckedKeys());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isClient) {
        return null;
    }

    const handleFilterChange = (key: string, checked: boolean) => {
        setVisibleColumns(prev =>
            checked ? [...prev, key] : prev.filter(col => col !== key)
        );
    };
    // Filter Table

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary capitalize">Daftar Penempatan Penyuluh Pertanian Kabupaten</div>
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
                {/* unduh */}
                <PenyuluhKabPrint />
                {/* unduh */}
            </div>
            {/*  */}
            <div className="wrap-filter flex justify-between items-center mt-4 ">
                <div className="left gap-2 flex justify-start items-center">
                    <div className="filter-table w-[40px] h-[40px]">
                        <FilterTable
                            columns={columns}
                            defaultCheckedKeys={getDefaultCheckedKeys()}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                </div>
                <div className="right transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                    <Link href="/penyuluhan/data-kabupaten/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
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
                        {visibleColumns.includes('nama') && (
                            <TableHead className="text-primary py-3">Nama</TableHead>
                        )}
                        {visibleColumns.includes('nip') && (
                            <TableHead className="text-primary py-3">NIP</TableHead>
                        )}
                        {visibleColumns.includes('pangkat') && (
                            <TableHead className="text-primary py-3 ">
                                Pangkat/Gol
                            </TableHead>
                        )}
                        {visibleColumns.includes('wilayah') && (
                            <TableHead className="text-primary py-3 ">Wilayah Desa Binaan (Kecamatan)</TableHead>
                        )}
                        {visibleColumns.includes('keterangan') && (
                            <TableHead className="text-primary py-3 ">Keterangan</TableHead>
                        )}
                        {visibleColumns.includes('aksi') && (
                            <TableHead className="text-primary py-3 text-center">Aksi</TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataKabupaten?.data?.data && dataKabupaten?.data?.data?.length > 0 ? (
                        dataKabupaten?.data?.data?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {(currentPage - 1) * limit + (index + 1)}
                                </TableCell>
                                {visibleColumns.includes('nama') && (
                                    <TableCell>
                                        {item.nama}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('nip') && (
                                    <TableCell>
                                        {item.nip}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('pangkat') && (
                                    <TableCell className=''>
                                        {item.pangkat}, {item.golongan}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('wilayah') && (
                                    <TableCell className=''>
                                        {item.kecamatan.map((kec, index) => (
                                            <span key={kec.id}>
                                                {kec.nama}
                                                {index < item.kecamatan.length - 1 && ", "}
                                            </span>
                                        ))}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('keterangan') && (
                                    <TableCell className=''>
                                        {item.keterangan}
                                    </TableCell>
                                )}
                                {visibleColumns.includes('aksi') && (
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Link className='' href={`/penyuluhan/data-kabupaten/detail/${item.id}`}>
                                                <EyeIcon />
                                            </Link>
                                            <Link
                                                href={`/penyuluhan/data-kabupaten/edit/${item.id}`}
                                            >
                                                <EditIcon />
                                            </Link>
                                            <DeletePopup onDelete={() => handleDelete(item.id || '')} />
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {/* table */}

            {/* pagination */}
            <div className="pagi flex items-center lg:justify-end justify-center">
                {dataKabupaten?.data.pagination.totalCount as number > 1 && (
                    <PaginationTable
                        currentPage={currentPage}
                        totalPages={dataKabupaten?.data.pagination.totalPages as number}
                        onPageChange={onPageChange}
                    />
                )}
            </div>
            {/* pagination */}
        </div>
    )
}

export default PenyuluhDataKabupaten