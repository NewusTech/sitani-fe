"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
import PrintIcon from '../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../public/icons/UnduhIcon'
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
import EyeIcon from '../../../../public/icons/EyeIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'
import EditIcon from '../../../../public/icons/EditIcon'
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import Paginate from '@/components/ui/paginate'
import Swal from 'sweetalert2'

interface Komoditas {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

interface ListItem {
    id: number;
    kepangPerbandinganHargaId: number;
    kepangMasterKomoditasId: number;
    harga: number;
    createdAt: string;
    updatedAt: string;
    komoditas: Komoditas;
}

interface DataItem {
    id: number;
    bulan: string;
    createdAt: string;
    updatedAt: string;
    list: ListItem[];
}

interface Response {
    status: number;
    message: string;
    data: DataItem[];
}

const HargaPanganEceran = () => {
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataKomoditas, error } = useSWR<Response>(
        `/kepang/perbandingan-harga/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    if (error) return <div>Error loading data.</div>;
    if (!dataKomoditas) return <div>Loading...</div>;

    // Utility to format month name
    const getMonthName = (dateStr: string): string => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { month: 'long' };
        return date.toLocaleDateString('id-ID', options);
    };

    // Create a map of month names to prices
    const monthPricesMap = dataKomoditas.data.reduce((acc, item) => {
        const month = getMonthName(item.bulan);
        item.list.forEach(komoditasItem => {
            if (!acc[komoditasItem.komoditas.nama]) {
                acc[komoditasItem.komoditas.nama] = {};
            }
            acc[komoditasItem.komoditas.nama][month] = komoditasItem.harga;
        });
        return acc;
    }, {} as Record<string, Record<string, number>>);

    // Get unique commodity names
    const komoditasNames = Object.keys(monthPricesMap);

    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-4 font-semibold text-primary uppercase">Perbandingan Komoditas Harga Panen</div>
            {/* title */}

            {/* table */}
            <Table className='border border-slate-200 mt-4'>
                <TableHeader className='bg-primary-600'>
                    <TableRow>
                        <TableHead className="text-primary py-3">No</TableHead>
                        <TableHead className="text-primary py-3">Komoditas</TableHead>
                        {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((month, index) => (
                            <TableHead key={index} className="text-primary py-3">{month}</TableHead>
                        ))}
                        <TableHead className="text-primary py-3">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {komoditasNames.map((komoditas, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{komoditas}</TableCell>
                            {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((month, i) => (
                                <TableCell key={i}>
                                    {monthPricesMap[komoditas][month] || "-"}
                                </TableCell>
                            ))}
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Link className='' href="/ketahanan-pangan/harga-pangan-eceran/detail">
                                        <EyeIcon />
                                    </Link>
                                    <DeletePopup onDelete={async () => { }} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {/* table */}

        </div >
    )
}

export default HargaPanganEceran
