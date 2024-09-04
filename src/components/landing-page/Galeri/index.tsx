/* eslint-disable @next/next/no-img-element */
"use client"
import CardGaleriPage from "./Card"
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import { useState } from 'react';
import { SWRResponse, mutate } from "swr";
import { Pagination } from "flowbite-react";



const GaleriLanding = () => {
    // pagination
    const paginationTheme = {
        pages: {
            base: "xs:mt-0 text-[12px] md:text-[14px] mt-3 flex gap-2 inline-flex items-center -space-x-px  ",
            showIcon: "inline-flex",
            previous: {
                base: "md:min-w-[40px] min-w-[30px] rounded-md bg-primary md:px-3 md:py-2 px-2 py-2 leading-tight text-gray-500",
                icon: "h-4 w-4 md:h-5 md:w-4  text-white",
            },
            next: {
                base: "md:min-w-[40px] min-w-[30px] rounded-md bg-primary md:px-3 md:py-2 px-2 py-2 leading-tight text-gray-500",
                icon: "h-4 w-4 md:h-5 md:w-4 text-white",
            },
            selector: {
                base: "md:min-w-[40px] min-w-[30px] bg-white border border-gray-200 rounded-md md:px-3 md:py-2 px-2 py-2 leading-tight text-black hover:bg-primary hover:text-white",
                active: "md:min-w-[40px] min-w-[30px] text-white md:px-3 md:py-2 px-2 py-2 bg-primary",
                disabled: "bg-red-500 cursor-normal",
            },
        },
    };
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
        `galeri/get?page=${currentPage}&limit=6`,
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
                <div className="wrap-card grid grid-cols-1 md:grid-cols-3 gap-4 md:py-[30px] py-[20px]">
                    {dataGaleri?.data.data.map((galeri, index) => (
                        <CardGaleriPage key={index} image={galeri.image} deskripsi={galeri.deskripsi} onClick={() => handleCardClick(galeri)} />
                    ))}
                </div>
                {/* Card */}

                {/* pagination */}
                <div className="pagi flex items-center lg:justify-end justify-center">
                    {dataGaleri?.data.pagination.totalCount as number > 1 && (
                        <Pagination theme={paginationTheme}
                            layout="pagination"
                            currentPage={currentPage}
                            totalPages={dataGaleri?.data?.pagination?.totalPages as number}
                            onPageChange={onPageChange}
                            previousLabel=""
                            nextLabel=""
                            showIcons
                        />
                    )}
                </div>
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
