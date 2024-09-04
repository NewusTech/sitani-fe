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
// 
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useLocalStorage from '@/hooks/useLocalStorage'

const dummyGaleri = [
    {
        image: "../../assets/images/galeri1.png",
        deskripsi: "Deskripsi",
    },
    {
        image: "../../assets/images/galeri1.png",
        deskripsi: "Deskripsi",
    },
    {
        image: "../../assets/images/galeri1.png",
        deskripsi: "Deskripsi",
    },
    {
        image: "../../assets/images/galeri1.png",
        deskripsi: "Deskripsi",
    },
    {
        image: "../../assets/images/galeri1.png",
        deskripsi: "Deskripsi",
    },
    {
        image: "../../assets/images/galeri1.png",
        deskripsi: "Deskripsi",
    },
]

const GaleriLanding = () => {
    // INTEGRASI
    interface Galeri {
        id?: string; // Ensure id is a string
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
                        <CardGaleriPage key={index} image={galeri.image} deskripsi={galeri.deskripsi} />
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

            </div>
        </div>
    )
}

export default GaleriLanding