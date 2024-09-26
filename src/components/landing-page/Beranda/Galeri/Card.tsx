import Image from 'next/image'
import React from 'react'

interface CardGaleriProps {
    image?: string
}

const CardGaleri = (props: CardGaleriProps) => {
    return (
        <div className="image h-[270px] w-full overflow-hidden rounded-md">
            <Image src={props.image || "../../assets/images/galeri1.png"} alt="logo" width={300} height={300} unoptimized className='w-full h-full object-cover hover:scale-105 transition-all duration-300 group-hover:blur-sm group-hover:opacity-1 hover:!blur-none hover:!opacity-100' />
        </div>
    )
}

export default CardGaleri