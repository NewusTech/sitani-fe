import Image from 'next/image'
import React from 'react'

interface CardGaleriProps {
    image?: string
    deskripsi?: string
}

const CardGaleriPage = (props: CardGaleriProps) => {
    return (
        <div className="card bg-primary-600 rounded-md overflow-hidden">
            <div className="image w-full h-[250px] overflow-hidden">
                <Image src={props.image || "../../assets/images/galeri1.png"} alt="logo" width={300} height={300} unoptimized className='w-full h-full object-cover hover:scale-105 transition-all duration-300' />
            </div>
            <div className="Desc text-base text-primary p-4">{props.deskripsi || "Deskripsi"}</div>
        </div>
    )
}

export default CardGaleriPage