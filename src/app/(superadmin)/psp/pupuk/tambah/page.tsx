"use client"
import Label from '@/components/ui/label'
import React from 'react'
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
import { useRouter } from 'next/navigation';
import { SWRResponse, mutate } from "swr";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
        .string(),
    kandungan_pupuk: z
        .string(),
    keterangan: z
        .string()
        .min(1, { message: "Keterangan wajib diisi" }),
    harga_pupuk: z
        .preprocess((val) => Number(val), z.number().min(1, { message: "Harga pupuk wajib diisi" })),
});

type FormSchemaType = z.infer<typeof formSchema>;

const PupukTambah = () => {
    const [date, setDate] = React.useState<Date>()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue
    } = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
    });

    // const onSubmit = (data: FormSchemaType) => {
    //     console.log(data);
    //     reset();
    // };

    // TAMBAH
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        try {
            await axiosPrivate.post("/psp/pupuk/create", data);
            console.log(data)
            // push
            navigate.push('/psp/pupuk');
            console.log("Success to create user:");
            reset()
        } catch (e: any) {
            console.log(data)
            console.log("Failed to create user:");
            return;
        }
        mutate(`/psp/pupuk/get?page=1&limit=10&search&startDate=&endDate`);
    };
    // TAMBAH

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="pilih Jenis Pupuk" />
                            <Select
                                onValueChange={(value) => setValue("jenis_pupuk", value)}
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
                                onValueChange={(value) => setValue("keterangan", value)}
                            >
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
                        Simpan
                    </Button>
                </div>
            </form>
        </>
    )
}

export default PupukTambah