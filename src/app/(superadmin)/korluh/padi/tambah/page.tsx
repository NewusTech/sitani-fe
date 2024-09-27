"use client"
import Label from '@/components/ui/label'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import useSWR, { SWRResponse, mutate } from "swr";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useLocalStorage from '@/hooks/useLocalStorage';
import InputComponent from '@/components/ui/InputKecDesa';
import Loading from '@/components/ui/Loading';
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
        .preprocess((val) => Number(val), z.number().min(1, { message: "Kecamatan wajib diisi" })),
    tanggal: z.preprocess(
        (val) => (typeof val === "string" ? formatDate(val) : val),
        z.string().min(1, { message: "Tanggal wajib diisi" })
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

const TambahDataPadi = () => {
    // GET ALL KECAMATAN
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

    const { data: dataKecamatan }: SWRResponse<Response> = useSWR(
        `kecamatan/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // GET ALL DESA
    interface Desa {
        id: number;
        nama: string;
        kecamatanId: number;
    }

    interface ResponseDesa {
        status: string;
        data: Desa[];
        message: string;
    }

    const { data: dataDesa }: SWRResponse<ResponseDesa> = useSWR(
        `desa/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

    // GET ALL DESA
    const [date, setDate] = React.useState<Date>()
    const [valueSelect, setValueSelectt] = React.useState(""); // Untuk menyimpan nilai jenis padi

    const {
        register,
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
        setValue
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });
    const selectedKecamatan = Number(watch("kecamatan_id")); // Ensure conversion to number

    const kecamatanOptions = dataKecamatan?.data.map(kecamatan => ({
        id: kecamatan.id.toString(),
        name: kecamatan.nama,
    }));

    const desaOptions = dataDesa?.data
        .filter(desa => desa.kecamatanId === selectedKecamatan) // Ensure types match here
        .map(desa => ({
            id: desa.id.toString(),
            name: desa.nama,
        }));

    // TAMBAH
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.post("/korluh/padi/create", data);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil di tambahkan!',
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
            // alert
            // console.log(data)
            // push
            navigate.push('/korluh/padi');
            console.log("Success to create Padi:");
            reset()
        } catch (error: any) {
            // Extract error message from API response
            const errorMessage = error.response?.data?.data?.[0]?.message || 'Gagal menambahkan data!';
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
        }finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/padi/get`);
    };
    // const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    //     console.log(data);
    // };
    const [open, setOpen] = React.useState(false)
    const [value, setValueSelect] = React.useState("")

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-3">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                            <Controller
                                name="kecamatan_id"
                                control={control}
                                render={({ field }) => (
                                    <InputComponent
                                        typeInput="selectSearch"
                                        placeholder="Pilih Kecamatan"
                                        label="Kecamatan"
                                        value={field.value}
                                        onChange={field.onChange}
                                        items={kecamatanOptions}
                                    />
                                )}
                            />
                            {errors.kecamatan_id && (
                                <p className="text-red-500">{errors.kecamatan_id.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanggal Input Data" />
                            <Input
                                type="date"
                                placeholder="Panen"
                                {...register('tanggal')}
                                className={`${errors.tanggal ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.tanggal && (
                                <HelperError>{errors.tanggal.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-primary text-lg font-bold mb-2">1. Jenis Padi</div>
                <div className='mb-3'>
                    <div className="text-primary text-lg font-bold mb-2">Hibrida Bantuan Pemerintah Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('hibrida_bantuan_pemerintah_lahan_sawah_panen')}
                                className={`${errors.hibrida_bantuan_pemerintah_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.hibrida_bantuan_pemerintah_lahan_sawah_panen && (
                                <HelperError>{errors.hibrida_bantuan_pemerintah_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('hibrida_bantuan_pemerintah_lahan_sawah_tanam')}
                                className={`${errors.hibrida_bantuan_pemerintah_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.hibrida_bantuan_pemerintah_lahan_sawah_tanam && (
                                <HelperError>{errors.hibrida_bantuan_pemerintah_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('hibrida_bantuan_pemerintah_lahan_sawah_puso')}
                                className={`${errors.hibrida_bantuan_pemerintah_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.hibrida_bantuan_pemerintah_lahan_sawah_puso && (
                                <HelperError>{errors.hibrida_bantuan_pemerintah_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-lg font-bold mb-2">Hibrida Non Bantuan Pemerintah Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('hibrida_non_bantuan_pemerintah_lahan_sawah_panen')}
                                className={`${errors.hibrida_non_bantuan_pemerintah_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.hibrida_non_bantuan_pemerintah_lahan_sawah_panen && (
                                <HelperError>{errors.hibrida_non_bantuan_pemerintah_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('hibrida_non_bantuan_pemerintah_lahan_sawah_tanam')}
                                className={`${errors.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam && (
                                <HelperError>{errors.hibrida_non_bantuan_pemerintah_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('hibrida_non_bantuan_pemerintah_lahan_sawah_puso')}
                                className={`${errors.hibrida_non_bantuan_pemerintah_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.hibrida_non_bantuan_pemerintah_lahan_sawah_puso && (
                                <HelperError>{errors.hibrida_non_bantuan_pemerintah_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-lg font-bold mb-2">Unggul Bantuan pemerintah Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('unggul_bantuan_pemerintah_lahan_sawah_panen')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_sawah_panen && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('unggul_bantuan_pemerintah_lahan_sawah_tanam')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_sawah_tanam && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('unggul_bantuan_pemerintah_lahan_sawah_puso')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_sawah_puso && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-lg font-bold mb-2">Unggul Bantuan pemerintah Lahan Bukan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('unggul_bantuan_pemerintah_lahan_bukan_sawah_panen')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('unggul_bantuan_pemerintah_lahan_bukan_sawah_puso')}
                                className={`${errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso && (
                                <HelperError>{errors.unggul_bantuan_pemerintah_lahan_bukan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3 4'>
                    <div className="text-primary text-lg font-bold mb-2">Unggul Non Bantuan pemerintah Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('unggul_non_bantuan_pemerintah_lahan_sawah_panen')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_sawah_panen && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('unggul_non_bantuan_pemerintah_lahan_sawah_tanam')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_sawah_tanam && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('unggul_non_bantuan_pemerintah_lahan_sawah_puso')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_sawah_puso && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3 6'>
                    <div className="text-primary text-lg font-bold mb-2">Unggul Non Bantuan pemerintah Lahan Bukan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso')}
                                className={`${errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso && (
                                <HelperError>{errors.unggul_non_bantuan_pemerintah_lahan_bukan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-lg font-bold mb-2">Lokal Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('lokal_lahan_sawah_panen')}
                                className={`${errors.lokal_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lokal_lahan_sawah_panen && (
                                <HelperError>{errors.lokal_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('lokal_lahan_sawah_tanam')}
                                className={`${errors.lokal_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lokal_lahan_sawah_tanam && (
                                <HelperError>{errors.lokal_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('lokal_lahan_sawah_puso')}
                                className={`${errors.lokal_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lokal_lahan_sawah_puso && (
                                <HelperError>{errors.lokal_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-lg font-bold mb-2">Lokal Lahan Bukan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('lokal_lahan_bukan_sawah_panen')}
                                className={`${errors.lokal_lahan_bukan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lokal_lahan_bukan_sawah_panen && (
                                <HelperError>{errors.lokal_lahan_bukan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('lokal_lahan_bukan_sawah_tanam')}
                                className={`${errors.lokal_lahan_bukan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lokal_lahan_bukan_sawah_tanam && (
                                <HelperError>{errors.lokal_lahan_bukan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('lokal_lahan_bukan_sawah_puso')}
                                className={`${errors.lokal_lahan_bukan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lokal_lahan_bukan_sawah_puso && (
                                <HelperError>{errors.lokal_lahan_bukan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className="text-primary text-lg font-bold mb-2">2. Jenis Pengairan</div>
                <div className='mb-3'>
                    <div className="text-primary text-lg font-bold mb-2">Sawah Irigasi</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('sawah_irigasi_lahan_sawah_panen')}
                                className={`${errors.sawah_irigasi_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_irigasi_lahan_sawah_panen && (
                                <HelperError>{errors.sawah_irigasi_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('sawah_irigasi_lahan_sawah_tanam')}
                                className={`${errors.sawah_irigasi_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_irigasi_lahan_sawah_tanam && (
                                <HelperError>{errors.sawah_irigasi_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('sawah_irigasi_lahan_sawah_puso')}
                                className={`${errors.sawah_irigasi_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_irigasi_lahan_sawah_puso && (
                                <HelperError>{errors.sawah_irigasi_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-lg font-bold mb-2">Sawah Tadah Hujan</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('sawah_tadah_hujan_lahan_sawah_panen')}
                                className={`${errors.sawah_tadah_hujan_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_tadah_hujan_lahan_sawah_panen && (
                                <HelperError>{errors.sawah_tadah_hujan_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('sawah_tadah_hujan_lahan_sawah_tanam')}
                                className={`${errors.sawah_tadah_hujan_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_tadah_hujan_lahan_sawah_tanam && (
                                <HelperError>{errors.sawah_tadah_hujan_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('sawah_tadah_hujan_lahan_sawah_puso')}
                                className={`${errors.sawah_tadah_hujan_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_tadah_hujan_lahan_sawah_puso && (
                                <HelperError>{errors.sawah_tadah_hujan_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-lg font-bold mb-2">Sawah Rawa Pasang Surut</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('sawah_rawa_pasang_surut_lahan_sawah_panen')}
                                className={`${errors.sawah_rawa_pasang_surut_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_rawa_pasang_surut_lahan_sawah_panen && (
                                <HelperError>{errors.sawah_rawa_pasang_surut_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('sawah_rawa_pasang_surut_lahan_sawah_tanam')}
                                className={`${errors.sawah_rawa_pasang_surut_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_rawa_pasang_surut_lahan_sawah_tanam && (
                                <HelperError>{errors.sawah_rawa_pasang_surut_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('sawah_rawa_pasang_surut_lahan_sawah_puso')}
                                className={`${errors.sawah_rawa_pasang_surut_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_rawa_pasang_surut_lahan_sawah_puso && (
                                <HelperError>{errors.sawah_rawa_pasang_surut_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className='mb-3'>
                    <div className="text-primary text-lg font-bold mb-2">Sawah Rawa Lebak</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('sawah_rawa_lebak_lahan_sawah_panen')}
                                className={`${errors.sawah_rawa_lebak_lahan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_rawa_lebak_lahan_sawah_panen && (
                                <HelperError>{errors.sawah_rawa_lebak_lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('sawah_rawa_lebak_lahan_sawah_tanam')}
                                className={`${errors.sawah_rawa_lebak_lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_rawa_lebak_lahan_sawah_tanam && (
                                <HelperError>{errors.sawah_rawa_lebak_lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('sawah_rawa_lebak_lahan_sawah_puso')}
                                className={`${errors.sawah_rawa_lebak_lahan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawah_rawa_lebak_lahan_sawah_puso && (
                                <HelperError>{errors.sawah_rawa_lebak_lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/korluh/padi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Tambah"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default TambahDataPadi