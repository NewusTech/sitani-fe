"use client"

import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
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
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import EyeIcon from '../../../../../public/icons/EyeIcon'
import EditIcon from '../../../../../public/icons/EditIcon'
import DeletePopup from '@/components/superadmin/PopupDelete'


const PeranPage = () => {
    // TES
    interface User {
        id?: number;
        name: string;
        email: string;
        nip: string;
    }


    interface Response {
        status: string,
        data: User[],
        message: string
    }

    // 
    const [accessToken, _] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    // list
    const {
        data: dataUser,
    }: SWRResponse<Response> = useSWR(
        `/user/get`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    console.log(dataUser);
    // TES
    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Peran</div>
            {/* title */}
            {/* top */}
            <div className="header flex gap-2 justify-between items-center">
                <div className="search md:w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="right">
                    <Link href="/peran-pengguna/peran/tambah" className='bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            <div className="bg-red-500">
                {/* {dataUser?.data?.[0]?.name} */}
            </div>
            {/* table */}
            <Table className='border border-slate-200 mt-5'>
                <TableHeader className='bg-primary-600'>
                    <TableRow>
                        <TableHead className="text-primary py-3">
                            No
                        </TableHead>
                        <TableHead className="text-primary py-3">
                            Nama
                        </TableHead>
                        <TableHead className="text-primary py-3">
                            Email
                        </TableHead>
                        <TableHead className="text-primary py-3">
                            NIP
                        </TableHead>
                        <TableHead className="text-primary py-3">
                            Aksi
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataUser?.data ? (
                        dataUser.data.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item?.name}</TableCell>
                                <TableCell>{item?.email}</TableCell>
                                <TableCell>{item?.nip}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href={{
                                                pathname: "/peran-pengguna/peran/edit",
                                                query: { id: item.id },
                                            }}
                                        >
                                            <EditIcon />
                                        </Link>
                                        <DeletePopup onDelete={() => { }} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}


                </TableBody>
            </Table>
            {/* table */}
        </div>
    )
}

export default PeranPage