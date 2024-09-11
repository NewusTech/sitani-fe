"use client"
import Label from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useSWR, { mutate } from 'swr';
import Loading from '@/components/ui/Loading';
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

// Format tanggal yang diinginkan (yyyy-mm-dd)

function formatDate(date: string): string {
    const [year, month] = date.split("-");
    // Convert the month to remove leading zeros (e.g., "06" -> "6")
    const formattedMonth = parseInt(month, 10).toString();
    return `${year}/${formattedMonth}`;
}

const formSchema = z.object({
    panen: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "Panen wajib diisi" })),
    gkp_tk_petani: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "NIP wajib diisi" })),
    bulan: z.preprocess(
        (val) => typeof val === "string" ? formatDate(val) : val,
        z.string().min(0, { message: "Bulan wajib diisi" })
    ),
    gkp_tk_penggilingan: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "GKP TK Penggilingan wajib diisi" })),
    jpk: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "JPK wajib diisi" })),
    cabai_merah_keriting: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "Cabai merah keriting wajib diisi" })),
    beras_medium: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "Beras medium wajib diisi" })),
    beras_premium: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "Beras premium wajib diisi" })),
    stok_gkg: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "Stok gkg wajib diisi" })),
    stok_beras: z
        .preprocess((val) => Number(val), z.number().min(0, { message: "Stok beras wajib diisi" })),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface Response {
    status: number;
    message: string;
    data: KepangCvProduksiData;
}

interface KepangCvProduksiData {
    id: number;
    bulan: string; // ISO date string
    panen: number;
    gkpTkPetani: number;
    gkpTkPenggilingan: number;
    jpk: number;
    cabaiMerahKeriting: number;
    berasMedium: number;
    berasPremium: number;
    stokGkg: number;
    stokBeras: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
}

const EditKoefisienProduksi = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    const { data: dataProduksi, error } = useSWR<Response>(
        `/kepang/cv-produksi/get/${id}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                console.log('Berhasil Dapat Data');
                return response.data;
            } catch (error) {
                console.error('Failed to fetch data:', error);
                return null;
            }
        }
    );
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (dataProduksi) {
            // Extract and format the date
            const date = new Date(dataProduksi.data.bulan);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure month has two digits
    
            // Set formatted values
            setValue("bulan", `${year}-${month}`); 
            setValue("panen", dataProduksi.data.panen); 
            setValue("gkp_tk_petani", dataProduksi.data.gkpTkPetani); 
            setValue("gkp_tk_penggilingan", dataProduksi.data.gkpTkPenggilingan); 
            setValue("jpk", dataProduksi.data.jpk); 
            setValue("cabai_merah_keriting", dataProduksi.data.cabaiMerahKeriting); 
            setValue("beras_medium", dataProduksi.data.berasMedium); 
            setValue("beras_premium", dataProduksi.data.berasPremium); 
            setValue("stok_gkg", dataProduksi.data.stokGkg); 
            setValue("stok_beras", dataProduksi.data.stokBeras); 
        }
    }, [dataProduksi, setValue]);
    
    
      

    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true);
        try {
            await axiosPrivate.put(`/kepang/cv-produksi/update/${id}`, data);
            console.log(data)
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil ditambahkan!',
                text: 'Data sudah disimpan sistem!',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                customClass: {
                    title: 'text-2xl font-semibold text-green-600',
                    icon: 'text-green-500 animate-bounce',
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400',
                },
                backdrop: 'rgba(0, 0, 0, 0.4)',
            });
            navigate.push('/ketahanan-pangan/koefisien-variasi-produksi');
            // reset();
        } catch (error) {
            console.error("Failed to create user:", error);
            console.log(data)

        } finally {
            setLoading(false);
        }
        mutate(`/kepang/cv-produksi/get`);
    };

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Bulan" />
                            <Input
                                type="month"
                                placeholder="Bulan"
                                {...register('bulan')}
                                className={`${errors.bulan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.bulan && (
                                <HelperError>{errors.bulan.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen (%)" />
                            <Input
                                type="number"
                                placeholder="Panen (%)"
                                {...register('panen')}
                                className={`${errors.panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.panen && (
                                <HelperError>{errors.panen.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="GKP Tk.Petani" />
                            <Input
                                type="number"
                                placeholder="Masukkan GKP Tk.Petani"
                                {...register('gkp_tk_petani')}
                                className={`${errors.gkp_tk_petani ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.gkp_tk_petani && (
                                <HelperError>{errors.gkp_tk_petani.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="GKG Tk. Penggilingan" />
                            <Input
                                type="number"
                                placeholder="Masukkan GKG Tk. Penggilingan"
                                {...register('gkp_tk_penggilingan')}
                                className={`${errors.gkp_tk_penggilingan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.gkp_tk_penggilingan && (
                                <HelperError>{errors.gkp_tk_penggilingan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="JPK" />
                            <Input
                                type="number"
                                placeholder="Masukkan JPK"
                                {...register('jpk')}
                                className={`${errors.jpk ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.jpk && (
                                <HelperError>{errors.jpk.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Cabai Merah Keriting" />
                            <Input
                                type="number"
                                placeholder="Masukkan Cabai Merah Keriting"
                                {...register('cabai_merah_keriting')}
                                className={`${errors.cabai_merah_keriting ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.cabai_merah_keriting && (
                                <HelperError>{errors.cabai_merah_keriting.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Beras Medium" />
                            <Input
                                type="number"
                                placeholder="Masukkan Beras Medium"
                                {...register('beras_medium')}
                                className={`${errors.beras_medium ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.beras_medium && (
                                <HelperError>{errors.beras_medium.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Beras Premium" />
                            <Input
                                type="number"
                                placeholder="Masukkan Beras Premium"
                                {...register('beras_premium')}
                                className={`${errors.beras_premium ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.beras_premium && (
                                <HelperError>{errors.beras_premium.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Stok GKG" />
                            <Input
                                type="number"
                                placeholder="Masukkan Stok GKG"
                                {...register('stok_gkg')}
                                className={`${errors.stok_gkg ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.stok_gkg && (
                                <HelperError>{errors.stok_gkg.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Stok Beras" />
                            <Input
                                type="number"
                                placeholder="Masukkan Stok Beras"
                                {...register('stok_beras')}
                                className={`${errors.stok_beras ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.stok_beras && (
                                <HelperError>{errors.stok_beras.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-10 mt-3 flex justify-end gap-3">
                    <Link href="/ketahanan-pangan/koefisien-variasi-produksi" className='bg-white w-[120px] text-sm md:text-base  rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium flex justify-center items-center'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        {loading ? <Loading /> : "Simpan"}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default EditKoefisienProduksi