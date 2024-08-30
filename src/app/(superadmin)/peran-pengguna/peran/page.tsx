import { Input } from '@/components/ui/input'
import React from 'react'
import SearchIcon from '../../../../../public/icons/SearchIcon'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const PeranPage = () => {
    return (
        <div>
            {/* title */}
            <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Peran</div>
            {/* title */}
            {/* top */}
            <div className="header flex gap-2 justify-between items-center">
                <div className="search md:w-[50%]">
                    <Input
                        type="text"
                        placeholder="Cari"
                        rightIcon={<SearchIcon />}
                        className='border-primary py-2'
                    />
                </div>
                <div className="right">
                    <Link href="/peran-pengguna/peran/tambah" className='bg-primary text-sm px-3 rounded-full text-white hover:bg-primary/80 p-2 border border-primary text-center font-medium'>
                        Tambah Data
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PeranPage