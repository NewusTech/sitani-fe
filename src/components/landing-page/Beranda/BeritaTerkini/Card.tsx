import Image from 'next/image'
import React from 'react'
import ArrowBeritaPage from '../../../../../public/icons/ArrowBeritaPage'
import Link from 'next/link'

interface CardProps {
    image?: string
    date?: string
    title?: string
    desc?: string
    slug?: string
}

const CardBerita = (props: CardProps) => {
    return (
        <Link href={`/berita/${props.slug}`} className="card rounded-xl bg-primary-600 p-4 pb-8">
            <div className="image rounded overflow-hidden h-[200px] w-full">
                <Image src={props.image || "../../assets/images/cardberita.png"} alt="logo" width={300} height={300} unoptimized className='w-full h-full object-cover' />
            </div>
            <div className="wrap-teks flex flex-col gap-3">
                <div className="date mt-4 text-[#2C2C2C] text-[12px]">
                    {props.date || "tanggal"}
                </div>
                <div className="wrap-title flex gap-1 items-start">
                    <div className="title text-[#2C2C2C] text-[16px] font-semibold line-clamp-2">
                        {props.title || "Title"}
                    </div>
                    <div className="logo pt-1">
                        <ArrowBeritaPage />
                    </div>
                </div>
                <div
                    className="prose max-w-none line-clamp-4 text-xs text-[#2C2C2C] text-justify"
                    dangerouslySetInnerHTML={{ __html: props.desc || "Deskripsi" }}
                />
            </div>
        </Link>
    )
}

export default CardBerita