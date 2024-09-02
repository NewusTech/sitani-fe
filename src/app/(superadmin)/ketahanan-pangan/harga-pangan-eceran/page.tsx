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
export const description = "A line chart with dots"

interface Data {
    komoditas: string;
    harga: {
        jan: string;
        feb: string;
        mar: string;
        apr: string;
        mei: string;
        jun: string;
        jul: string;
        ags: string;
        sep: string;
        okt: string;
    };
}

const HargaPanganEceran = () => {
    const data: Data[] = [
        {
            komoditas: "Beras Premium Eceran",
            harga: {
                jan: "12000",
                feb: "12500",
                mar: "12300",
                apr: "12600",
                mei: "12800",
                jun: "12400",
                jul: "12200",
                ags: "12900",
                sep: "12700",
                okt: "13000",
            }
        },
    ];
    const [date, setDate] = React.useState<Date>()

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
                    <Popover>
                        <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal text-[11px] lg:text-sm",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                {date ? format(date, "PPP") : <span>Tanggal Awal</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar className=''
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="">-</div>
                <div className="w-auto">
                    <Popover>
                        <PopoverTrigger className='lg:py-4 lg:px-4 px-2' asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal text-[11px] lg:text-sm",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-1 lg:mr-2 h-4 w-4 text-primary" />
                                {date ? format(date, "PPP") : <span>Tanggal Akhir</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
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
                    <TableRow >
                        <TableHead className="text-primary py-3">No</TableHead>
                        <TableHead className="text-primary py-3">Komoditas</TableHead>
                        <TableHead className="text-primary py-3">Jan</TableHead>
                        <TableHead className="text-primary py-3">Feb</TableHead>
                        <TableHead className="text-primary py-3">Mar</TableHead>
                        <TableHead className="text-primary py-3">Apr</TableHead>
                        <TableHead className="text-primary py-3">Mei</TableHead>
                        <TableHead className="text-primary py-3">Jun</TableHead>
                        <TableHead className="text-primary py-3">Jul</TableHead>
                        <TableHead className="text-primary py-3">Ags</TableHead>
                        <TableHead className="text-primary py-3">Sep</TableHead>
                        <TableHead className="text-primary py-3">Okt</TableHead>
                        <TableHead className="text-primary py-3">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                {item.komoditas}
                            </TableCell>
                            {Object.values(item.harga).map((harga, i) => (
                                <TableCell key={i}>{harga}</TableCell>
                            ))}
                            <TableCell>
                                <div className="flex items-center gap-4">
                                    <Link className='' href="/ketahanan-pangan/harga-pangan-eceran/detail">
                                        <EyeIcon />
                                    </Link>
                                    <DeletePopup onDelete={() => { }} />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
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