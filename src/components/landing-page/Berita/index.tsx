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

const BeritaLayout = () => {
    // pagination
    // const paginationTheme = {
    //     pages: {
    //         base: "xs:mt-0 text-[12px] md:text-[14px] mt-3 flex gap-2 inline-flex items-center -space-x-px  ",
    //         showIcon: "inline-flex",
    //         previous: {
    //             base: "md:min-w-[40px] min-w-[30px] rounded-md bg-primary md:px-3 md:py-2 px-2 py-2 leading-tight text-gray-500",
    //             icon: "h-4 w-4 md:h-5 md:w-4  text-white",
    //         },
    //         next: {
    //             base: "md:min-w-[40px] min-w-[30px] rounded-md bg-primary md:px-3 md:py-2 px-2 py-2 leading-tight text-gray-500",
    //             icon: "h-4 w-4 md:h-5 md:w-4 text-white",
    //         },
    //         selector: {
    //             base: "md:min-w-[40px] min-w-[30px] bg-white border border-gray-200 rounded-md md:px-3 md:py-2 px-2 py-2 leading-tight text-black hover:bg-primary hover:text-white",
    //             active: "md:min-w-[40px] min-w-[30px] text-white md:px-3 md:py-2 px-2 py-2 bg-primary",
    //             disabled: "bg-red-500 cursor-normal",
    //         },
    //     },
    // };
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
    // const [currentPage, setCurrentPage] = useState(1);
    // const onPageChange = (page: number) => {
    //     setCurrentPage(page)
    // };
    // pagination
    // search
    const [search, setSearch] = useState("");
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    const { data: dataArtikel }: SWRResponse<Response> = useSWR(
        `article/get?page=1&search=${search}&limit=4`,
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
                        {dataArtikel?.data?.data.map((berita, index) => (
                            <CardBerita
                                key={index}
                                title={berita.judul}
                                slug={berita.slug}
                                desc={berita.konten}
                                date={berita.createdAt}
                                image={berita.image}
                            />
                        ))}
                    </div>
                    {/* pagination */}
                    {/* pagination */}
                </div>
                {/* berita terkini */}
            </div>
        </div>
    )
}

export default BeritaLayout