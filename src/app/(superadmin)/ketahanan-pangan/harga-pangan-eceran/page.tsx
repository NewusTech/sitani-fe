"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'
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
import DeletePopup from '@/components/superadmin/PopupDelete'
import EditIcon from '../../../../../public/icons/EditIcon'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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

    const [tahun, setTahun] = React.useState("2024");
    const { data: dataKomoditas, error } = useSWR<Response>(
        `/kepang/perbandingan-harga/get?year=${tahun}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

    // grafik
    const chartData = [
        { month: "jan", desktop: 186, mobile: 80 },
        { month: "feb", desktop: 305, mobile: 200 },
        { month: "mar", desktop: 237, mobile: 120 },
        { month: "apr", desktop: 73, mobile: 190 },
        { month: "mei", desktop: 209, mobile: 130 },
        { month: "jun", desktop: 214, mobile: 140 },
        { month: "jul", desktop: 214, mobile: 140 },
        { month: "ags", desktop: 214, mobile: 140 },
        { month: "sep", desktop: 214, mobile: 140 },
        { month: "okt", desktop: 214, mobile: 140 },
    ]
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
        },
        mobile: {
            label: "Mobile",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig
    // 
    if (error) return <div></div>;
    if (!dataKomoditas) return <div></div>;
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

            {/* top */}
            <div className="header flex justify-between items-center">
                <div className="search w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="btn flex gap-2">
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        <UnduhIcon />
                        <div className="hidden md:block">
                            Download
                        </div>
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        <PrintIcon />
                        <div className="hidden md:block">
                            Print
                        </div>
                    </Button>
                    <div className="hidden m filter-table w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
            </div>
            {/*  */}
            <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full mt-4">
                <div className="w-auto">
                    {/* Dropdown Tahun */}
                    <div className="w-auto">
                        <Select
                            onValueChange={(value) => setTahun(value)}
                            value={tahun}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tahun" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2024">2024</SelectItem>
                                <SelectItem value="2025">2025</SelectItem>
                                <SelectItem value="2026">2026</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="w-[40px] h-[40px]">
                    <Button variant="outlinePrimary" className=''>
                        <FilterIcon />
                    </Button>
                </div>
            </div>
            {/* top */}

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
                    {komoditasNames.length > 0 ? (
                        komoditasNames.map((komoditas, index) => (
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
                                        <Link href="/ketahanan-pangan/harga-pangan-eceran/detail">
                                            <EyeIcon />
                                        </Link>
                                        <DeletePopup onDelete={async () => { }} />
                                    </div>
                                </TableCell>
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
            </Table>
            {/* table */}

            {/* pagination */}
            <div className="pagination md:mb-[0px] mb-[111px] flex md:justify-end justify-center">
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

            {/* title */}
            <div className="text-2xl mt-4 mb-4 font-semibold text-primary uppercase">Grafik Tiap Komoditas</div>
            {/* title */}
            {/* Card */}
            <div className="lg:flex justify-center lg:justify-between gap-4">
                <div className="w-full">
                    {/* Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Harga Rata-rata Beras Premium & Medium Tingkat Pedagang Eceran
                            </CardTitle>
                            {/* <CardDescription>January - June 2024</CardDescription> */}
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <LineChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 2,
                                        right: 2,
                                        bottom: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        label={{
                                            value: 'Bulan',
                                            position: 'insideBottom',
                                            dy: 12, // Mengatur posisi vertikal label
                                            fill: '#666', // Mengatur warna label
                                            fontSize: '12px', // Mengatur ukuran font label
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: 'Harga',
                                            angle: -90,
                                            position: 'insideCenter',
                                            dx: -12, // Mengatur posisi vertikal label
                                            fontSize: '12px', // Mengatur ukuran font label
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Line
                                        dataKey="desktop"
                                        type="natural"
                                        stroke="var(--color-desktop)"
                                        strokeWidth={2}
                                        dot={{
                                            fill: "var(--color-desktop)",
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />
                                    <Line
                                        dataKey="mobile" // Ubah dengan kunci data yang relevan untuk garis kedua
                                        type="natural"
                                        stroke="var(--color-mobile)" // Ubah dengan warna yang sesuai untuk garis kedua
                                        strokeWidth={2}
                                        dot={{
                                            fill: "var(--color-mobile)",
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    {/* Card */}
                </div>
                <div className="w-full">
                    {/* Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">
                                Harga Rata-rata Kedelai Biji Kering Impor (Tingkat Pengrajin Tahu/Tempe)
                            </CardTitle>
                            {/* <CardDescription>January - June 2024</CardDescription> */}
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig}>
                                <LineChart
                                    accessibilityLayer
                                    data={chartData}
                                    margin={{
                                        left: 2,
                                        right: 2,
                                        bottom: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        tickFormatter={(value) => value.slice(0, 3)}
                                        label={{
                                            value: 'Bulan',
                                            position: 'insideBottom',
                                            dy: 12, // Mengatur posisi vertikal label
                                            fill: '#666', // Mengatur warna label
                                            fontSize: '12px', // Mengatur ukuran font label
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: 'Harga',
                                            angle: -90,
                                            position: 'insideCenter',
                                            dx: -12, // Mengatur posisi vertikal label
                                            fontSize: '12px', // Mengatur ukuran font label
                                        }}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Line
                                        dataKey="desktop"
                                        type="natural"
                                        stroke="var(--color-desktop)"
                                        strokeWidth={2}
                                        dot={{
                                            fill: "var(--color-desktop)",
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />
                                    <Line
                                        dataKey="mobile" // Ubah dengan kunci data yang relevan untuk garis kedua
                                        type="natural"
                                        stroke="var(--color-mobile)" // Ubah dengan warna yang sesuai untuk garis kedua
                                        strokeWidth={2}
                                        dot={{
                                            fill: "var(--color-mobile)",
                                        }}
                                        activeDot={{
                                            r: 6,
                                        }}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    {/* Card */}
                </div>
            </div>
            {/* Card */}
        </div >
    )
}

export default HargaPanganEceran