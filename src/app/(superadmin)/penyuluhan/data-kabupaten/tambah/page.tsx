"use client"
import Label from '@/components/ui/label'
import React from 'react'
import { Input } from '@/components/ui/input'

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';

import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
    {
        value: "kecamatan1",
        label: "kecamatan1",
    },
    {
        value: "kecamatan2",
        label: "kecamatan2",
    },
    {
        value: "kedacamatan3",
        label: "kedacamatan3",
    },
    {
        value: "kecamatan4",
        label: "kecamatan4",
    },
    {
        value: "kecamatan5",
        label: "kecamatan5",
    },
]

const formSchema = z.object({
    namaKecamatan: z
        .string()
        .min(1, { message: "Nama Kecamatan wajib diisi" }),
    namaPenyuluh: z
        .string()
        .min(1, { message: "NIP wajib diisi" }),
    nip: z
        .string()
        .min(1, { message: "Tempat Lahir wajib diisi" }),
    pangkat: z
        .string()
        .min(1, { message: "Tanggal Lahir wajib diisi" }),
    golongan: z
        .string()
        .min(1, { message: "Tanggal Lahir wajib diisi" }),
    wilayahDesaBinaan: z
        .string()
        .min(1, { message: "Pangkat/Gol Ruang wajib diisi" }),
    keterangan: z
        .string()
        .min(1, { message: "TMT Pangkat wajib diisi" })
});

type FormSchemaType = z.infer<typeof formSchema>;

const TamabahPegawaiPage = () => {
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

    const [open, setOpen] = React.useState(false)
    const [value, setValueSelect] = React.useState("")

    return (
        <>
            <div className="text-primary text-2xl font-bold mb-5">Tambah Data</div>
            {/* Nama NIP Tempat Tanggal Lahir */}
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nama Kecamatan" />
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={`w-full justify-between flex h-10 items-center rounded-full border border-primary bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${errors.namaKecamatan ? 'border-red-500' : ''}`}
                                    >
                                        {value
                                            ? frameworks.find((framework) => framework.value === value)?.label
                                            : "Pilih Kecamatan"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Cari Kecamatan" />
                                        <CommandList>
                                            <CommandEmpty>No framework found.</CommandEmpty>
                                            <CommandGroup>
                                                {frameworks.map((framework) => (
                                                    <CommandItem
                                                        key={framework.value}
                                                        value={framework.value}
                                                        onSelect={(currentValue) => {
                                                            setValue("namaKecamatan", currentValue === value ? "" : currentValue, { shouldValidate: true });
                                                            setValueSelect(currentValue === value ? "" : currentValue);
                                                            setOpen(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                value === framework.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {framework.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                                {errors.namaKecamatan && (
                                    <HelperError>{errors.namaKecamatan.message}</HelperError>
                                )}
                            </Popover>
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Wilayah Desa Binaan" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Wilayah Desa Binaan"
                                {...register('namaPenyuluh')}
                                className={`${errors.namaPenyuluh ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.namaPenyuluh && (
                                <HelperError>{errors.namaPenyuluh.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nama" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Nama"
                                {...register('namaPenyuluh')}
                                className={`${errors.namaPenyuluh ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.namaPenyuluh && (
                                <HelperError>{errors.namaPenyuluh.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="NIP" />
                            <Input
                                autoFocus
                                type="number"
                                placeholder="NIP"
                                {...register('nip')}
                                className={`${errors.nip ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.nip && (
                                <HelperError>{errors.nip.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pangkat" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Pangkat"
                                {...register('pangkat')}
                                className={`${errors.pangkat ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.pangkat && (
                                <HelperError>{errors.pangkat.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Golongan" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Golongan"
                                {...register('golongan')}
                                className={`${errors.golongan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.golongan && (
                                <HelperError>{errors.golongan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pangkat/Gol Ruang Tmt Pangkat */}
                <div className="mb-2">
                    {/* <div className="text-primary text-lg font-bold mb-2">Pangkat / Gol, Ruang, TMT Pangkat</div> */}
                    <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Wilayah Desa Binaan" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Wilayah Desa Binaan"
                                {...register('wilayahDesaBinaan')}
                                className={`${errors.wilayahDesaBinaan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.wilayahDesaBinaan && (
                                <HelperError>{errors.wilayahDesaBinaan.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Keterangan" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Keterangan"
                                {...register('keterangan')}
                                className={`${errors.keterangan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.keterangan && (
                                <HelperError>{errors.keterangan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 text-center">
                    <Button type="submit" variant="primary" size="lg" className="w-[40%]">
                        Tambah
                    </Button>
                </div>
            </form>
        </>
    )
}

export default TamabahPegawaiPage