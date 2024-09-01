import Image from 'next/image'
import React from 'react'
import ArrowBeritaPage from '../../../../public/icons/ArrowBeritaPage'
import Link from 'next/link'

interface CardBeritaPageProps {
    image?: string
    date?: string
    title?: string
    desc?: string
    slug?: string
}

const CardBerita = (props: CardBeritaPageProps) => {
    return (
        <>
            <Link href={`/berita/${props.slug}`} className="rounded-xl bg-primary-600 p-4 flex flex-col lg:flex-row gap-4">
                <div className="flex items-center justify-center rounded overflow-hidden w-full h-48 lg:w-1/2 lg:h-full">
                    <Image
                        src={props.image || "/assets/images/cardBeritaPage.png"}
                        alt="logo"
                        width={300}
                        height={300}
                        unoptimized
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="flex flex-col gap-1 lg:gap-4 w-full">
                    <div className="mt-2 lg:mt-4 text-[#2C2C2C] text-xs lg:text-sm">
                        {props.date || "January 13, 2024"}
                    </div>
                    <div className="flex flex-col lg:flex-row lg:gap-2">
                        <div className="text-[#2C2C2C] text-base lg:text-lg line-clamp-2 font-semibold">
                            {props.title || "Lorem Ipsum Dolor Amet Amit Amon Amin"}
                        </div>
                        <div className="hidden lg:block">
                            <ArrowBeritaPage />
                        </div>
                    </div>
                    <div
                        className="prose max-w-none line-clamp-4 text-xs text-[#2C2C2C] text-justify"
                        dangerouslySetInnerHTML={{ __html: props.desc || "Deskripsi" }}
                    />
                </div>
            </Link>

        </>
    )
}

export default CardBerita