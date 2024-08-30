"use client"
import Label from '@/components/ui/label'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Textarea } from "@/components/ui/textarea";

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
    jenisPupuk: z
        .string(),
    kandunganPupuk: z
        .string(),
    keterangan: z
        .string()
        .min(1, { message: "Keterangan wajib diisi" }),
    hargaPupuk: z
        .string()
        .min(1, { message: "Harga Pupuk wajib diisi" }),
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

    const onSubmit = (data: FormSchemaType) => {
        console.log(data);
        reset();
    };

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="pilih Jenis Pupuk" />
                            <Select
                                onValueChange={(value) => setValue("jenisPupuk", value)}
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
                            <Select
                                onValueChange={(value) => setValue("kandunganPupuk", value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih kandungan Pupuk" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="select1">Select1</SelectItem>
                                    <SelectItem value="select2">Select2</SelectItem>
                                    <SelectItem value="select3">Select3</SelectItem>
                                </SelectContent>
                            </Select>
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
                                {...register('hargaPupuk')}
                                className={`${errors.hargaPupuk ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.hargaPupuk && (
                                <HelperError>{errors.hargaPupuk.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        SIMPAN
                    </Button>
                    <Link href="/penyuluhan/data-kabupaten" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        BATAL
                    </Link>
                </div>
            </form>
        </>
    )
}

export default PupukTambah