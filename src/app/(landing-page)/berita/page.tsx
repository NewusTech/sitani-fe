import CardBeritaPage from '@/components/landing-page/card-berita-page';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Link from 'next/link';
import React from 'react'

const BeritaPage = () => {
    return (
        <div>
            <div className='w-full min-h-screen mt-28'>
                {/* berita terkini */}
                <div className="berita container mx-auto py-[60px]">
                    <div className="header items-center flex gap-5 justify-between">
                        <div className="div">
                            <div className="text-primary font-semibold text-3xl flex-shrink-0">Berita</div>
                            <div className="div">Berita terkait Dinas Ketahanan Pangan, Tanamaan Pangan dan Holtikultura</div>
                        </div>
                        <div className="searc">
                            <Input placeholder="Cari" className='w-[370px] border border-primary' />
                        </div>
                    </div>
                    {/* card */}
                    <div className="berita mt-[60px] grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CardBeritaPage />
                        <CardBeritaPage />
                        <CardBeritaPage />
                        <CardBeritaPage />
                        <CardBeritaPage />
                        <CardBeritaPage />
                    </div>
                    <Link href="" className="selengkapnya">
                    </Link>
                    {/* pagination */}
                    <div className="pagination flex justify-end">
                        <Pagination className='justify-end'>
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

export default BeritaPage