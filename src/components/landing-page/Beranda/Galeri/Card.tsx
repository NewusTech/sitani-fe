import Image from 'next/image'
import React from 'react'

interface CardGaleriProps {
    image?: string
}

const CardGaleri = (props: CardGaleriProps) => {
    return (
        <div className="image h-[270px] w-full">
            <Image src={props.image || "../../assets/images/galeri1.png"} alt="logo" width={300} height={300} unoptimized className='w-full h-full object-cover' />
        </div>
    )
}

export default CardGaleri