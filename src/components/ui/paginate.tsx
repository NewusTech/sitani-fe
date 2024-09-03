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

interface Pagination {
    page: number;
    perPage: number;
    totalPages: number;
    totalCount: number;
    links: {
        prev: string | null;
        next: string | null;
    };
}

interface Data {
    pagination: Pagination | undefined;
    url: string;
}

function Paginate(data: Data) {
    let url = data?.url || '';
    let pagination = [];

    let totalPages = data?.pagination?.totalPages || 1;
    let currentPage = data?.pagination?.page || 1;

    let right = true;
    let left = true;

    for (let i = 1; i <= totalPages; i++) {
        if ((i >= currentPage - 2 && i <= currentPage + 2) || i === 1 || i === totalPages) {
            pagination.push(
                <PaginationItem key={i}>
                    <PaginationLink href={`${url}?page=${i}`} isActive={i === currentPage}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        if (i < totalPages && i > 1) {
            if (i < currentPage - 2 && left) {
                left = false;
                pagination.push(
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )
            }
            if (i > currentPage + 2 && right) {
                right = false;
                pagination.push(
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )
            }
        }
    }

    let next = currentPage + 1 >= totalPages ? `${url}?page=${totalPages}` : `${url}?page=${currentPage + 1}`;
    let prev = currentPage - 1 <= 0 ? '' : `${url}?page=${currentPage - 1}`;

    return (
        <div>
            {/* pagination */}
            <div className="pagination md:mb-[0px] mb-[110px] flex md:justify-end justify-center">
                <Pagination className='md:justify-end'>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href={prev} />
                        </PaginationItem>

                        {pagination}

                        <PaginationItem>
                            <PaginationNext href={next} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            {/* pagination */}
        </div>
    )
}

export default Paginate
