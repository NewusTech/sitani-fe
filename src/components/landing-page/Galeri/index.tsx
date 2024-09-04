/* eslint-disable @next/next/no-img-element */
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
import CardGaleriPage from "./Card"
import useSWR from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'
import { useState } from 'react';
import { SWRResponse, mutate } from "swr";

// Dummy data
const dummyGaleri = [
    {
        image: "../../assets/images/galeri1.png",
        deskripsi: "Deskripsi",
    },
    //... more dummy data
]

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

    // GETALL
    const { data: dataGaleri }: SWRResponse<Response> = useSWR(
        `galeri/get?page=1&`,
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
                <div className="pagination md:mb-[0px] mb-[110px] flex md:justify-end justify-center">
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
