"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import Link from 'next/link'

// Filter di mobile
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { id } from 'date-fns/locale'; // Import Indonesian locale
import Label from '@/components/ui/label'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuCheckboxItem } from '@radix-ui/react-dropdown-menu'
import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
    Filter,
} from "lucide-react"
// Filter di mobile

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
import useSWR, { mutate } from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import KepangPerbandingan from '@/components/Print/KetahananPangan/PerbandinganHarga'
import FilterTable from '@/components/FilterTable'
import TambahIcon from '../../../../../public/icons/TambahIcon'
import NotFoundSearch from '@/components/SearchNotFound'
import TahunSelect from '@/components/superadmin/SelectComponent/SelectTahun'

interface Komoditas {
    id: number;
    nama: string;
    createdAt: string;
    updatedAt: string;
}

interface ListItem {
    idList: number;
    idKomoditas: number;
    nama: string;
    rerata: number;
    sum: number;
    count: number;
}

interface KepangPerbandinganHarga {
    id: number;
    tanggal: string;
    createdAt: string;
    updatedAt: string;
    list: {
        id: number;
        kepangPedagangEceranId: number;
        kepangMasterKomoditasId: number;
        minggu1: number;
        minggu2: number;
        minggu3: number;
        minggu4: number;
        minggu5: number;
        createdAt: string;
        updatedAt: string;
        komoditas: Komoditas;
    }[];
}

interface DataItem {
    id: number;
    tanggal: string;
    bulan: number;
    tahun: number;
    list: ListItem[];
}

interface Response {
    status: number;
    message: string;
    data: {
        data: DataItem[];
        kepangPerbandinganHarga: KepangPerbandinganHarga[];
    };
}

