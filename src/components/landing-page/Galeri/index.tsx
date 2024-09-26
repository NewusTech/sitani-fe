/* eslint-disable @next/next/no-img-element */
"use client"
import CardGaleriPage from "./Card"
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import { useState } from 'react';
import { SWRResponse, mutate } from "swr";
import PaginationTable from "@/components/PaginationTable";
// import { Pagination } from "flowbite-react";



const GaleriLanding = () => {
    // INTEGRASI
    interface Galeri {
        id?: string;
        image?: string;
        deskripsi?: string;
    }

    interface Pagination {
        page: number,
        perPage: number,
        totalPages: number,
        totalCount: number,
    }

    interface ResponseData {
        data: Galeri[];
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

    // GETALL
    const { data: dataGaleri }: SWRResponse<Response> = useSWR(
        `galeri/get?page=${currentPage}&limit=12`,
        (url) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // State for Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<Galeri | null>(null);

    const handleCardClick = (galeri: Galeri) => {
        setSelectedImage(galeri);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    return (
        <div className='md:pt-[130px] pt-[30px] container mx-auto'>
            <div className="galeri md:py-[60px]">
                {/* header */}
                <div className="header items-center flex gap-8 ">
                    <div className="text-primary font-semibold text-3xl flex-shrink-0">Galeri</div>
                    <div className="garis h-[3px] w-full bg-secondary"></div>
                </div>
                {/* header */}
                {/* Card */}
                <div className="wrap-card grid grid-cols-1 md:grid-cols-3 gap-4 md:py-[30px] py-[20px] mb-10 lg:mb-0 group">
                    {dataGaleri?.data?.data && dataGaleri.data.data.length > 0 ? (
                        dataGaleri.data.data.map((galeri, index) => (
                            <CardGaleriPage key={index} image={galeri.image} deskripsi={galeri.deskripsi} onClick={() => handleCardClick(galeri)} />
                        ))
                    ) : (
                        <div className="flex justify-center items-center w-full col-span-4 py-5">
                            Tidak ada data
                        </div>
                    )}
                </div>
                {/* Card */}

                {/* pagination */}
                {/* pagination */}
                <div className="pagi flex items-center lg:justify-end justify-center">
                    {dataGaleri?.data.pagination.totalCount as number > 1 && (
                        <PaginationTable
                            currentPage={currentPage}
                            totalPages={dataGaleri?.data.pagination.totalPages as number}
                            onPageChange={onPageChange}
                        />
                    )}
                </div>
                {/* pagination */}
                {/* pagination */}

                {/* Modal */}
                {isModalOpen && selectedImage && (
                    <div
                        onClick={closeModal}
                        className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-5 md:px-0"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()} // Mencegah event klik pada modal-content menutup modal
                            className="modal-content bg-white w-full h-[250px] md:h-[80%] md:w-[60%] rounded-lg relative overflow-hidden"
                        >
                            <button
                                onClick={closeModal}
                                className="modal-close absolute top-2 right-2 bg-primary flex justify-center items-center w-5 h-5 aspect-square rounded-full text-white"
                            >
                                &times;
                            </button>
                            <div className="modal-body w-full h-full overflow-hidden">
                                <div className="w-full h-full overflow-hidden">
                                    <img src={selectedImage.image} alt="Detail Gambar" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default GaleriLanding
