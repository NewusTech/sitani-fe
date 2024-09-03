"use client";

import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Link from 'next/link';
import React from 'react'
import SearchIcon from '../../../../public/icons/SearchIcon';
import CardBerita from './Card';
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'

const dummyBerita = [
    {
        image: '/assets/images/cardBeritaPage.png',
        date: 'January 13, 2024',
        slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur',
        title: 'Lorem Ipsum Dolor Amet Amit Amon Amin Lorem Ipsum Dolor Amet Amit Amon Amin Amet Amit Amon Amin',
        desc: '<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>',
    },
    {
        image: '/assets/images/cardBeritaPage.png',
        date: 'January 13, 2024',
        slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur-2',
        title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
        desc: '<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>',
    },
    {
        image: '/assets/images/cardBeritaPage.png',
        date: 'January 13, 2024',
        slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur-3',
        title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
        desc: '<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>',
    },
    {
        image: '/assets/images/cardBeritaPage.png',
        date: 'January 13, 2024',
        slug: 'layanan-pertanian-kini-tersedia-di-sitani-lampung-timur-4',
        title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
        desc: '<p><strong>Lampung Timur</strong> - Kementerian Agama (Kemenag) resmi membuka layanan baru di Mal Pelayanan Publik (MPP) Lampung Timur, menandai langkah penting dalam upaya pemerintah untuk meningkatkan kualitas pelayanan publik di wilayah tersebut. Pembukaan layanan ini merupakan bagian dari komitmen pemerintah untuk mempermudah akses masyarakat terhadap berbagai layanan administrasi dan informasi yang berkaitan dengan keagamaan.</p><p><br></p><p>Dengan hadirnya Kemenag di MPP Lampung Timur, masyarakat setempat kini memiliki kesempatan untuk mengakses berbagai layanan administrasi keagamaan yang sebelumnya mungkin memerlukan waktu dan usaha lebih. Beberapa layanan yang kini tersedia meliputi pendaftaran nikah, pengurusan dokumen-dokumen keagamaan seperti sertifikat atau akta, serta layanan informasi yang berkaitan dengan pendidikan agama. Hal ini diharapkan dapat memberikan kemudahan bagi masyarakat dalam mengurus berbagai kebutuhan administrasi mereka tanpa harus melakukan perjalanan jauh atau menghadapi proses yang rumit.</p>',
    },
]

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

    const { data: dataArtikel }: SWRResponse<Response> = useSWR(
        `article/get?page=1`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    console.log(dataArtikel)
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
                    <div className="pagination md:mb-[0px] mb-[90px] flex md:justify-end justify-center">
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
                {/* berita terkini */}
            </div>
        </div>
    )
}

export default BeritaLayout