import CardBerita from '@/components/landing-page/card-berita'
import Image from 'next/image'
import React from 'react'

const DetailBeritaPage = () => {
    return (
        <div className="detail pt-[160px] pb-[30px] container mx-auto px-0">
            <div className="wrap flex flex-col gap-3">
                <div className="image w-full h-[600px] bg-blue-300 rounded overflow-hidden">
                    <Image src="/assets/images/detail-berita.png" alt="logo" width={800} height={500} unoptimized className='w-full h-full object-cover' />
                </div>
                <div className="title text-2xl font-semibold text-[#2C2C2C]">Lorem ipsum dolor sit amet</div>
                <div className="date text-xs text-[#656565]">November 12, 2023</div>
                <div className="desc text-base text-[#2C2C2C]">Lorem ipsum dolor sit amet consectetur. Diam accumsan sollicitudin amet faucibus odio aliquam. Ac mauris mauris faucibus eget. Risus morbi tellus dignissim ullamcorper sed. Amet enim enim fusce ultricies eu aliquam ut nec. Ac blandit consequat hac cursus ac. Pellentesque imperdiet erat eros nibh diam at metus. Lacus eleifend purus tellus fringilla mattis arcu sit et neque. Euismod mollis sed risus vel ultrices leo in ultrices interdum. Non pretium commodo dictumst aliquet tincidunt ultrices tellus donec. Pharetra praesent mattis tincidunt quis risus scelerisque. Cras adipiscing enim amet neque dictum. Tincidunt faucibus fermentum egestas leo. Varius consectetur dignissim porttitor amet commodo vitae praesent. Leo integer faucibus mattis pharetra mattis augue sem ornare. Eu odio nunc tempus lectus morbi. Egestas feugiat volutpat eget consectetur vulputate pellentesque. Adipiscing et viverra enim venenatis vitae arcu eget.</div>
            </div>
            {/* header */}
            <div className="header items-center flex gap-8 my-6">
                <div className="text-primary font-semibold text-3xl flex-shrink-0">Berita Lainnya</div>
                <div className="garis h-[3px] w-full bg-secondary"></div>
            </div>
            {/* header */}
            {/* card */}
            <div className="berita mt-[60px] grid grid-cols-2 md:grid-cols-4 gap-4">
                <CardBerita />
                <CardBerita />
                <CardBerita />
                <CardBerita />
            </div>
            {/* card */}
        </div>
    )
}

export default DetailBeritaPage