const HargaPanganEceran = () => {
    // filter date
    const formatDate = (date?: Date): string => {
        if (!date) return ''; // Return an empty string if the date is undefined
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() is zero-based
        const day = date.getDate();

        return `${year}/${month}/${day}`;
    };
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()
    // Memoize the formatted date to avoid unnecessary recalculations on each render
    const filterStartDate = React.useMemo(() => formatDate(startDate), [startDate]);
    const filterEndDate = React.useMemo(() => formatDate(endDate), [endDate]);
    // filter date   
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
    // State untuk menyimpan id kecamatan yang dipilih
    const [selectedKecamatan, setSelectedKecamatan] = useState<string>("");

    // filter tahun dinamis
    const [selectedTahun, setSelectedTahun] = useState<string>(new Date().getFullYear().toString());
    // filter tahun dinamis

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    const { data: dataKomoditas, error } = useSWR<Response>(
        `/kepang/perbandingan-harga/get?page=${currentPage}&year=${selectedTahun === 'semua' ? '' : selectedTahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );
    mutate(`/kepang/perbandingan-harga/get?page=${currentPage}&year=${selectedTahun === 'semua' ? '' : selectedTahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`);

    console.log(dataKomoditas)

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
    // if (error) return <div></div>;
    // if (!dataKomoditas) return <div></div>;

    // Utility to format month name
    const getMonthName = (monthNumber: number): string => {
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        return months[monthNumber - 1];
    };

    // Create a map of month names to prices
    // Check if dataKomoditas and kepangPerbandinganHarga are defined
    const monthPricesMap = dataKomoditas?.data?.kepangPerbandinganHarga
        ? dataKomoditas?.data?.kepangPerbandinganHarga.reduce((acc, item) => {
            const month = getMonthName(new Date(item.tanggal).getMonth() + 1);
            item.list.forEach(komoditasItem => {
                if (!acc[komoditasItem.komoditas.nama]) {
                    acc[komoditasItem.komoditas.nama] = {};
                }
                acc[komoditasItem.komoditas.nama][month] = komoditasItem.minggu1; // Example for week 1, adjust as needed
            });
            return acc;
        }, {} as Record<string, Record<string, number>>)
        : {}; // Fallback to empty object if kepangPerbandinganHarga is undefined

    // Get unique commodity names
    const komoditasNames = Object.keys(monthPricesMap);

    return (
        <div>
            {/* title */}
            <div className="md:text-2xl text-xl mb-5 font-semibold text-primary">Perbandingan Komoditas Harga Panen</div>
            {/* title */}

            {/* Dekstop */}
            <div className="hidden md:block">
                <>
                    {/* top */}
                    <div className="header flex justify-between items-center">
                        <div className="search w-[50%]">
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
                        {/* print */}
                        <KepangPerbandingan
                            urlApi={`/kepang/perbandingan-harga/get?year=${selectedTahun}`}
                            tahun={selectedTahun}
                        />
                        {/* print */}
                    </div>
                    {/*  */}
                    <div className="wrap-filter left gap-1 lg:gap-2 flex justify-start items-center w-full mt-4">
                        {/* filter tahun */}
                        <TahunSelect
                            url='kepang/master-tahun/perbandingan-harga'
                            semua={true}
                            value={selectedTahun}
                            onChange={(value) => {
                                setSelectedTahun(value);
                            }}
                        />
                        {/* filter tahun */}
                        {/* <div className="w-[40px] h-[40px]">
                    <Button variant="outlinePrimary" className=''>
                        <FilterIcon />
                    </Button>
                </div> */}
                    </div>
                    {/* top */}
                </>
            </div>

            {/* Mobile */}
            <div className="md:hidden">
                <>
                    {/* Handle filter menu*/}
                    <div className="flex justify-between w-full">
                        <div className="flex justify-start w-fit gap-2">
                            {/* More Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outlinePrimary"
                                        className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300"
                                    >
                                        <Filter className="text-primary w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="transition-all duration-300 ease-in-out opacity-1 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-white border border-gray-300 shadow-2xl rounded-md ml-5 w-[280px]">
                                    <DropdownMenuLabel className="font-semibold text-primary text-sm w-full shadow-md">
                                        Menu Filter
                                    </DropdownMenuLabel>
                                    {/* <hr className="border border-primary transition-all ease-in-out animate-pulse ml-2 mr-2" /> */}
                                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary to-transparent transition-all animate-pulse"></div>
                                    <div className="bg-white w-full h-full">
                                        <div className="flex flex-col w-full px-2 py-2">

                                            {/* Filter Tahun Bulan */}
                                            <>
                                                <Label className='text-xs mb-1 !text-black opacity-50' label="Tahun Bulan" />
                                                <div className="flex gap-2 justify-between items-center w-full">
                                                    {/* filter tahun */}
                                                    <TahunSelect
                                                        url='kepang/master-tahun/perbandingan-harga'
                                                        semua={true}
                                                        value={selectedTahun}
                                                        onChange={(value) => {
                                                            setSelectedTahun(value);
                                                        }}
                                                    />
                                                    {/* filter tahun */}
                                                    {/* filter tahun */}
                                                    {/* Filter bulan */}
                                                    {/* <div className="w-fit">
                                                                    <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Tahun">
                                                                                {tahun ? tahun : "Tahun"}
                                                                            </SelectValue>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                      <SelectItem className='text-xs' value="Semua Tahun">Semua Tahun</SelectItem>
                                      {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                        const year = startYear + index;
                                        return (
                                          <SelectItem className='text-xs' key={year} value={year.toString()}>
                                            {year}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                                                    </Select>
                                                                </div> */}
                                                    {/* Filter bulan */}
                                                </div>
                                            </>
                                            {/* Filter Tahun Bulan */}

                                        </div>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* More Menu */}

                            {/* filter kolom */}
                            {/* <FilterTable
                                columns={columns}
                                defaultCheckedKeys={getDefaultCheckedKeys()}
                                onFilterChange={handleFilterChange}
                            /> */}
                            {/* filter kolom */}

                            {/* unduh print */}
                            <KepangPerbandingan
                                urlApi={`/kepang/perbandingan-harga/get?page=${currentPage}&year=${selectedTahun === 'semua' ? '' : selectedTahun}&search=${search}&startDate=${filterStartDate}&endDate=${filterEndDate}&kecamatan=${selectedKecamatan}&limit=${limit}`}
                                tahun={selectedTahun}
                            />
                            {/* unduh print */}
                        </div>

                        {/* Tambah Data */}
                        {/* Tambah Data */}
                    </div>

                    {/* Hendle Search */}
                    <div className="mt-2 search w-full">
                        <Input
                            autoFocus
                            type="text"
                            placeholder="Cari"
                            value={search}
                            onChange={handleSearchChange}
                            rightIcon={<SearchIcon />}
                            className='border-primary py-2 text-xs'
                        />
                    </div>
                    {/* Hendle Search */}

                </>
            </div>
            {/* Mobile */}

            {/* mobile table */}
            <div className="wrap-table flex-col gap-4 mt-3 flex md:hidden">
                {komoditasNames.length > 0 ? (
                    komoditasNames.map((komoditas, index) => (
                        <div key={index} className="card-table text-[12px] p-4 rounded-2xl border border-primary bg-white shadow-sm">
                            <div className="wrap-konten flex flex-col gap-2">
                                <div className="flex gap-5">
                                    <div className="konten text-sm text-black font-semibold">{komoditas}</div>
                                </div>
                                {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((month, i) => (
                                    <div key={i} className="">
                                        <div className="flex justify-between gap-5">
                                            <div className="label font-medium text-black">{month}</div>
                                            <div className="konten text-black/80 text-end">
                                                {/* {monthPricesMap[komoditas][month]
                                                    ? monthPricesMap[komoditas][month].toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                                                    : "-"} */}
                                                Rp. {monthPricesMap[komoditas] && monthPricesMap[komoditas][month]
                                                    ? new Intl.NumberFormat('id-ID').format(monthPricesMap[komoditas][month])
                                                    : '-'}
                                            </div>
                                        </div>
                                        <div className="garis h-[1px] my-2 bg-primary transition-all ease-in-out animate-pulse" ></ div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center">
                        <NotFoundSearch />
                    </div>
                )}
            </div>
            {/* mobile table */}


            {/* desktop table */}
            <div className="hidden md:block">
                <Table className='border border-slate-200 mt-4 text-xs md:text-sm rounded-lg md:rounded-none overflow-hidden'>
                    <TableHeader className='bg-primary-600'>
                        <TableRow>
                            <TableHead className="text-primary py-3">No</TableHead>
                            <TableHead className="text-primary py-3">Komoditas</TableHead>
                            {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((month, index) => (
                                <TableHead key={index} className="text-primary py-3">{month}</TableHead>
                            ))}
                            {/* <TableHead className="text-primary py-3">Aksi</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {komoditasNames.map((komoditas, index) => (
                            <TableRow key={index}>
                                <TableCell className='py-2 lg:py-4 border border-slate-200'>{index + 1}</TableCell>
                                <TableCell className='py-2 lg:py-4 border border-slate-200'>{komoditas}</TableCell>
                                {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((month, i) => (
                                    <TableCell className='py-2 lg:py-4 border border-slate-200' key={i}>
                                        {monthPricesMap[komoditas][month]
                                            ? monthPricesMap[komoditas][month].toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
                                            : "-"}
                                    </TableCell>
                                ))}
                                {/* <TableCell>
                                <div className="flex items-center gap-4">
                                    <Link className='' href="/ketahanan-pangan/harga-pangan-eceran/detail">
                                        <EyeIcon />
                                    </Link>
                                    <DeletePopup onDelete={async () => { }} />
                                </div>
                            </TableCell> */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/*desktop table */}

            {/* title */}
            <div className="text-2xl mt-4 mb-4 font-semibold text-primary capitalize">Grafik Tiap Komoditas</div>
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