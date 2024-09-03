"use client"
import Label from '@/components/ui/label'
import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import { watch } from 'fs';

// Format tanggal yang diinginkan (yyyy-mm-dd)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

const formSchema = z.object({
    kecamatan_id: z.number(),
    desa_id: z.number(),
    jenis_bantuan: z.string().min(1, { message: "Nama wajib diisi" }),
    periode: z.preprocess(
        (val) => typeof val === "string" ? formatDate(val) : val,
        z.string().min(1, { message: "Periode Penerimaan wajib diisi" })
    ),
    keterangan: z.string().min(1, { message: "Keterangan wajib diisi" }),
});

type FormSchemaType = z.infer<typeof formSchema>;

const BantuanEdit = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    interface Kecamatan {
        nama: string;
    }
    interface Desa {
        nama: string;
    }
    interface Bantuan {
        kecamatan: Kecamatan;
        kecamatanId: number;
        desaId: number;
        periode: string;
        jenisBantuan: string;
        keterangan: string;
    }

    interface Response {
        status: string;
        data: Bantuan;
        message: string;
    }

    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;

    const { data: dataBantuan, error } = useSWR<Response>(
        `psp/bantuan/get/${id}`,
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
        if (dataBantuan) {
            const formattedPeriode = new Date(dataBantuan.data.periode).toISOString().split('T')[0];
            setValue("periode", formattedPeriode);
            setValue("keterangan", dataBantuan.data.keterangan);
            setValue("jenis_bantuan", dataBantuan.data.jenisBantuan);
            setValue("kecamatan_id", (dataBantuan.data.kecamatanId));
            setValue("desa_id", (dataBantuan.data.desaId));
        }
    }, [dataBantuan, setValue]);

    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        try {
            await axiosPrivate.put(`psp/bantuan/update/${id}`, data);
            console.log("Success to update user:", data);
            navigate.push('/psp/bantuan');
            reset();
        } catch (error) {
            console.error('Failed to update user:', error);
        }
        mutate(`/psp/bantuan/get?page=1`);
    };

    // const onSubmit = (data: FormSchemaType) => {
    //     console.log(data);
    // };
 

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Edit Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Kecamatan" />
                            <Select
                                onValueChange={(value) => setValue("kecamatan_id", Number(value))}
                                value={String(watch('kecamatan_id')) || ''}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Kecamatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Kecamatan 1</SelectItem>
                                    <SelectItem value="2">Kecamatan 2</SelectItem>
                                    <SelectItem value="3">Kecamatan 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Desa" />
                            <Select
                                onValueChange={(value) => setValue("desa_id", Number(value))}
                                value={String(watch('desa_id')) || ''}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Desa" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Desa 1</SelectItem>
                                    <SelectItem value="2">Desa 2</SelectItem>
                                    <SelectItem value="3">Desa 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Jenis Bantuan" />
                            <Input
                                type="text"
                                placeholder="Jenis Bantuan"
                                {...register('jenis_bantuan')}
                                className={`${errors.jenis_bantuan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.jenis_bantuan && (
                                <HelperError>{errors.jenis_bantuan.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Periode Penerimaan" />
                            <Input
                                type="date"
                                placeholder="Periode Penerimaan"
                                {...register('periode')}
                                className={`${errors.periode ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.periode && (
                                <HelperError>{errors.periode.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Keterangan" />
                            <Textarea
                                {...register('keterangan')}
                                className={`${errors.keterangan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.keterangan && (
                                <HelperError>{errors.keterangan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/psp/bantuan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        Simpan
                    </Button>
                </div>
            </form>
        </>
    )
}

export default BantuanEdit
