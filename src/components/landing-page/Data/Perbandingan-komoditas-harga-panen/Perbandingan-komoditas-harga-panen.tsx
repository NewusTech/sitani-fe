"use client"
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
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
import DeletePopup from '@/components/superadmin/PopupDelete'
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
import KepangPerbandingan from '@/components/Print/KetahananPangan/PerbandinganHarga'
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

const KomponenPerbandinganKomoditasHargaPanen = () => {
    // INTEGRASI
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

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

    // otomatis hitung tahun
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 5;
    const endYear = currentYear + 1;
    const [tahun, setTahun] = React.useState("Semua Tahun");
    // otomatis hitung tahun

    const { data: dataKomoditas, error } = useSWR<Response>(
        `/kepang/perbandingan-harga/get?year=${tahun}&search=${search}`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res) => res.data)
    );

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

    const monthPricesMap = dataKomoditas?.data?.kepangPerbandinganHarga?.reduce((acc, item) => {
        const month = getMonthName(new Date(item.tanggal).getMonth() + 1);
        item.list.forEach(komoditasItem => {
            if (!acc[komoditasItem.komoditas.nama]) {
                acc[komoditasItem.komoditas.nama] = {};
            }
            acc[komoditasItem.komoditas.nama][month] = komoditasItem.minggu1; // Example for week 1, adjust as needed
        });
        return acc;
    }, {} as Record<string, Record<string, number>>);

    // Ensure monthPricesMap is an object before calling Object.keys()
    const komoditasNames = Object.keys(monthPricesMap || {});

    return (
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">
                {/* Dekstop */}
                <div className="hidden md:block">
                    <>
                        {/* header */}
                        <div className="header lg:flex lg:justify-between items-center gap-2">
                            <div className="search w-full lg:w-[50%]">
                                <div className="text-primary font-semibold text-xl lg:text-3xl flex-shrink-0 text-center lg:text-left">Perbandingan Komoditas Harga Panen Tingkat Eceran</div>
                            </div>
                            {/* top */}
                            <div className="header flex gap-2 justify-between items-center mt-2 lg:mt-0">
                                <div className="search md:w-[35%]">
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
                                {/* filter tahun */}
                                {/* Dropdown Tahun */}
                                <div className="w-fit">
                                    <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tahun">
                                                {tahun ? tahun : "Tahun"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Semua Tahun">Semua Tahun</SelectItem>
                                            {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                                const year = startYear + index;
                                                return (
                                                    <SelectItem key={year} value={year.toString()}>
                                                        {year}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* filter tahun */}
                                <KepangPerbandingan
                                    urlApi={`/kepang/perbandingan-harga/get?year=${tahun}`}
                                    tahun={tahun}
                                />
                                {/* print */}
                            </div>
                            {/* top */}
                        </div>
                        {/* header */}
                    </>
                </div>
                {/* Dekstop */}

                {/* Mobile */}
                <div className="md:hidden">
                    <>
                        <div className="text-xl mb-4 font-semibold text-primary capitalize">Perbandingan Komoditas Harga Panen</div>
                        {/* kolom 1 */}
                        <div className="flex justify-between">
                            <div className="flex gap-2 w-full">

                                {/* filter tahun */}
                                <div className="w-full">
                                    <Select onValueChange={(value) => setTahun(value)} value={tahun || ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Tahun">
                                                {tahun ? tahun : "Tahun"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Semua Tahun">Semua Tahun</SelectItem>
                                            {Array.from({ length: endYear - startYear + 1 }, (_, index) => {
                                                const year = startYear + index;
                                                return (
                                                    <SelectItem key={year} value={year.toString()}>
                                                        {year}
                                                    </SelectItem>
                                                );
                                            })}
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
                                <KepangPerbandingan
                                    urlApi={`/kepang/perbandingan-harga/get?year=${tahun}`}
                                    tahun={tahun}
                                />
                                {/* print */}
                            </div>
                        </div>
                        {/* kolom 1 */}

                        {/* kolom 2 */}
                        <div className="mt-2">
                            <div className="search w-full">
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
                        </div>
                        {/* kolom 2 */}
                    </>
                </div>
                {/* Mobile */}

                {/* table */}
                <Table className='border border-slate-200 mt-4 text-xs md:text-sm rounded-lg'>
                    <TableHeader className='bg-primary-600'>
                        <TableRow>
                            <TableHead className="text-primary py-3">No</TableHead>
                            <TableHead className="text-primary py-3">Komoditas</TableHead>
                            {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((month, index) => (
                                <TableHead key={index} className="text-primary py-3">{month}</TableHead>
                            ))}
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
                                            {monthPricesMap?.[komoditas]?.[month] || "-"}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={14} className="text-center">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {/* table */}

                {/* Card */}
                <div className="lg:flex flex-col justify-center lg:justify-between gap-4 mt-5 mb-32 lg:mb-0">
                    <div className="wrap flex flex-col md:flex-row gap-3">
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
                    <div className="wrap flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
                        <div className="w-full">
                            {/* Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">
                                        Harga Rata-rata Bawang Merah Eceran Premium & Medium Tingkat Pedagang Eceran
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
                                        Harga Rata-rata Cabai Merah Keriting Eceran
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
                </div>
                {/* Card */}

            </div>
        </div>
    )
}

export default KomponenPerbandinganKomoditasHargaPanen