"use client"
import Label from '@/components/ui/label'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import InputComponent from '@/components/ui/InputKecDesa';
import useLocalStorage from '@/hooks/useLocalStorage';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import useSWR, { mutate, SWRResponse } from 'swr';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Loading from '@/components/ui/Loading';

// Format tanggal yang diinginkan (yyyy-mm-dd)
function formatDate(date: string): string {
    const [year, month] = date.split("-");
    // Convert the month to remove leading zeros (e.g., "06" -> "6")
    const formattedMonth = parseInt(month, 10).toString();
    return `${year}/${formattedMonth}`;
}

const formSchema = z.object({
    kepang_master_komoditas_id: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Komoditas wajib diisi" })),
    bulan: z.preprocess(
        (val) => typeof val === "string" ? formatDate(val) : val,
        z.string().min(1, { message: "Bulan wajib diisi" })
    ),
    nilai: z
        .string()
        .min(1, { message: "Telur Ayam wajib diisi" })
});

type FormSchemaType = z.infer<typeof formSchema>;

const TamabahPenyuluhDataKecamatan = () => {
    // GET ALL KOMODITAS
    interface Komoditas {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Response {
        status: string;
        data: Komoditas[];
        message: string;
    }

    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataKomoditas }: SWRResponse<Response> = useSWR(
        `/kepang/master-komoditas/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );

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

    const komoditasOptions = dataKomoditas?.data.map(komoditas => ({
        id: komoditas.id.toString(),
        name: komoditas.nama,
    }));

    // TAMBAH
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true);
        try {
            await axiosPrivate.post("/kepang/cv-produsen/create", data);
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
            navigate.push('/ketahanan-pangan/koefisien-variasi-produsen');
            console.log("Success to create koefisien variasi produsen:");
            reset()
        } catch (e: any) {
            console.log(data)
            Swal.fire({
                icon: 'error',
                title: 'Terjadi kesalahan!',
                text: 'Terjadi kesalahan',
                showConfirmButton: true,
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                customClass: {
                    title: 'text-2xl font-semibold text-red-600',
                    icon: 'text-red-500 animate-bounce',
                },
                backdrop: 'rgba(0, 0, 0, 0.4)',
            });
            console.log("Failed to create koefisien variasi produsen:");
            return;
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/kepang/cv-produsen/get`);
    };

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Komoditas" />
                            <Controller
                                name="kepang_master_komoditas_id"
                                control={control}
                                render={({ field }) => (
                                    <InputComponent
                                        typeInput="selectSearch"
                                        placeholder="Pilih Komoditas"
                                        label="Komoditas"
                                        value={field.value}
                                        onChange={field.onChange}
                                        items={komoditasOptions}
                                    />
                                )}
                            />
                            {errors.kepang_master_komoditas_id && (
                                <p className="text-red-500">{errors.kepang_master_komoditas_id.message}</p>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Bulan" />
                            <Input
                                type="month"
                                placeholder="Masukkan Bulan"
                                {...register('bulan')}
                                className={`${errors.bulan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.bulan && (
                                <HelperError>{errors.bulan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nilai" />
                            <Input
                                type="number"
                                placeholder="Masukkan Nilai"
                                {...register('nilai')}
                                className={`${errors.nilai ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.nilai && (
                                <HelperError>{errors.nilai.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 mt-3 flex justify-end gap-3">
                    <Link href="/ketahanan-pangan/koefisien-variasi-produsen" className='bg-white w-[120px] text-sm md:text-base  rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium flex justify-center items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">
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

export default TamabahPenyuluhDataKecamatan