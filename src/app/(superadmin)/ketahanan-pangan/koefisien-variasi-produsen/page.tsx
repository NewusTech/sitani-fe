"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import Link from 'next/link'
import { id } from 'date-fns/locale';
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
import { format } from "date-fns"
import EyeIcon from '../../../../../public/icons/EyeIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import EditIcon from '../../../../../public/icons/EditIcon'
import useLocalStorage from '@/hooks/useLocalStorage'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useSWR, { mutate, SWRResponse } from 'swr'
import Swal from 'sweetalert2'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import KoefisienVariasiProdusenPrint from '@/components/Print/KetahananPangan/Koefisien-Variasi-Produsen'
import TambahIcon from '../../../../../public/icons/TambahIcon'

interface Komoditas {
    id: number;
    nama: string;
    createdAt: string; // ISO 8601 format date-time
    updatedAt: string; // ISO 8601 format date-time
}

interface ListItem {
    id: number;
    kepangCvProdusenId: number;
    kepangMasterKomoditasId: number;
    nilai: number;
    createdAt: string; // ISO 8601 format date-time
    updatedAt: string; // ISO 8601 format date-time
    komoditas: Komoditas;
}

interface DataItem {
    id: number;
    bulan: string; // ISO 8601 format date-time
    createdAt: string; // ISO 8601 format date-time
    updatedAt: string; // ISO 8601 format date-time
    list: ListItem[];
}

interface Response {
    status: number;
    message: string;
    data: DataItem[];
}

