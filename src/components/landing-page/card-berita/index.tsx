import Image from 'next/image'
import React from 'react'

interface CardBeritaProps {
    image?: string
    date?: string
    title?: string
    desc?: string
}

const CardBerita = (props: CardBeritaProps) => {
    return (
        <div className="card rounded-xl bg-primary-600 p-4">
            <div className="image rounded overflow-hidden h-[233px] w-full bg-blue-500">
            <Image src="/assets/images/cardberita.png" alt="logo" width={300} height={300} unoptimized className='w-full h-full object-cover' />
            </div>
            <div className="wrap-teks flex flex-col gap-4">
                <div className="date mt-4 text-[#2C2C2C] text-[12px]">tanggal</div>
                <div className="title text-[#2C2C2C] text-[20px] font-semibold">Lorem Ipsum Dolor Amet Amit Amon Amin</div>
                <div className="desc text-sm text-[#2C2C2C]">Lörem ipsum astrobel sar direlig. Kronde est konfoni med kelig. Terabel pov astrobel ?</div></div>
        </div>
    )
}

export default CardBerita