import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Link from 'next/link';
import React from 'react'
import SearchIcon from '../../../../public/icons/SearchIcon';
import CardBerita from './Card';

const dummyBerita = [
    {
        image: '/assets/images/cardBeritaPage.png',
        date: 'January 13, 2024',
        title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
        desc: 'Lörem ipsum astrobel sar direlig. Kronde est konfoni med kelig. Terabel pov astrobel ?',
        link: "/berita/detail-berita"
    },
    {
        image: '/assets/images/cardBeritaPage.png',
        date: 'January 13, 2024',
        title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
        desc: 'Lörem ipsum astrobel sar direlig. Kronde est konfoni med kelig. Terabel pov astrobel ?',
        link: "/berita/detail-berita"
    },
    {
        image: '/assets/images/cardBeritaPage.png',
        date: 'January 13, 2024',
        title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
        desc: 'Lörem ipsum astrobel sar direlig. Kronde est konfoni med kelig. Terabel pov astrobel ?',
        link: "/berita/detail-berita"
    },
    {
        image: '/assets/images/cardBeritaPage.png',
        date: 'January 13, 2024',
        title: 'Lorem Ipsum Dolor Amet Amit Amon Amin',
        desc: 'Lörem ipsum astrobel sar direlig. Kronde est konfoni med kelig. Terabel pov astrobel ?',
        link: "/berita/detail-berita"
    },
]

const BeritaLayout = () => {
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
                    <div className="berita mt-5 lg:mt-[60px] grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dummyBerita.map((berita, index) => (
                            <CardBerita
                                key={index}
                                title={berita.title}
                                link={berita.link}
                                desc={berita.desc}
                                date={berita.date}
                                image={berita.image}
                            />
                        ))}
                    </div>
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
                {/* berita terkini */}
            </div>
        </div>
    )
}

export default BeritaLayout