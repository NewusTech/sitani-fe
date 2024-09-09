"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import Link from 'next/link'
import { id } from 'date-fns/locale'; // Indonesian locale for date formatting

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
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import DeletePopup from '@/components/superadmin/PopupDelete'
import useLocalStorage from '@/hooks/useLocalStorage'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import useSWR, { mutate, SWRResponse } from 'swr'
import Swal from 'sweetalert2'
import EyeIcon from '../../../../public/icons/EyeIcon';
import EditIcon from '../../../../public/icons/EditIcon';

// Define your interfaces
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

const TableComponent = () => {
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data, error } = useSWR<Response>(
        `/kepang/cv-produsen/get`,
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
    data.data.forEach((item) => {
        item.list.forEach((komoditas) => {
            allKomoditas.add(komoditas.komoditas.nama);
        });
    });
    const uniqueKomoditas = Array.from(allKomoditas);

    return (
        <Table className='border border-slate-200 mt-4'>
            <TableHeader className='bg-primary-600'>
                <TableRow>
                    <TableHead className="text-primary py-3">No</TableHead>
                    <TableHead className="text-primary py-3">Bulan</TableHead>
                    {uniqueKomoditas.map((komoditas) => (
                        <TableHead key={komoditas} className="text-primary py-3">{komoditas}</TableHead>
                    ))}
                    <TableHead className="text-primary py-3">Aksi</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data.data.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{format(new Date(item.bulan), 'MMMM', { locale: id })}</TableCell>
                        {uniqueKomoditas.map((komoditas) => {
                            const foundCommodity = item.list.find(k => k.komoditas.nama === komoditas);
                            return (
                                <TableCell key={komoditas}>
                                    {foundCommodity ? (
                                        <Link href={`/edit-nilai/${foundCommodity.id}`}> <EyeIcon />
                                            {foundCommodity.nilai}
                                        </Link>
                                    ) : 'N/A'}
                                </TableCell>
                            );
                        })}
                        {/* Aksi */}
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <Link href={`/detail/${item.id}`}>
                                    <EyeIcon />
                                </Link>
                                <Link href={`/edit/${item.id}`}>
                                    <EditIcon />
                                </Link>
                                <DeletePopup onDelete={async () => { /* delete logic */ }} />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableComponent;
