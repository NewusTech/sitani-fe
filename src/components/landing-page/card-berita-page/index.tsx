import Image from 'next/image'
import React from 'react'
import ArrowBeritaPage from '../../../../public/icons/ArrowBeritaPage'

interface CardBeritaPageProps {
    image?: string
    date?: string
    title?: string
    desc?: string
}

const CardBeritaPage = (props: CardBeritaPageProps) => {
    return (
        <>
            <div className="rounded-xl bg-primary-600 p-4 flex gap-4">
                <div className="flex items-center justify-center rounded overflow-hidden">
                    <Image
                        src={props.image || "/assets/images/cardBeritaPage.png"}
                        alt="logo"
                        width={300}
                        height={300}
                        unoptimized
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col gap-4 w-full">
                    <div className="mt-4 text-[#2C2C2C] text-[12px]">
                        {props.date || "January 13, 2024"}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-[#2C2C2C] text-[20px] font-semibold">
                            {props.title || "Lorem Ipsum Dolor Amet Amit Amon Amin"}
                        </div>
                        <ArrowBeritaPage />
                    </div>
                    <div className="text-sm text-[#2C2C2C]">
                        {props.desc || "Lörem ipsum astrobel sar direlig. Kronde est konfoni med kelig. Terabel pov astrobel ?"}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CardBeritaPage