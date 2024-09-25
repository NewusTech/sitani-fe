import Image from 'next/image'
import React from 'react'

const NotFoundSearch = () => {
    return (
        <div>
            <div className="wrap flex items-center flex-col gap-3">
                <Image
                    src="/assets/images/NotFound.png"
                    alt="logo"
                    width={170}
                    height={170}
                    unoptimized
                    className="object-contain"
                />
                <div className="text-primary text-base md:text-xl font-semibold">
                    Data tidak ditemukan!
                </div>
            </div>
        </div>
    )
}

export default NotFoundSearch