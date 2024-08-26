import CardGaleriPage from '@/components/landing-page/CardGaleriPage'
import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const GaleriPage = () => {
  return (
    <div className='pt-[130px] container mx-auto px-0'>
      <div className="galeri py-[60px]">
        {/* header */}
        <div className="header items-center flex gap-8 ">
          <div className="text-primary font-semibold text-3xl flex-shrink-0">Galeri</div>
          <div className="garis h-[3px] w-full bg-secondary"></div>
        </div>
        {/* header */}
        {/* Card */}
        <div className="wrap-card grid grid-cols-2 md:grid-cols-3 gap-4 py-[30px]">
          <CardGaleriPage />
          <CardGaleriPage />
          <CardGaleriPage />
          <CardGaleriPage />
          <CardGaleriPage />
          <CardGaleriPage />
        </div>
        {/* Card */}

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
    </div>
  )
}

export default GaleriPage