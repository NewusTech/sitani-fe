import React from 'react'
import Link from 'next/link';

interface LabelProps {
    label?: string;
    name?: string;
}

const LabelDetail = (props: LabelProps) => {
    return (
        <div>
            <div className="label font-semibold">{props.label || '-'}</div>
            <div className="name text-black/70">{props.name || '-'}</div>
        </div>
    )
}

const DetailPalawija2Page = () => {
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Palawija 2</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/tanaman-pangan-holtikutura/realisasi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Palawija 2</div>
                <div className="wrap">
                    <div className="wr">
                        <div className="font-semibold mb-2 text-lg mt-5 uppercase">Kecamatan</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Nama' name='Metro Kibang' />
                        </div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Jagung</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Produktivitas (ku/ha)' name='123000' />
                            <LabelDetail label='Produksi (ton)' name='123000' />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Kedelai</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Produktivitas (ku/ha)' name='123000' />
                            <LabelDetail label='Produksi (ton)' name='123000' />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Kacang Tanah</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Produktivitas (ku/ha)' name='123000' />
                            <LabelDetail label='Produksi (ton)' name='123000' />
                        </div>
                    </div>
                    <hr className='my-2' />
                </div>
                <div className="wrap">
                    <div className="wr">
                        <div className="font-semibold mb-2 text-lg mt-5 uppercase">Kecamatan</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Nama' name='Metro Kibang' />
                        </div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Jagung</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Produktivitas (ku/ha)' name='123000' />
                            <LabelDetail label='Produksi (ton)' name='123000' />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Kedelai</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Produktivitas (ku/ha)' name='123000' />
                            <LabelDetail label='Produksi (ton)' name='123000' />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Kacang Tanah</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Produktivitas (ku/ha)' name='123000' />
                            <LabelDetail label='Produksi (ton)' name='123000' />
                        </div>
                    </div>
                    <hr className='my-2' />
                </div>
                {/* jumlah total */}
                <div className="wrap">
                    <div className="wr">
                        <div className="font-semibold mb-2 text-lg mt-5 uppercase">Jumlah</div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Jagung</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Produktivitas (ku/ha)' name='123000' />
                            <LabelDetail label='Produksi (ton)' name='123000' />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Kedelai</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Produktivitas (ku/ha)' name='123000' />
                            <LabelDetail label='Produksi (ton)' name='123000' />
                        </div>
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Kacang Tanah</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Produktivitas (ku/ha)' name='123000' />
                            <LabelDetail label='Produksi (ton)' name='123000' />
                        </div>
                    </div>
                    <hr className='my-2' />
                </div>
                {/* jumlah total */}
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailPalawija2Page