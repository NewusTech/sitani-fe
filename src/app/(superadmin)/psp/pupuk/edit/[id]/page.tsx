"use client"
import Label from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Textarea } from "@/components/ui/textarea";
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import { watch } from 'fs';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Loading from '@/components/ui/Loading';

const OPTIONS: Option[] = [
    { label: 'nextjs', value: 'nextjs' },
    { label: 'React', value: 'react' },
    { label: 'Remix', value: 'remix' },
    { label: 'Vite', value: 'vite' },
    { label: 'Nuxt', value: 'nuxt' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Angular', value: 'angular' },
    { label: 'Ember', value: 'ember', disable: true },
    { label: 'Gatsby', value: 'gatsby', disable: true },
    { label: 'Astro', value: 'astro' },
];

const formSchema = z.object({
    jenis_pupuk: z
        .string()
        .min(1, { message: "Jenis Pupuk wajib diisi" }),
    kandungan_pupuk: z
        .string(),
    keterangan: z
        .string()
        .min(1, { message: "Keterangan wajib diisi" }),
    harga_pupuk: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Harga pupuk wajib diisi" })),
});

type FormSchemaType = z.infer<typeof formSchema>;

interface PSP {
    id: number;
    jenisPupuk: string;
    kandunganPupuk: string;
    keterangan: string;
    hargaPupuk: number;
}

interface Response {
    status: string;
    message: string;
    data: PSP;
}

const PupukTambah = () => {
    const [date, setDate] = React.useState<Date>()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { id } = params;
    const [loading, setLoading] = useState(false);


    const { data: dataPSP, error } = useSWR<Response>(
        `psp/pupuk/get/${id}`,
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
        if (dataPSP) {
            setValue("jenis_pupuk", dataPSP.data.jenisPupuk);
            setValue("kandungan_pupuk", dataPSP.data.kandunganPupuk);
            setValue("keterangan", dataPSP.data.keterangan);
            setValue("harga_pupuk", dataPSP.data.hargaPupuk);
        }
    }, [dataPSP, setValue]);


    // Handle form submission
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted

        try {
            await axiosPrivate.put(`psp/pupuk/update/${id}`, data);
            console.log("Success to update user:", data);
            navigate.push('/psp/pupuk');
            reset();
        } catch (error) {
            console.error('Failed to update user:', error);
        }finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/psp/pupuk/get?page=1`);
    };

    // const onSubmit = (data: FormSchemaType) => {
    //     console.log(data);
    //     reset();
    // };
    console.log(dataPSP);

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Edit Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Jenis Pupuk" />
                            <Select
                                onValueChange={(value) => setValue("jenis_pupuk", String(value))}
                                value={String(watch('jenis_pupuk')) || ''}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Jenis Pupuk" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="select1">Select1</SelectItem>
                                    <SelectItem value="select2">Select2</SelectItem>
                                    <SelectItem value="select3">Select3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Kandungan Pupuk" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Kandungan Pupuk"
                                {...register('kandungan_pupuk')}
                                className={`${errors.kandungan_pupuk ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.kandungan_pupuk && (
                                <HelperError>{errors.kandungan_pupuk.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Keterangan" />
                            <Select
                                onValueChange={(value) => setValue("keterangan", String(value))}
                                value={String(watch('keterangan')) || ''}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Keterangan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="subsidi">Subsidi</SelectItem>
                                    <SelectItem value="nonSubsidi">Non Subsidi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Harga Pupuk/Kg" />
                            <Input
                                autoFocus
                                type="number"
                                placeholder="Harga Pupuk/Kg"
                                {...register('harga_pupuk')}
                                className={`${errors.harga_pupuk ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.harga_pupuk && (
                                <HelperError>{errors.harga_pupuk.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/psp/pupuk" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
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

export default PupukTambah