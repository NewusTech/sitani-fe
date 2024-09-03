"use client"
import Label from '@/components/ui/label'
import React from 'react'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HelperError from '@/components/ui/HelperError';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter } from 'next/navigation';
import { SWRResponse, mutate } from "swr";
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
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const frameworks = [
    { label: 'Kecamatan A', value: "1" },
    { label: 'Kecamatan B', value: "2" },
    { label: 'Kecamatan C', value: "3" },
    { label: 'Kecamatan D', value: "4" },
]

const OPTIONS: Option[] = [
    { label: 'Desa A', value: "1" },
    { label: 'Desa B', value: "2" },
    { label: 'Desa C', value: "3" },
    { label: 'Desa D', value: "4" },
];

const formSchema = z.object({
    kecamatan_id: z
        .preprocess((val) => val !== undefined ? Number(val) : undefined, z.number().optional())
        .refine((val) => val === undefined || val > 0, { message: "Nama Kecamatan wajib diisi" }),
    desa_list: z
        .array(z.preprocess((val) => Number(val), z.number()))
        .min(1, { message: "Wilayah Desa Binaan wajib diisi" }).optional(),
    nama: z
        .string()
        .min(1, { message: "Nama wajib diisi" }),
    nip: z.
        preprocess((val) => Number(val), z.number().min(1, { message: "NIP wajib diisi" })),
    pangkat: z
        .string()
        .min(1, { message: "Pangkat wajib diisi" }),
    golongan: z
        .string()
        .min(1, { message: "Golongan wajib diisi" }),
    keterangan: z
        .string()
        .min(1, { message: "Keterangan wajib diisi" })
});

type FormSchemaType = z.infer<typeof formSchema>;

const TamabahPenyuluhDataKecamatan = () => {
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

    const handleSelectorChange = (selectedOptions: Option[]) => {
        setValue('desa_list', selectedOptions.map(option => Number(option.value)));
    };

    // const onSubmit = (data: FormSchemaType) => {
    //     console.log(data);
    //     // reset();
    // };

    // TAMBAH
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        try {
            await axiosPrivate.post("/penyuluh-kecamatan/create", data);
            console.log(data)
            // push
            navigate.push('/penyuluhan/data-kecamatan');
            console.log("Success to create user:");
            reset()
        } catch (e: any) {
            console.log(data)
            console.log("Failed to create penyuluh:");
            return;
        }
        mutate(`/penyuluh-kecamatan/get`);
    };

    const [open, setOpen] = React.useState(false)
    const [value, setValueSelect] = React.useState("")

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-2">
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Pilih Kecamatan" />
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className={`w-full justify-between flex h-10 items-center rounded-full border border-primary bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${errors.kecamatan_id ? 'border-red-500' : ''}`}
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
                                            <CommandEmpty>Maaf, Kecamatan <br /> tidak tersedia.</CommandEmpty>
                                            <CommandGroup>
                                                {frameworks.map((framework) => (
                                                    <CommandItem
                                                        key={framework.value}
                                                        value={framework.value}
                                                        onSelect={(currentValue) => {
                                                            const selectedValue = currentValue === value ? undefined : Number(currentValue);
                                                            // Set kecamatan_id with number or undefined
                                                            setValue("kecamatan_id", selectedValue, { shouldValidate: true });
                                                            // Set valueSelect with string or empty string
                                                            setValueSelect(selectedValue !== undefined ? String(selectedValue) : "");

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
                                {errors.kecamatan_id && (
                                    <HelperError>{errors.kecamatan_id.message}</HelperError>
                                )}
                            </Popover>
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Wilayah Desa Binaan" />
                            <MultipleSelector
                                className={`w-[98%] justify-between flex h-10 items-center rounded-full border border-primary bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${errors.desa_list ? 'border-red-500' : ''}`}
                                defaultOptions={OPTIONS}
                                placeholder="Cari Desa"
                                onChange={handleSelectorChange}
                                emptyIndicator={
                                    <p className="text-center text-lg leading-10 text-gray-600">
                                        Tidak ada data.
                                    </p>
                                }
                            />
                            {errors.desa_list && (
                                <HelperError>{errors.desa_list.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Nama" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Nama"
                                {...register('nama')}
                                className={`${errors.nama ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.nama && (
                                <HelperError>{errors.nama.message}</HelperError>
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
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
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

                <div className="mb-2">
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Keterangan" />
                            <Textarea  {...register('keterangan')}
                                className={`${errors.keterangan ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.keterangan && (
                                <HelperError>{errors.keterangan.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/penyuluhan/data-kecamatan" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
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

export default TamabahPenyuluhDataKecamatan