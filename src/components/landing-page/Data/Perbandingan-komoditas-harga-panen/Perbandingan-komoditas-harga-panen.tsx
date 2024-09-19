"use client"
import { Input } from '@/components/ui/input'
import React from 'react'
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
    const currentYear = new Date().getFullYear();

    const [tahun, setTahun] = React.useState(`${currentYear}`);
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
    if (error) return <div></div>;
    if (!dataKomoditas) return <div></div>;

    // Utility to format month name
    const getMonthName = (monthNumber: number): string => {
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];
        return months[monthNumber - 1];
    };

    // Create a map of month names to prices
    const monthPricesMap = dataKomoditas.data.kepangPerbandinganHarga.reduce((acc, item) => {
        const month = getMonthName(new Date(item.tanggal).getMonth() + 1);
        item.list.forEach(komoditasItem => {
            if (!acc[komoditasItem.komoditas.nama]) {
                acc[komoditasItem.komoditas.nama] = {};
            }
            acc[komoditasItem.komoditas.nama][month] = komoditasItem.minggu1; // Example for week 1, adjust as needed
        });
        return acc;
    }, {} as Record<string, Record<string, number>>);

    // Get unique commodity names
    const komoditasNames = Object.keys(monthPricesMap);

    return (
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">
                {/* header */}
                <div className="header lg:flex lg:justify-between items-center">
                    <div className="search w-full lg:w-[70%]">
                        <div className="text-primary font-semibold text-lg lg:text-3xl flex-shrink-0">Perbandingan Komoditas Harga Panen Tingkat Eceran</div>
                    </div>
                    {/* top */}
                    <div className="header flex gap-2 justify-between items-center mt-4">
                        <div className="search md:w-[50%]">
                            <Input
                                type="text"
                                placeholder="Cari"
                                rightIcon={<SearchIcon />}
                                className='border-primary py-2'
                            />
                        </div>
                        {/* print */}
                        <KepangPerbandingan
                            urlApi={`/kepang/perbandingan-harga/get?year=${tahun}`}
                            tahun={tahun}
                        />
                        {/* print */}
                    </div>
                    {/* top */}
                </div>
                {/* filter tahun */}
                <div className="wrap-filter left gap-1 lg:gap-2 flex 
                justify-start lg:justify-end items-center w-full mt-4">
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
                    </div>
                </div>
                {/* filter tahun */}
                {/* header */}

                {/* table */}
                <Table className='border border-slate-200 mt-4'>
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
                        {komoditasNames.map((komoditas, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{komoditas}</TableCell>
                                {["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((month, i) => (
                                    <TableCell key={i}>
                                        {monthPricesMap[komoditas][month] || "-"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {/* table */}

                {/* Card */}
                <div className="lg:flex flex-col justify-center lg:justify-between gap-4 mt-5">
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