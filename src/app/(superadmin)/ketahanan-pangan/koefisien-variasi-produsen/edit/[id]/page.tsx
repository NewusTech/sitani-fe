"use client"
import Label from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
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
import { useParams, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Loading from '@/components/ui/Loading';

const formSchema = z.object({
    nilai: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Nilai wajib diisi" })),
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditKoefisienVariasiProdusen = () => {
    interface Response {
        status: string;
        data: Komoditas,
        message: string;
    }

    interface Komoditas {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    interface ResponseEdit {
        status: string;
        message: string;
        data: Data;
    }

    interface Data {
        id: number;
        kepangCvProdusenId: number;
        kepangMasterKomoditasId: number;
        nilai: number;
        createdAt: string;
        updatedAt: string;
        komoditas: Komoditas;
        kepangCvProdusen: KepangCvProdusen;
    }

    interface KepangCvProdusen {
        id: number;
        bulan: string;
        createdAt: string;
        updatedAt: string;
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

    // Edit
    type FormSchemaType = z.infer<typeof formSchema>;

    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    const { data: dataProdusen, error } = useSWR<ResponseEdit>(
        `/kepang/cv-produsen/get/${id}`,
        async (url: string) => {
            try {
                const response = await axiosPrivate.get(url);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                return null;
            }
        }
    );

    useEffect(() => {
        if (dataProdusen) {
            setValue("nilai", dataProdusen?.data?.nilai || 0);
        }
    }, [dataProdusen, setValue]);


    const [loading, setLoading] = useState(false);
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true);
        try {
            await axiosPrivate.put(`/kepang/cv-produsen/update/${id}`, data);
            // alert
            Swal.fire({
                icon: 'success',
                title: 'Data berhasil di edit!',
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
            console.log("Success to update user:", data);
            navigate.push('/ketahanan-pangan/koefisien-variasi-produsen');
            reset();
        } catch (error) {
            console.error('Failed to update user:', error);
        }
        mutate(`/kepang/cv-produsen/get`);
    };
    // Edit

    function formatDate(date: string): string {
        const [year, month] = date.split("-");
        // Convert the month to remove leading zeros (e.g., "06" -> "6")
        const formattedMonth = parseInt(month, 10).toString();
        return `${year}/${formattedMonth}`;
    }

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex flex-col md:flex-row justify-between gap-2 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Komoditas" />
                            <Input
                                type="text"
                                placeholder="Komoditas"
                                disabled={true}
                                value={dataKomoditas?.data.nama || ''}
                            />
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Bulan" />
                            <Input
                                type="text"
                                placeholder="Komoditas"
                                disabled={true}
                                value={formatDate(dataProdusen?.data?.kepangCvProdusen.bulan || '')}
                            />
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
                    <Button type="submit" variant="primary" size="lg" className="w-[120p transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300x]">
                        {loading ? (
                            <Loading />
                        ) : (
                            "Edit"
                        )}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default EditKoefisienVariasiProdusen