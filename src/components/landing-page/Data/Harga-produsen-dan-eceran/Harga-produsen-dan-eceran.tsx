"use client"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import { Button } from "@/components/ui/button";
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
import React from "react";
import { ChartConfig } from "@/components/ui/chart";
import Link from "next/link";
import DeletePopup from "@/components/superadmin/PopupDelete";
import UnduhIcon from "../../../../../public/icons/UnduhIcon";
import { EyeIcon } from "lucide-react";

const KomponenHargaProdusenDanEceran = () => {
    // INTEGRASI
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
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

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
    const [startDate, setstartDate] = React.useState<Date>()
    const [endDate, setendDate] = React.useState<Date>()

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
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">
                {/* header */}
                <div className="header flex justify-between items-center">
                    <div className="search w-[70%]">
                        <div className="text-primary font-semibold text-lg lg:text-3xl flex-shrink-0">Daftar Harga Produsen dan Eceran</div>
                    </div>
                    <div className="btn flex gap-2">
                        <Button variant={"outlinePrimary"} className='flex gap-2 items-center text-primary'>
                            <UnduhIcon />
                            <div className="hidden md:block">
                                Download
                            </div>
                        </Button>
                    </div>
                </div>
                {/* header */}

                {/* table */}
                <Table className='border border-slate-200 mt-4 lg:mt-10'>
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
                <div className="pagination md:mb-0 mb-[110px] flex md:justify-end justify-center">
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
            </div>
        </div>
    )
}

export default KomponenHargaProdusenDanEceran