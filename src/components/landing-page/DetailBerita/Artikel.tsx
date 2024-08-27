import Image from 'next/image'
import React from 'react'

interface ArtikelProps {
    image?: string
    date?: string
    title?: string
    desc?: string
}

const Artikel = (props: ArtikelProps) => {
    return (
        <div className="wrap flex flex-col gap-3">
            <div className="image w-full h-[600px] bg-blue-300 rounded overflow-hidden">
                <Image src={props.image || "../../assets/images/detail-berita.png"} alt="logo" width={800} height={500} unoptimized className='w-full h-full object-cover' />
            </div>
            <div className="title text-2xl font-semibold text-[#2C2C2C]">{props.title || "Title"}</div>
            <div className="date text-xs text-[#656565]">{props.date || "date"}</div>
            <div className="desc text-base text-[#2C2C2C]">{props.desc || "Deskripsi"}</div>
        </div>
    )
}

export default Artikel