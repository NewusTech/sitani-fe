"use client";

import { Input } from '@/components/ui/input';
import Link from 'next/link';
import React, { useState } from 'react'
import SearchIcon from '../../../../public/icons/SearchIcon';
import CardBerita from './Card';
// import { Pagination } from "flowbite-react";

// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import PaginationTable from '@/components/PaginationTable';

const BeritaLayout = () => {
    // INTEGRASI
    interface Artikel {
        id?: string; // Ensure id is a string
        judul?: string;
        slug?: string;
        konten?: string;
        image?: string;
        createdAt?: string;
    }

    interface Pagination {
        page: number,
        perPage: number,
        totalPages: number,
        totalCount: number,
    }

    interface ResponseData {
        data: Artikel[];
        pagination: Pagination;
    }

    interface Response {
        status: string,
        data: ResponseData,
        message: string
    }
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();
    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    };
    // pagination
    // search
    const [search, setSearch] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const { data: dataArtikel }: SWRResponse<Response> = useSWR(
        `article/get?page=${currentPage}&search=${search}&limit=6`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );


    // INTEGRASI
    return (
        <div>
            <div className='w-full min-h-screen mt-0 lg:mt-28'>
                {/* berita terkini */}
                <div className="berita container py-7 md:py-[30px] lg:py-[60px] ">
                    <div className="header items-center lg:flex gap-5 justify-between">
                        <div className="div">
                            <div className="text-primary font-semibold text-3xl flex-shrink-0">Berita</div>
                            <div className="div">Berita terkait Dinas Ketahanan Pangan, Tanamaan Pangan dan Holtikultura</div>
                        </div>
                        <div className="searc mt-5 lg:mt-0">
                            <Input
                                placeholder="Cari"
                                value={search}
                                onChange={handleSearchChange}
                                className='w-full lg:w-[370px] border border-primary'
                                rightIcon={<SearchIcon />}
                            />
                        </div>
                    </div>
                    {/* card */}
                    <div className="berita grid grid-cols-1 md:grid-cols-2 gap-4 md:py-[30px] py-[20px]">
                        {dataArtikel?.data?.data && dataArtikel.data.data.length > 0 ? (
                            dataArtikel.data.data.map((berita, index) => (
                                <CardBerita
                                    key={index}
                                    title={berita.judul}
                                    slug={berita.slug}
                                    desc={berita.konten}
                                    date={berita.createdAt}
                                    image={berita.image}
                                />
                            ))
                        ) : (
                            <div className="flex justify-center items-center w-full col-span-2 py-5">
                                Tidak ada data
                            </div>
                        )}
                    </div>
                    {/* pagination */}
                    <div className="pagi flex items-center lg:justify-end justify-center">
                        {dataArtikel?.data.pagination.totalCount as number > 1 && (
                            <PaginationTable
                                currentPage={currentPage}
                                totalPages={dataArtikel?.data.pagination.totalPages as number}
                                onPageChange={onPageChange}
                            />
                        )}
                    </div>
                    {/* pagination */}
                </div>
                {/* berita terkini */}
            </div>
        </div>
    )
}

export default BeritaLayout