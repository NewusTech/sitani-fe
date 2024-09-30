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
import { Textarea } from '@/components/ui/textarea';
import Loading from '@/components/ui/Loading';
import Swal from 'sweetalert2';
import { useParams, useRouter } from 'next/navigation';
import useSWR, { mutate, SWRResponse } from 'swr';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formSchema = z.object({

    satuan: z
        .string()
        .min(0, { message: "Satuan wajib diisi" }).optional(),
    harga: z
        .number()
        .transform((value) => Number(value)),
    keterangan: z
        .string()
        .min(0, { message: "Keterangan wajib diisi" })
});

type FormSchemaType = z.infer<typeof formSchema>;

const EditProdusenEceran = () => {
    interface Response {
        status: number;
        message: string;
        data: Data;
    }

    interface Data {
        id: number;
        kepangProdusenEceranId: number;
        kepangMasterKomoditasId: number;
        satuan: string;
        harga: number;
        keterangan: string;
        createdAt: string;
        updatedAt: string;
        kepangProdusenEceran: KepangProdusenEceran;
        komoditas: Komoditas;
    }

    interface KepangProdusenEceran {
        id: number;
        tanggal: string;
        createdAt: string;
        updatedAt: string;
    }

    interface Komoditas {
        id: number;
        nama: string;
        createdAt: string;
        updatedAt: string;
    }

    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    const { data: dataKomoditas, error } = useSWR<Response>(
        `/kepang/produsen-eceran/get/${id}`,
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

    useEffect(() => {
        if (dataKomoditas) {
            setValue("satuan", dataKomoditas?.data?.satuan);
            setValue("harga", dataKomoditas.data.harga);
            setValue("keterangan", dataKomoditas.data.keterangan);
        }
    }, [dataKomoditas, setValue]);

    const [loading, setLoading] = useState(false);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        try {
            await axiosPrivate.put(`kepang/produsen-eceran/update/${id}`, data);
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
            console.log("Success to update data produsen dan eceran:", data);
            navigate.push('/ketahanan-pangan/produsen-dan-eceran');
            reset();
        } catch (error) {
            console.error('Failed to update data:', error);
        }
        mutate(`/kepang/produsen-eceran/get`);
    };

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-3 md:mb-5">Edit Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="wrap-form flex-col gap-2">
                    <div className="">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5 text-xs lg">
                            <div className="flex flex-col w-full">
                                <Label className='text-xs lg:text-sm mb-1' label="Komoditas" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan Komoditas"
                                    disabled={true}
                                    value={dataKomoditas?.data?.komoditas?.nama || ''}
                                />
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-xs lg:text-sm mb-1' label="Tanggal" />
                                <Input
                                    type="text"
                                    placeholder="Tahun"
                                    disabled={true}
                                    value={formatDate(dataKomoditas?.data?.createdAt) || ''}
                                    className='text-xs md:text-sm block'
                                />
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-xs lg:text-sm mb-1' label="Satuan" />
                                <Input
                                    type="text"
                                    placeholder="Masukkan Satuan"
                                    {...register('satuan')}
                                    className={`${errors.satuan ? 'border-red-500' : 'py-5 text-xs lg:text-sm'}`}
                                />
                                {errors.satuan && (
                                    <HelperError>{errors.satuan.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-xs lg:text-sm mb-1' label="Harga Komoditas ( Rp / Kg)" />
                                <Input
                                    type="number"
                                    placeholder="Masukkan Harga Komoditas ( Rp / Kg)"
                                    {...register('harga')}
                                    className={`${errors.harga ? 'border-red-500' : 'py-5 text-xs lg:text-sm'}`}
                                />
                                {errors.harga && (
                                    <HelperError>{errors.harga.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-xs lg:text-sm mb-1' label="Keterangan" />
                                <Textarea  {...register('keterangan')}
                                    className={`${errors.keterangan ? 'border-red-500' : 'py-5 text-xs lg:text-sm'}`}
                                />
                                {errors.keterangan && (
                                    <HelperError>{errors.keterangan.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-10 mt-3 flex justify-end gap-3">
                    <Link href="/ketahanan-pangan/produsen-dan-eceran" className='bg-white w-[120px] text-xs md:text-sm  rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium flex justify-center items-center transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300 text-xs lg:text-sm">
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

export default EditProdusenEceran