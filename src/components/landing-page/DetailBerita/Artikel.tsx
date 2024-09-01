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
            <div className="image w-full md:h-[400px] h-[230px] bg-blue-300 rounded-lg overflow-hidden">
                <Image src={props.image || "../../assets/images/detail-berita.png"} alt="logo" width={800} height={500} unoptimized className='w-full h-full object-cover' />
            </div>
            <div className="title text-xl md:text-2xl font-semibold text-[#2C2C2C]">{props.title || "Title"}</div>
            <div className="date text-sm md:text-sm text-[#656565]">{props.date || "date"}</div>
            <div
                className="prose max-w-none text-justify"
                dangerouslySetInnerHTML={{ __html: props.desc || "Deskripsi" }}
            />
        </div>
    )
}

export default Artikel