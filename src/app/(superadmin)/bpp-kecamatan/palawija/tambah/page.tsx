"use client"

import React, { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import useSWR, { SWRResponse, mutate } from "swr";
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import DesaValue from '@/components/superadmin/SelectComponent/DesaValue';
import useLocalStorage from '@/hooks/useLocalStorage';

// Define type for form data
type FormData = {
    kecamatan_id: number;
    desa_id: number;
    tanggal: string;
    korluh_master_palawija_id: number;
    lahan_sawah_panen?: number;
    lahan_sawah_panen_muda?: number;
    lahan_sawah_panen_hijauan_pakan_ternak?: number;
    lahan_sawah_tanam?: number;
    lahan_sawah_puso?: number;
    lahan_bukan_sawah_panen?: number;
    lahan_bukan_sawah_panen_muda?: number;
    lahan_bukan_sawah_panen_hijauan_pakan_ternak?: number;
    lahan_bukan_sawah_tanam?: number;
    lahan_bukan_sawah_puso?: number;
};

const korluhMasterPalawijaData: any = [
    {
        id: 1,
        nama: 'JUMLAH JAGUNG',
        anak: [
            {
                id: 12,
                nama: 'Hibrida',
                anak: [
                    { id: 15, nama: 'Bantuan Pemerintah' },
                    { id: 16, nama: 'Non Bantuan Pemerintah' },
                ],
            },
            { id: 13, nama: 'Komposit', anak: [] },
            { id: 14, nama: 'Lokal', anak: [] },
        ],
    },
    {
        id: 2,
        nama: 'KEDELAI',
        anak: [
            { id: 17, nama: 'Bantuan Pemerintah', anak: [] },
            { id: 18, nama: 'Non Bantuan Pemerintah', anak: [] },
        ],
    },
    {
        id: 22,
        nama: 'JUMLAH TEBU',
        anak: [],
    },
    // Add more data as needed...
];


// Fungsi untuk format tanggal ke 'YYYY-MM-DD'
const formatDateToday = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const today = formatDateToday(new Date());

const TambahPadi: React.FC = () => {
    // GET ALL MASTER PALAWIJA
    interface Kecamatan {
        id: number;
        nama: string;
    }

    interface Response {
        status: string;
        data: Kecamatan[];
        message: string;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataMaster }: SWRResponse<any> = useSWR(
        `/korluh/master-palawija/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    const { register,
        handleSubmit,
        setValue,
        watch,
        control,
    } = useForm<FormData>({
        defaultValues: {
            tanggal: today,
        },
    });

    const [selectedKorluh, setSelectedKorluh] = useState<number | null | undefined>(null);
    const [selectedAnak, setSelectedAnak] = useState<number | null | undefined>(null);
    const [selectedSubAnak, setSelectedSubAnak] = useState<number | null>(null);

    const handleKorluhChange = (korluhId: number) => {
        setSelectedKorluh(korluhId);
        setSelectedAnak(null);
        setSelectedSubAnak(null);
        setValue('korluh_master_palawija_id', korluhId); // Set initial value to the selected master
    };

    const handleAnakChange = (anakId: number) => {
        setSelectedAnak(anakId);
        setSelectedSubAnak(null);
        setValue('korluh_master_palawija_id', anakId); // Update to anak id
    };

    const handleSubAnakChange = (subAnakId: number) => {
        setSelectedSubAnak(subAnakId);
        setValue('korluh_master_palawija_id', subAnakId); // Update to sub anak id
    };

    // TAMBAH
    // const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);
    const kecamatanValue = watch("kecamatan_id");

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted

        // Convert the tanggal field to the desired format
        const formatDate = (date: string | Date) => {
            const d = new Date(date);
            const year = d.getFullYear();
            const month = d.getMonth() + 1; // Months are zero-based
            const day = d.getDate();
            return `${year}/${month}/${day}`;
        };

        const formData = {
            ...data,
            tanggal: formatDate(data.tanggal),
            kecamatan_id: Number(data.kecamatan_id),
            desa_id: Number(data.desa_id),
            korluh_master_palawija_id: Number(data.korluh_master_palawija_id),
            lahan_sawah_panen: data.lahan_sawah_panen ? Number(data.lahan_sawah_panen) : undefined,
            lahan_sawah_panen_muda: data.lahan_sawah_panen_muda ? Number(data.lahan_sawah_panen_muda) : undefined,
            lahan_sawah_panen_hijauan_pakan_ternak: data.lahan_sawah_panen_hijauan_pakan_ternak ? Number(data.lahan_sawah_panen_hijauan_pakan_ternak) : undefined,
            lahan_sawah_tanam: data.lahan_sawah_tanam ? Number(data.lahan_sawah_tanam) : undefined,
            lahan_sawah_puso: data.lahan_sawah_puso ? Number(data.lahan_sawah_puso) : undefined,
            lahan_bukan_sawah_panen: data.lahan_bukan_sawah_panen ? Number(data.lahan_bukan_sawah_panen) : undefined,
            lahan_bukan_sawah_panen_muda: data.lahan_bukan_sawah_panen_muda ? Number(data.lahan_bukan_sawah_panen_muda) : undefined,
            lahan_bukan_sawah_panen_hijauan_pakan_ternak: data.lahan_bukan_sawah_panen_hijauan_pakan_ternak ? Number(data.lahan_bukan_sawah_panen_hijauan_pakan_ternak) : undefined,
            lahan_bukan_sawah_tanam: data.lahan_bukan_sawah_tanam ? Number(data.lahan_bukan_sawah_tanam) : undefined,
            lahan_bukan_sawah_puso: data.lahan_bukan_sawah_puso ? Number(data.lahan_bukan_sawah_puso) : undefined,
        };

        // setLoading(true); // Set loading to true when the form is submitted
        try {
            // await axiosPrivate.post("/korluh/palawija/create", formData);
            console.log(formData)
            // push
            // navigate.push('/bpp-kecamatan');
            console.log("Success to create user:");
            // reset()
        } catch (e: any) {
            console.log(data)
            console.log("Failed to create user:");
            return;
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/korluh/palawija/get`);
    };

    return (
        <div className="container mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="">
                {/* Kecamatan, Desa, and Tanggal Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="kecamatan_id">Kecamatan</label>
                        <Controller
                            name="kecamatan_id"
                            control={control}
                            rules={{ required: "Kecamatan is required" }} // Add required rule
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <KecValue
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    {error && <p className="text-red-500">{error.message}</p>} {/* Display error message */}
                                </>
                            )}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="desa_id">Desa</label>
                        <Controller
                            name="desa_id"
                            control={control}
                            rules={{ required: "Desa is required" }} // Add required rule
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <DesaValue
                                        value={field.value}
                                        onChange={field.onChange}
                                        kecamatanValue={kecamatanValue}
                                    />
                                    {error && <p className="text-red-500">{error.message}</p>} {/* Display error message */}
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col mb-3">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="tanggal" >Tanggal</label>
                        <Input
                            type="date"
                            placeholder='Tanggal'
                            id="tanggal"
                            {...register('tanggal', { required: 'Tanggal is required' })}
                        />
                    </div>
                </div>

                {/* Select Inputs for Korluh and Anak */}
                <div className="flex flex-col mb-3">
                    <label className="text-lg text-primary mb- font-semibold" htmlFor="korluh_master_palawija_id" >Korluh Master Palawija</label>
                    <select
                        id="korluh_master_palawija_id"
                        className='border border-primary p-2 rounded-full ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50'
                        onChange={(e) => handleKorluhChange(Number(e.target.value))}
                        required
                    >
                        <option value="">Select Palawija</option>
                        {korluhMasterPalawijaData.map((korluh: any) => (
                            <option key={korluh.id} value={korluh.id}>
                                {korluh.nama}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedKorluh !== null && korluhMasterPalawijaData?.find((k: any) => k.id === selectedKorluh)?.anak.length > 0 && (
                    <div className="flex flex-col mb-3">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="anak_id" >Pilih Jenis</label>
                        <select
                            id="anak_id"
                            className='border border-primary p-2 rounded-full ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50'
                            onChange={(e) => handleAnakChange(Number(e.target.value))}
                            required
                        >
                            <option value="">Pilih Kategori</option>
                            {korluhMasterPalawijaData.find((k: any) => k.id === selectedKorluh)?.anak.map((anak: any) => (
                                <option className='' key={anak.id} value={anak.id}>
                                    {anak.nama}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedAnak !== null && korluhMasterPalawijaData?.find((k: any) => k.id === selectedKorluh)?.anak.find((a: any) => a.id === selectedAnak)?.anak.length > 0 && (
                    <div className="flex flex-col mb-3">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="sub_anak_id" >Sub Anak</label>
                        <select
                            id="sub_anak_id"
                            className='border border-primary p-2 rounded-full ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50'
                            onChange={(e) => handleSubAnakChange(Number(e.target.value))}
                            required
                        >
                            <option value="">Select Sub Anak</option>
                            {korluhMasterPalawijaData.find((k: any) => k.id === selectedKorluh)?.anak.find((a: any) => a.id === selectedAnak)?.anak.map((subAnak: any) => (
                                <option key={subAnak.id} value={subAnak.id}>
                                    {subAnak.nama}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Other Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="lahan_sawah_panen" >Lahan Sawah Panen</label>
                        <Input
                            type="number"
                            placeholder='Lahan Sawah Panen'
                            id="lahan_sawah_panen"
                            {...register('lahan_sawah_panen')}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="lahan_sawah_panen_muda" >Lahan Sawah Panen Muda</label>
                        <Input
                            type="number"
                            placeholder='Lahan Sawah Panen Muda'
                            id="lahan_sawah_panen_muda"
                            {...register('lahan_sawah_panen_muda')}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="lahan_sawah_panen_hijauan_pakan_ternak" >Lahan Sawah Panen Hijauan Pakan Ternak</label>
                        <Input
                            type="number"
                            placeholder='Lahan Sawah Panen Hijauan Pakan'
                            id="lahan_sawah_panen_hijauan_pakan_ternak"
                            {...register('lahan_sawah_panen_hijauan_pakan_ternak')}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="lahan_sawah_tanam" >Lahan Sawah Tanam</label>
                        <Input
                            type="number"
                            placeholder='Lahan Sawah Tanam'
                            id="lahan_sawah_tanam"
                            {...register('lahan_sawah_tanam')}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="lahan_sawah_puso" >Lahan Sawah Puso</label>
                        <Input
                            placeholder='Lahan Sawah Puso'
                            type="number"
                            id="lahan_sawah_puso"
                            {...register('lahan_sawah_puso')}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="lahan_bukan_sawah_panen" >Lahan Bukan Sawah Panen</label>
                        <Input
                            placeholder='Lahan Bukan Sawah Panen'
                            type="number"
                            id="lahan_bukan_sawah_panen"
                            {...register('lahan_bukan_sawah_panen')}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="lahan_bukan_sawah_panen_muda" >Lahan Bukan Sawah Panen Muda</label>
                        <Input
                            type="number"
                            placeholder='Lahan Bukan Sawah Panen Muda'
                            id="lahan_bukan_sawah_panen_muda"
                            {...register('lahan_bukan_sawah_panen_muda')}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="lahan_bukan_sawah_panen_hijauan_pakan_ternak" >Lahan Bukan Sawah Panen Hijauan Pakan Ternak</label>
                        <Input
                            placeholder='Lahan Bukan Sawah Hijauan Pakan Ternak'
                            type="number"
                            id="lahan_bukan_sawah_panen_hijauan_pakan_ternak"
                            {...register('lahan_bukan_sawah_panen_hijauan_pakan_ternak')}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="lahan_bukan_sawah_tanam" >Lahan Bukan Sawah Tanam</label>
                        <Input
                            type="number"
                            placeholder='Lahan Bukan Sawah Tanam'
                            id="lahan_bukan_sawah_tanam"
                            {...register('lahan_bukan_sawah_tanam')}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-lg text-primary mb- font-semibold" htmlFor="lahan_bukan_sawah_puso" >Lahan Bukan Sawah Puso</label>
                        <Input
                            type="number"
                            placeholder='Lahan Bukan Sawah Puso'
                            id="lahan_bukan_sawah_puso"
                            {...register('lahan_bukan_sawah_puso')}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="my-10 flex justify-end gap-3">
                    <Link href="/korlub/padi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Tambah"
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default TambahPadi;