const KoefisienVariasiProdusen = () => {
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

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

    const [tahun, setTahun] = React.useState("2024");
    const { data, error } = useSWR<Response>(
        `/kepang/cv-produsen/get?year=${tahun}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;

    const allKomoditas = new Set<string>();
    data.data?.forEach((item) => {
        item.list.forEach((komoditas) => {
            allKomoditas.add(komoditas.komoditas.nama);
        });
    });
    const uniqueKomoditas = Array.from(allKomoditas);

    const handleDelete = async (id: string) => {
        try {
            await axiosPrivate.delete(`/kepang/cv-produsen/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(id)
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
            // Update the local data after successful deletion
            mutate('/kepang/cv-produsen/get');
        } catch (error) {
            console.error('Failed to delete:', error);
            console.log(id)
            // Add notification or alert here for user feedback
        }
    };

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary capitalize">Data Coefesien Variansi (CV) Tk. Produsen</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="header flex gap-2 justify-between lg:justify-end items-center">
                        {/* <div className="search md:w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div> */}
                        {/* print */}
                        <KoefisienVariasiProdusenPrint
                            urlApi={`/kepang/cv-produsen/get?year=${tahun}`}
                            tahun={tahun}
                        />
                        {/* print */}
                    </div>
                    {/* top */}
                    <div className="flex gap-2 lg:justify-between lg:items-center w-full mt-4">
                        <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full">
                            <div className="w-auto">
                                <Select
                                    onValueChange={(value) => setTahun(value)}
                                    value={tahun}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tahun" className='text-2xl' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2018">2018</SelectItem>
                                        <SelectItem value="2019">2019</SelectItem>
                                        <SelectItem value="2020">2020</SelectItem>
                                        <SelectItem value="2021">2021</SelectItem>
                                        <SelectItem value="2022">2022</SelectItem>
                                        <SelectItem value="2023">2023</SelectItem>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2025">2025</SelectItem>
                                        <SelectItem value="2026">2026</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* <div className="w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div> */}
                        </div>
                        <div className="w-full">
                            <div className="flex justify-end">
                                <Link href="/ketahanan-pangan/koefisien-variasi-produsen/tambah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium text-[12px] lg:text-sm transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                                    Tambah Data
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* top */}
                </>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
                <>
                    {/* kolom 1 */}
                    <div className="flex justify-between">
                        <div className="flex gap-2 w-full">

                            {/* filter tahun */}
                            <div className="w-full">
                                <Select
                                    onValueChange={(value) => setTahun(value)}
                                    value={tahun || ""}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tahun" className='text-2xl'>
                                            {tahun ? tahun : "Tahun"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="2018">2018</SelectItem>
                                        <SelectItem value="2019">2019</SelectItem>
                                        <SelectItem value="2020">2020</SelectItem>
                                        <SelectItem value="2021">2021</SelectItem>
                                        <SelectItem value="2022">2022</SelectItem>
                                        <SelectItem value="2023">2023</SelectItem>
                                        <SelectItem value="2024">2024</SelectItem>
                                        <SelectItem value="2025">2025</SelectItem>
                                        <SelectItem value="2026">2026</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* filter tahun */}

                            {/* filter table */}
                            {/* <FilterTable
                                columns={columns}
                                defaultCheckedKeys={getDefaultCheckedKeys()}
                                onFilterChange={handleFilterChange}
                            /> */}
                            {/* filter table */}

                            {/* print */}
                            <KoefisienVariasiProdusenPrint
                                urlApi={`/kepang/cv-produsen/get?year=${tahun}`}
                                tahun={tahun}
                            />
                            {/* print */}

                            {/* button tambah */}
                            <Link
                                href="/ketahanan-pangan/koefisien-variasi-produsen/tambah"
                                className='bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 border border-primary text-center font-medium justify-center flex gap-2 items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 w-fit'>
                                <TambahIcon />
                            </Link>
                            {/* button tambah */}

                        </div>
                    </div>
                    {/* kolom 1 */}
                </>
            </div>
            {/* Mobile */}

            {/* table */}
            <Table className='border border-slate-200 mt-4 mb-20 lg:mb-0 text-xs md:text-sm rounded-lg'>
                <TableHeader className='bg-primary-600'>
                    <TableRow>
                        <TableHead className="text-primary py-3">No</TableHead>
                        <TableHead className="text-primary py-3">Bulan</TableHead>
                        {uniqueKomoditas.map((komoditas) => (
                            <TableHead key={komoditas} className="text-primary py-3">{komoditas}</TableHead>
                        ))}
                        {/* <TableHead className="text-primary py-3">Aksi</TableHead> */}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.data?.length > 0 ? (
                        data.data.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{format(new Date(item.bulan), 'MMMM', { locale: id })}</TableCell>
                                {uniqueKomoditas.map((komoditas) => {
                                    const foundCommodity = item.list.find(k => k.komoditas.nama === komoditas);
                                    return (
                                        <TableCell key={komoditas}>
                                            {foundCommodity ? (
                                                <div className="flex items-center gap-4">
                                                    <Link href={`/ketahanan-pangan/koefisien-variasi-produsen/detail/${foundCommodity.id}`}>
                                                        <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                                                            <EyeIcon />
                                                        </div>
                                                    </Link>
                                                    <Link href={`/ketahanan-pangan/koefisien-variasi-produsen/edit/${foundCommodity.id}`}>
                                                        <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                                                            <EditIcon />
                                                        </div>
                                                    </Link>
                                                    <DeletePopup onDelete={() => handleDelete(String(foundCommodity?.id))} />
                                                    <div className="nav flex pr-4 text-sm items-center gap-4 rounded-[8px] py-[10px] ml-[6px] px-[10px] justify-between transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300">
                                                        {new Intl.NumberFormat('id-ID').format(foundCommodity.nilai)}
                                                    </div>
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={15} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                {/* <TableFooter className='bg-primary-600'>
                    <TableRow>
                        <TableCell className='text-primary py-3' colSpan={2}>Rata-rata</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='text-primary py-3' colSpan={2}>Maksimum</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='text-primary py-3' colSpan={2}>Minimum</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='text-primary py-3' colSpan={2}>Target CV</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className='text-primary py-3' colSpan={2}>CV (%)</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                        <TableCell className="text-primary py-3">49000</TableCell>
                    </TableRow>
                </TableFooter> */}
            </Table>
            {/* table */}
        </div>
    )
}

export default KoefisienVariasiProdusen