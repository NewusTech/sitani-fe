"use client";
import Label from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import DesaValue from '@/components/superadmin/SelectComponent/DesaValue';
import { Textarea } from '@/components/ui/textarea';
import Loading from '@/components/ui/Loading';
import InputComponent from '@/components/ui/InputKecDesa';
import Swal from 'sweetalert2';


// Format tanggal yang diinginkan (yyyy-mm-dd)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};
const formSchema = z.object({
    kecamatan_id: z
        .number()
        .transform((value) => Number(value)), // Convert string to number
    tanggal: z.preprocess(
        (val) => typeof val === "string" ? formatDate(val) : val,
        z.string().min(1, { message: "Wajib Penerimaan wajib diisi" })
    ),
    hibrida_bantuan_pemerintah_lahan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    hibrida_bantuan_pemerintah_lahan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    hibrida_bantuan_pemerintah_lahan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    hibrida_non_bantuan_pemerintah_lahan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    hibrida_non_bantuan_pemerintah_lahan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    hibrida_non_bantuan_pemerintah_lahan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_bantuan_pemerintah_lahan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_bantuan_pemerintah_lahan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_bantuan_pemerintah_lahan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_bantuan_pemerintah_lahan_bukan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_bantuan_pemerintah_lahan_bukan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_non_bantuan_pemerintah_lahan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_non_bantuan_pemerintah_lahan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_non_bantuan_pemerintah_lahan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lokal_lahan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lokal_lahan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lokal_lahan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lokal_lahan_bukan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lokal_lahan_bukan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lokal_lahan_bukan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_irigasi_lahan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_irigasi_lahan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_irigasi_lahan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_tadah_hujan_lahan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_tadah_hujan_lahan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_tadah_hujan_lahan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_rawa_pasang_surut_lahan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_rawa_pasang_surut_lahan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_rawa_pasang_surut_lahan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_rawa_lebak_lahan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_rawa_lebak_lahan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    sawah_rawa_lebak_lahan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditDataPadi = () => {
    // INTEGRASI
    interface Response {
        status: string,
        data: Data,
        message: string
    }

    interface Data {
        id: number;
        kecamatanId: number;
        desaId: number;
        tanggal: string;
        hibrida_bantuan_pemerintah_lahan_sawah_panen: number;
        hibrida_bantuan_pemerintah_lahan_sawah_tanam: number;
        hibrida_bantuan_pemerintah_lahan_sawah_puso: number;
        hibrida_non_bantuan_pemerintah_lahan_sawah_panen: number;
        hibrida_non_bantuan_pemerintah_lahan_sawah_tanam: number;
        hibrida_non_bantuan_pemerintah_lahan_sawah_puso: number;
        unggul_bantuan_pemerintah_lahan_sawah_panen: number;
        unggul_bantuan_pemerintah_lahan_sawah_tanam: number;
        unggul_bantuan_pemerintah_lahan_sawah_puso: number;
        unggul_bantuan_pemerintah_lahan_bukan_sawah_panen: number;
        unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam: number;
        unggul_bantuan_pemerintah_lahan_bukan_sawah_puso: number;
        unggul_non_bantuan_pemerintah_lahan_sawah_panen: number;
        unggul_non_bantuan_pemerintah_lahan_sawah_tanam: number;
        unggul_non_bantuan_pemerintah_lahan_sawah_puso: number;
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen: number;
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam: number;
        unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso: number;
        lokal_lahan_sawah_panen: number;
        lokal_lahan_sawah_tanam: number;
        lokal_lahan_sawah_puso: number;
        lokal_lahan_bukan_sawah_panen: number;
        lokal_lahan_bukan_sawah_tanam: number;
        lokal_lahan_bukan_sawah_puso: number;
        sawah_irigasi_lahan_sawah_panen: number;
        sawah_irigasi_lahan_sawah_tanam: number;
        sawah_irigasi_lahan_sawah_puso: number;
        sawah_tadah_hujan_lahan_sawah_panen: number;
        sawah_tadah_hujan_lahan_sawah_tanam: number;
        sawah_tadah_hujan_lahan_sawah_puso: number;
        sawah_rawa_pasang_surut_lahan_sawah_panen: number;
        sawah_rawa_pasang_surut_lahan_sawah_tanam: number;
        sawah_rawa_pasang_surut_lahan_sawah_puso: number;
        sawah_rawa_lebak_lahan_sawah_panen: number;
        sawah_rawa_lebak_lahan_sawah_tanam: number;
        sawah_rawa_lebak_lahan_sawah_puso: number;
        createdAt: string;
        updatedAt: string;
        kecamatan: Kecamatan;
        desa: Desa;
    }

    interface Kecamatan {
        id: number;
        nama: string;
        createdAt: string; // ISO Date string
        updatedAt: string; // ISO Date string
    }

    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
        createdAt: string; // ISO Date string
        updatedAt: string; // ISO Date string
    }

    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    const { data: dataPadi, error } = useSWR<Response>(
        `korluh/padi/get/${id}`,
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
        setValue,
        control,
        watch,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const kecamatanId = watch("kecamatan_id");
    const [initialDesaId, setInitialDesaId] = useState<number | undefined>(undefined);

    useEffect(() => {
        if (dataPadi?.data) {
            // Format tanggal
            const formattedTanggal = formatDate(dataPadi.data.tanggal || '');

            // Set nilai-nilai ke form
            setValue("kecamatan_id", dataPadi.data.kecamatanId);
            setValue("tanggal", new Date(dataPadi.data.tanggal).toISOString().split('T')[0]);
            // Mengonversi nilai ke angka dan memberikan default 0 jika tidak ada
            setValue("hibrida_bantuan_pemerintah_lahan_sawah_panen", (dataPadi.data.hibrida_bantuan_pemerintah_lahan_sawah_panen));
            setValue("hibrida_bantuan_pemerintah_lahan_sawah_tanam", (dataPadi.data.hibrida_bantuan_pemerintah_lahan_sawah_tanam));
            setValue("hibrida_bantuan_pemerintah_lahan_sawah_puso", (dataPadi.data.hibrida_bantuan_pemerintah_lahan_sawah_puso));
            setValue("hibrida_non_bantuan_pemerintah_lahan_sawah_panen", (dataPadi.data.hibrida_non_bantuan_pemerintah_lahan_sawah_panen));
            setValue("hibrida_non_bantuan_pemerintah_lahan_sawah_tanam", (dataPadi.data.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam));
            setValue("hibrida_non_bantuan_pemerintah_lahan_sawah_puso", (dataPadi.data.hibrida_non_bantuan_pemerintah_lahan_sawah_puso));
            setValue("unggul_bantuan_pemerintah_lahan_sawah_panen", (dataPadi.data.unggul_bantuan_pemerintah_lahan_sawah_panen));
            setValue("unggul_bantuan_pemerintah_lahan_sawah_tanam", (dataPadi.data.unggul_bantuan_pemerintah_lahan_sawah_tanam));
            setValue("unggul_bantuan_pemerintah_lahan_sawah_puso", (dataPadi.data.unggul_bantuan_pemerintah_lahan_sawah_puso));
            setValue("unggul_bantuan_pemerintah_lahan_bukan_sawah_panen", (dataPadi.data.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen));
            setValue("unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam", (dataPadi.data.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam));
            setValue("unggul_bantuan_pemerintah_lahan_bukan_sawah_puso", (dataPadi.data.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso));
            setValue("unggul_non_bantuan_pemerintah_lahan_sawah_panen", (dataPadi.data.unggul_non_bantuan_pemerintah_lahan_sawah_panen));
            setValue("unggul_non_bantuan_pemerintah_lahan_sawah_tanam", (dataPadi.data.unggul_non_bantuan_pemerintah_lahan_sawah_tanam));
            setValue("unggul_non_bantuan_pemerintah_lahan_sawah_puso", (dataPadi.data.unggul_non_bantuan_pemerintah_lahan_sawah_puso));
            setValue("unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen", (dataPadi.data.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen));
            setValue("unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam", (dataPadi.data.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam));
            setValue("unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso", (dataPadi.data.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso));
            setValue("lokal_lahan_sawah_panen", (dataPadi.data.lokal_lahan_sawah_panen));
            setValue("lokal_lahan_sawah_tanam", (dataPadi.data.lokal_lahan_sawah_tanam));
            setValue("lokal_lahan_sawah_puso", (dataPadi.data.lokal_lahan_sawah_puso));
            setValue("lokal_lahan_bukan_sawah_panen", (dataPadi.data.lokal_lahan_bukan_sawah_panen));
            setValue("lokal_lahan_bukan_sawah_tanam", (dataPadi.data.lokal_lahan_bukan_sawah_tanam));
            setValue("lokal_lahan_bukan_sawah_puso", (dataPadi.data.lokal_lahan_bukan_sawah_puso));
            setValue("sawah_irigasi_lahan_sawah_panen", (dataPadi.data.sawah_irigasi_lahan_sawah_panen));
            setValue("sawah_irigasi_lahan_sawah_tanam", (dataPadi.data.sawah_irigasi_lahan_sawah_tanam));
            setValue("sawah_irigasi_lahan_sawah_puso", (dataPadi.data.sawah_irigasi_lahan_sawah_puso));
            setValue("sawah_tadah_hujan_lahan_sawah_panen", (dataPadi.data.sawah_tadah_hujan_lahan_sawah_panen));
            setValue("sawah_tadah_hujan_lahan_sawah_tanam", (dataPadi.data.sawah_tadah_hujan_lahan_sawah_tanam));
            setValue("sawah_tadah_hujan_lahan_sawah_puso", (dataPadi.data.sawah_tadah_hujan_lahan_sawah_puso));
            setValue("sawah_rawa_pasang_surut_lahan_sawah_panen", (dataPadi.data.sawah_rawa_pasang_surut_lahan_sawah_panen));
            setValue("sawah_rawa_pasang_surut_lahan_sawah_tanam", (dataPadi.data.sawah_rawa_pasang_surut_lahan_sawah_tanam));
            setValue("sawah_rawa_pasang_surut_lahan_sawah_puso", (dataPadi.data.sawah_rawa_pasang_surut_lahan_sawah_puso));
            setValue("sawah_rawa_lebak_lahan_sawah_panen", (dataPadi.data.sawah_rawa_lebak_lahan_sawah_panen));
            setValue("sawah_rawa_lebak_lahan_sawah_tanam", (dataPadi.data.sawah_rawa_lebak_lahan_sawah_tanam));
            setValue("sawah_rawa_lebak_lahan_sawah_puso", (dataPadi.data.sawah_rawa_lebak_lahan_sawah_puso));
        }
    }, [dataPadi, setValue]);



    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.put(`/korluh/padi/update/${id}`, data);
            console.log("Success to update data Padi:", data);
            // 
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil diperbarui!',
                text: 'Data sudah disimpan sistem!',
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown',
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp',
                },
                customClass: {
                    title: 'text-2xl font-semibold text-green-600',
                    icon: 'text-green-500 animate-bounce',
                    timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400', // Gradasi warna yang lembut
                },
                backdrop: `rgba(0, 0, 0, 0.4)`,
            });
            navigate.push('/korluh/padi');
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal memperbarui data!';
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan!',
                text: errorMessage,
                showConfirmButton: true,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                customClass: {
                    title: 'text-2xl font-semibold text-red-600',
                    icon: 'text-red-500 animate-bounce',
                },
                backdrop: 'rgba(0, 0, 0, 0.4)',
            });
            console.error("Failed to create user:", error);
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/padi/get`);;
    };

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Edit Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-3">
                    <div className="md:flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full text-xs md:text-sm">
                            <Label className='text-xs md:text-sm mb-1' label="Pilih Kecamatan" />
                            <Controller
                                name="kecamatan_id"
                                control={control}
                                render={({ field }) => (
                                    <KecValue
                                        value={field.value}
                                        onChange={(value) => field.onChange(Number(value))} // Ensure value is a number
                                    />
                                )}
                            />
                            {errors.kecamatan_id && (
                                <p className="text-red-500">{errors.kecamatan_id.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanggal Input Data" />
                            <Input
                                type="date"
                                placeholder="Panen"
                                {...register('tanggal')}
                                className={`${errors.tanggal ? 'border-red-500' : 'py-5 text-xs md:text-sm block'}`}
                            />
                            {errors.tanggal && (
                                <HelperError>{errors.tanggal.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-primary text-sm md:text-lg font-bold mb-2">1. Jenis Padi</div>
                <div className='mb-3'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Hibrida Bantuan Pemerintah Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('hibrida_bantuan_pemerintah_lahan_sawah_panen')}
                                className={`${errors.hibrida_bantuan_pemerintah_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.hibrida_bantuan_pemerintah_lahan_sawah_panen && (
                                <HelperError>{errors.hibrida_bantuan_pemerintah_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('hibrida_bantuan_pemerintah_lahan_sawah_tanam')}
                                className={`${errors.hibrida_bantuan_pemerintah_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.hibrida_bantuan_pemerintah_lahan_sawah_tanam && (
                                <HelperError>{errors.hibrida_bantuan_pemerintah_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('hibrida_bantuan_pemerintah_lahan_sawah_puso')}
                                className={`${errors.hibrida_bantuan_pemerintah_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.hibrida_bantuan_pemerintah_lahan_sawah_puso && (
                                <HelperError>{errors.hibrida_bantuan_pemerintah_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Hibrida Non Bantuan Pemerintah Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('hibrida_non_bantuan_pemerintah_lahan_sawah_panen')}
                                className={`${errors.hibrida_non_bantuan_pemerintah_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.hibrida_non_bantuan_pemerintah_lahan_sawah_panen && (
                                <HelperError>{errors.hibrida_non_bantuan_pemerintah_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('hibrida_non_bantuan_pemerintah_lahan_sawah_tanam')}
                                className={`${errors.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam && (
                                <HelperError>{errors.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('hibrida_non_bantuan_pemerintah_lahan_sawah_puso')}
                                className={`${errors.hibrida_non_bantuan_pemerintah_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.hibrida_non_bantuan_pemerintah_lahan_sawah_puso && (
                                <HelperError>{errors.hibrida_non_bantuan_pemerintah_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Unggul Bantuan pemerintah Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('unggul_bantuan_pemerintah_lahan_sawah_panen')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_sawah_panen && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('unggul_bantuan_pemerintah_lahan_sawah_tanam')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_sawah_tanam && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('unggul_bantuan_pemerintah_lahan_sawah_puso')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_sawah_puso && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Unggul Bantuan pemerintah Lahan Bukan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('unggul_bantuan_pemerintah_lahan_bukan_sawah_panen')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('unggul_bantuan_pemerintah_lahan_bukan_sawah_puso')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3 4'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Unggul Non Bantuan pemerintah Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('unggul_non_bantuan_pemerintah_lahan_sawah_panen')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_sawah_panen && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('unggul_non_bantuan_pemerintah_lahan_sawah_tanam')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_sawah_tanam && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('unggul_non_bantuan_pemerintah_lahan_sawah_puso')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_sawah_puso && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3 6'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Unggul Non Bantuan pemerintah Lahan Bukan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Lokal Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('lokal_lahan_sawah_panen')}
                                className={`${errors.lokal_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.lokal_lahan_sawah_panen && (
                                <HelperError>{errors.lokal_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('lokal_lahan_sawah_tanam')}
                                className={`${errors.lokal_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.lokal_lahan_sawah_tanam && (
                                <HelperError>{errors.lokal_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('lokal_lahan_sawah_puso')}
                                className={`${errors.lokal_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.lokal_lahan_sawah_puso && (
                                <HelperError>{errors.lokal_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Lokal Lahan Bukan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('lokal_lahan_bukan_sawah_panen')}
                                className={`${errors.lokal_lahan_bukan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.lokal_lahan_bukan_sawah_panen && (
                                <HelperError>{errors.lokal_lahan_bukan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('lokal_lahan_bukan_sawah_tanam')}
                                className={`${errors.lokal_lahan_bukan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.lokal_lahan_bukan_sawah_tanam && (
                                <HelperError>{errors.lokal_lahan_bukan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('lokal_lahan_bukan_sawah_puso')}
                                className={`${errors.lokal_lahan_bukan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.lokal_lahan_bukan_sawah_puso && (
                                <HelperError>{errors.lokal_lahan_bukan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-primary text-sm md:text-lg font-bold mb-2">2. Jenis Pengairan</div>
                <div className='mb-3'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Sawah Irigasi</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('sawah_irigasi_lahan_sawah_panen')}
                                className={`${errors.sawah_irigasi_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_irigasi_lahan_sawah_panen && (
                                <HelperError>{errors.sawah_irigasi_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('sawah_irigasi_lahan_sawah_tanam')}
                                className={`${errors.sawah_irigasi_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_irigasi_lahan_sawah_tanam && (
                                <HelperError>{errors.sawah_irigasi_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('sawah_irigasi_lahan_sawah_puso')}
                                className={`${errors.sawah_irigasi_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_irigasi_lahan_sawah_puso && (
                                <HelperError>{errors.sawah_irigasi_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Sawah Tadah Hujan</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('sawah_tadah_hujan_lahan_sawah_panen')}
                                className={`${errors.sawah_tadah_hujan_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_tadah_hujan_lahan_sawah_panen && (
                                <HelperError>{errors.sawah_tadah_hujan_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('sawah_tadah_hujan_lahan_sawah_tanam')}
                                className={`${errors.sawah_tadah_hujan_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_tadah_hujan_lahan_sawah_tanam && (
                                <HelperError>{errors.sawah_tadah_hujan_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('sawah_tadah_hujan_lahan_sawah_puso')}
                                className={`${errors.sawah_tadah_hujan_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_tadah_hujan_lahan_sawah_puso && (
                                <HelperError>{errors.sawah_tadah_hujan_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Sawah Rawa Pasang Surut</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('sawah_rawa_pasang_surut_lahan_sawah_panen')}
                                className={`${errors.sawah_rawa_pasang_surut_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_rawa_pasang_surut_lahan_sawah_panen && (
                                <HelperError>{errors.sawah_rawa_pasang_surut_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('sawah_rawa_pasang_surut_lahan_sawah_tanam')}
                                className={`${errors.sawah_rawa_pasang_surut_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_rawa_pasang_surut_lahan_sawah_tanam && (
                                <HelperError>{errors.sawah_rawa_pasang_surut_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('sawah_rawa_pasang_surut_lahan_sawah_puso')}
                                className={`${errors.sawah_rawa_pasang_surut_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_rawa_pasang_surut_lahan_sawah_puso && (
                                <HelperError>{errors.sawah_rawa_pasang_surut_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-sm md:text-lg font-bold mb-2">Sawah Rawa Lebak</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('sawah_rawa_lebak_lahan_sawah_panen')}
                                className={`${errors.sawah_rawa_lebak_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_rawa_lebak_lahan_sawah_panen && (
                                <HelperError>{errors.sawah_rawa_lebak_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('sawah_rawa_lebak_lahan_sawah_tanam')}
                                className={`${errors.sawah_rawa_lebak_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_rawa_lebak_lahan_sawah_tanam && (
                                <HelperError>{errors.sawah_rawa_lebak_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-xs md:text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('sawah_rawa_lebak_lahan_sawah_puso')}
                                className={`${errors.sawah_rawa_lebak_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-xs md:text-sm'}`}
                            />
                            {errors.sawah_rawa_lebak_lahan_sawah_puso && (
                                <HelperError>{errors.sawah_rawa_lebak_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/korluh/padi" className='bg-white w-[120px] text-xs md:text-sm  rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium flex justify-center items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 text-xs md:text-sm">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Simpan"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default EditDataPadi