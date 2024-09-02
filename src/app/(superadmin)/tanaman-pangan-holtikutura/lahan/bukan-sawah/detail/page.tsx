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

const DetailBukanLahanSawahPage = () => {
    return (
        <div>
            {/* title */}
            <div className="text-2xl mb-5 font-semibold text-primary uppercase">Detail Bukan Lahan Sawah</div>
            {/* title */}
            <div className="mb-10 flex justify-start gap-2 md:gap-3 mt-4">
                <Link href="/tanaman-pangan-holtikutura/lahan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                    Kembali
                </Link>
            </div>
            {/* detail */}
            <div className="wrap-detail bg-slate-100 p-6 mt-5 rounded-lg">
                <div className="font-semibold mb-2 text-lg uppercase">Data Bukan Lahan Sawah</div>
                <div className="wrap">
                    <div className="wr">
                        <div className="font-semibold mb-2 text-lg mt-5 uppercase">Kecamatan</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Nama' name='Metro Kibang' />
                        </div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Luas Lahan Bukan Sawah (Ha)</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Tegal/Kebun' name='123000' />
                            <LabelDetail label='Ladang/Huma' name='123000' />
                            <LabelDetail label='Perkebunan' name='123000' />
                            <LabelDetail label='Hutan Rakyat' name='123000' />
                            <LabelDetail label='Padang Penggembalaan Rumput' name='123000' />
                            <LabelDetail label='Hutan Negara' name='123000' />
                            <LabelDetail label='Smt. Tidak Diusahakan' name='123000' />
                            <LabelDetail label='Lainnya Tambak, Kolam Empang' name='123000' />
                            <LabelDetail label='Jumlah Lahan Bukan Sawah' name='123000' />
                        </div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Lahan Bukan Pertanian</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Jalan, Pemukiman, Perkantoran, Sungai' name='123000' />
                            <LabelDetail label='Total' name='123000' />
                        </div>
                    </div>
                    <hr className='my-2' />
                </div>
                {/* jumlah */}
                <div className="wrap">
                    <div className="wr">
                        <div className="font-semibold mb-2 text-lg mt-5 uppercase">Jumlah</div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Luas Lahan Bukan Sawah (Ha)</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Panen (ha)' name='123000' />
                            <LabelDetail label='Tegal/Kebun' name='123000' />
                            <LabelDetail label='Ladang/Huma' name='123000' />
                            <LabelDetail label='Perkebunan' name='123000' />
                            <LabelDetail label='Hutan Rakyat' name='123000' />
                            <LabelDetail label='Padang Penggembalaan Rumput' name='123000' />
                            <LabelDetail label='Hutan Negara' name='123000' />
                            <LabelDetail label='Smt. Tidak Diusahakan' name='123000' />
                            <LabelDetail label='Lainnya Tambak, Kolam Empang' name='123000' />
                            <LabelDetail label='Jumlah Lahan Bukan Sawah' name='123000' />
                        </div>
                    </div>
                    <div className="wr">
                        <div className="font-semibold text-lg mb-2 mt-3 uppercase">Lahan Bukan Pertanian</div>
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-2 md:gap-3">
                            <LabelDetail label='Jalan, Pemukiman, Perkantoran, Sungai' name='123000' />
                            <LabelDetail label='Total' name='123000' />
                        </div>
                    </div>
                    <hr className='my-2' />
                </div>
                {/* jumlah */}
            </div>
            {/* detail */}
        </div>
    )
}

export default DetailBukanLahanSawahPage