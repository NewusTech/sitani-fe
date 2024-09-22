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
import KecValue from '@/components/superadmin/SelectComponent/KecamatanValue';
import DesaValue from '@/components/superadmin/SelectComponent/DesaValue';
import Loading from '@/components/ui/Loading';
import Swal from 'sweetalert2';
import InputComponent from '@/components/ui/InputKecDesa';
import useLocalStorage from '@/hooks/useLocalStorage';

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
        .min(1, "Kecamatan is required")
        .transform((value) => Number(value)), // Mengubah string menjadi number
    desa_id: z
        .number()
        .min(1, "Desa is required")
        .transform((value) => Number(value)), // Mengubah string menjadi number
    tanggal: z.preprocess(
        (val) => (typeof val === "string" ? formatDate(val) : val),
        z.string().min(1, { message: "Tanggal wajib diisi" })
    ),
    korluh_master_palawija_id: z
    .preprocess((val) => Number(val), z.number().min(1, { message: "Palawija wajib diisi" })),

    // The following fields are now optional
    lahan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lahan_sawah_panen_muda: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lahan_sawah_panen_hijauan_pakan_ternak: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lahan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lahan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lahan_bukan_sawah_panen: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lahan_bukan_sawah_panen_muda: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lahan_bukan_sawah_panen_hijauan_pakan_ternak: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lahan_bukan_sawah_tanam: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
    lahan_bukan_sawah_puso: z.preprocess((val) => val ? parseFloat(val as string) : undefined, z.number().optional()),
});

type FormSchemaType = z.infer<typeof formSchema>;

const PalawijaKorluhTambah = () => {
    const [date, setDate] = React.useState<Date>()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        control,
        setValue,
        watch,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const kecamatanValue = watch("kecamatan_id");


    // TAMBAH
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.post("/korluh/palawija/create", data);
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
            console.log(data)
            // push
            navigate.push('/korluh/palawija');
            console.log("Success to create Palawija:");
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
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/korluh/palawija/get`);
    };

    // 
    // GET ALL 
    interface Palawija {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Response {
        status: string;
        data: Palawija[];
        message: string;
    }

    const [accessToken] = useLocalStorage("accessToken", "");

    const { data: dataPalawija }: SWRResponse<Response> = useSWR(
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
    const komoditasOptions = dataPalawija?.data.map(komoditas => ({
        id: komoditas.id.toString(),
        name: komoditas.nama,
    }))
    // 

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-4">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-4">
                    <div className="mb-2">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                                <Controller
                                    name="kecamatan_id"
                                    control={control}
                                    render={({ field }) => (
                                        <KecValue
                                            // kecamatanItems={kecamatanItems}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                {errors.kecamatan_id && (
                                    <p className="text-red-500">{errors.kecamatan_id.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pilih Desa" />
                                <Controller
                                    name="desa_id"
                                    control={control}
                                    render={({ field }) => (
                                        <DesaValue
                                            // desaItems={filteredDesaItems}
                                            value={field.value}
                                            onChange={field.onChange}
                                            kecamatanValue={kecamatanValue}
                                        />
                                    )}
                                />
                                {errors.desa_id && (
                                    <p className="text-red-500 mt-1">{errors.desa_id.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Nama Tanaman" />
                                <Controller
                                    name="korluh_master_palawija_id"
                                    control={control}
                                    render={({ field }) => (
                                        <InputComponent
                                            typeInput="selectSearch"
                                            placeholder="Pilih Palawija"
                                            label="Palawija"
                                            value={field.value}
                                            onChange={field.onChange}
                                            items={komoditasOptions}
                                        />
                                    )}
                                />
                                {errors.korluh_master_palawija_id && (
                                    <HelperError>{errors.korluh_master_palawija_id.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Tanggal" />
                                <Input
                                    type="date"
                                    placeholder="Tanggal"
                                    {...register('tanggal')}
                                    className={`${errors.tanggal ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.tanggal && (
                                    <HelperError>{errors.tanggal.message}</HelperError>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                <div className='mb-4'>
                    <div className="text-primary text-lg font-bold mb-2">Lahan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('lahan_sawah_panen')}
                                className={`${errors.lahan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lahan_sawah_panen && (
                                <HelperError>{errors.lahan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen Muda" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen Muda"
                                {...register('lahan_sawah_panen_muda')}
                                className={`${errors.lahan_sawah_panen_muda ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lahan_sawah_panen_muda && (
                                <HelperError>{errors.lahan_sawah_panen_muda.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen Hijauan Pakan Ternak" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen Hijauan Pakan Ternak"
                                {...register('lahan_sawah_panen_hijauan_pakan_ternak')}
                                className={`${errors.lahan_sawah_panen_hijauan_pakan_ternak ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lahan_sawah_panen_hijauan_pakan_ternak && (
                                <HelperError>{errors.lahan_sawah_panen_hijauan_pakan_ternak.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('lahan_sawah_tanam')}
                                className={`${errors.lahan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lahan_sawah_tanam && (
                                <HelperError>{errors.lahan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 md:w-1/2 pr-3 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('lahan_sawah_puso')}
                                className={`${errors.lahan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lahan_sawah_puso && (
                                <HelperError>{errors.lahan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className='mb-4'>
                    <div className="text-primary text-lg font-bold mb-2">Lahan Bukan Sawah</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen"
                                {...register('lahan_bukan_sawah_panen')}
                                className={`${errors.lahan_bukan_sawah_panen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lahan_bukan_sawah_panen && (
                                <HelperError>{errors.lahan_bukan_sawah_panen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen Muda" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen Muda"
                                {...register('lahan_bukan_sawah_panen_muda')}
                                className={`${errors.lahan_bukan_sawah_panen_muda ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lahan_bukan_sawah_panen_muda && (
                                <HelperError>{errors.lahan_bukan_sawah_panen_muda.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen Hijauan Pakan Ternak" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Panen Hijauan Pakan Ternak"
                                {...register('lahan_bukan_sawah_panen_hijauan_pakan_ternak')}
                                className={`${errors.lahan_bukan_sawah_panen_hijauan_pakan_ternak ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lahan_bukan_sawah_panen_hijauan_pakan_ternak && (
                                <HelperError>{errors.lahan_bukan_sawah_panen_hijauan_pakan_ternak.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Tanam"
                                {...register('lahan_bukan_sawah_tanam')}
                                className={`${errors.lahan_bukan_sawah_tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lahan_bukan_sawah_tanam && (
                                <HelperError>{errors.lahan_bukan_sawah_tanam.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 md:w-1/2 pr-3 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="Puso"
                                {...register('lahan_bukan_sawah_puso')}
                                className={`${errors.lahan_bukan_sawah_puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.lahan_bukan_sawah_puso && (
                                <HelperError>{errors.lahan_bukan_sawah_puso.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/korluh/sayuran-buah" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium  transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
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
        </>
    )
}

export default PalawijaKorluhTambah