import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import SearchIcon from '../../../../../public/icons/SearchIcon'
import UnduhIcon from '../../../../../public/icons/UnduhIcon'
import PrintIcon from '../../../../../public/icons/PrintIcon'
import FilterIcon from '../../../../../public/icons/FilterIcon'
import Link from 'next/link'

const LahanSawah = () => {
    return (
        <div>
            {/* top */}
            <div className="header flex justify-between items-center">
                <div className="search w-[50%] mb-2">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="btn flex gap-3">
                    <Button variant={"outlinePrimary"} className='flex gap-3 items-center text-primary'>
                        <UnduhIcon />
                        Download
                    </Button>
                    <Button variant={"outlinePrimary"} className='flex gap-3 items-center text-primary'>
                        <PrintIcon />
                        Print
                    </Button>
                </div>
            </div>
            {/*  */}
            <div className="wrap-filter flex justify-between items-center mt-42">
                <div className="left gap-2 flex justify-start items-center">
                    <div className="">
                        <Input
                            type='date'
                            className='w-fit py-2'
                        />
                    </div>
                    <div className="">to</div>
                    <div className="">
                        <Input
                            type='date'
                            className='w-fit py-2'
                        />
                    </div>
                    <div className="fil-kect w-[185px]">
                        <Select >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Kecamatan" className='text-2xl' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="select1">Select1</SelectItem>
                                <SelectItem value="select2">Select2</SelectItem>
                                <SelectItem value="select3">Select3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="filter-table w-[40px] h-[40px]">
                        <Button variant="outlinePrimary" className=''>
                            <FilterIcon />
                        </Button>
                    </div>
                </div>
                <div className="right">
                    <Link href="/tanaman-pangan-holtikutura/lahan/tambah-lahan-sawah" className='bg-primary px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
                        Tambah Data
                    </Link>
                </div>
            </div>
            {/* top */}
        </div>
    )
}

export default LahanSawah