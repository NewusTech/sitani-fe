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

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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
    namaKecamatan: z
        .string()
        .min(1, { message: "Nama Kecamatan wajib diisi" }).optional(),
    namaDesa: z
        .array(z.string())
        .min(1, { message: "Desa wajib diisi" }).optional(),
    namaTanaman: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
    hasilProduksi: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
    hasilDibongkar: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
    belumHabis: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
    luasRusak: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
    luasPenanamanBaru: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
    dipanenHabis: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
    produksiBelumHabis: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
    rataRataHargaJual: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
    keterangan: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahDataPadi = () => {
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
        setValue('namaDesa', selectedOptions.map(option => option.value));
    };

    // TAMBAH
    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        try {
            await axiosPrivate.post("/", data);
            console.log(data)
            // push
            navigate.push('/korlub/palawija');
            console.log("Success to create Sayuran Buah:");
            reset()
        } catch (e: any) {
            console.log(data)
            console.log("Failed to create Sayuran Buah:");
            return;
        }
        mutate(`/user/get`);
    };

    const [open, setOpen] = React.useState(false)
    const [value, setValueSelect] = React.useState("")

    return (
        <>
            <div className="text-primary text-xl md:text-2xl font-bold mb-5">Tambah Data</div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="mb-5">
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
                                                <CommandEmpty>Maaf, Kecamatan <br /> tidak tersedia.</CommandEmpty>
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
                                <Label className='text-sm mb-1' label="Pilih Desa" />
                                <MultipleSelector
                                    className={`w-[98%] justify-between flex h-10 items-center rounded-full border border-primary bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${errors.namaDesa ? 'border-red-500' : ''}`}
                                    defaultOptions={OPTIONS}
                                    placeholder="Cari Desa"
                                    onChange={handleSelectorChange}
                                    emptyIndicator={
                                        <p className="text-center text-lg leading-10 text-gray-600">
                                            Tidak ada data.
                                        </p>
                                    }
                                />
                                {errors.namaDesa && (
                                    <HelperError>{errors.namaDesa.message}</HelperError>
                                )}
                            </div>
                        </div>
                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Nama Tanaman" />
                                <Input
                                    autoFocus
                                    type="text"
                                    placeholder="Hasil / Dibongkar"
                                    {...register('namaTanaman')}
                                    className={`${errors.namaTanaman ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.namaTanaman && (
                                    <HelperError>{errors.namaTanaman.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Hasil Produksi" />
                                <Select
                                    onValueChange={(value) => setValue("hasilProduksi", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Hasil Produksi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hibrida">hibrida</SelectItem>
                                        <SelectItem value="unggul">unggul</SelectItem>
                                        <SelectItem value="lokal">lokal</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.hasilProduksi && (
                                    <HelperError>{errors.hasilProduksi.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mb-5'>
                    <div className="text-primary text-lg font-bold mb-2">Luas Panen (Hektar)</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Hasil / Dibongkar" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Hasil / Dibongkar"
                                {...register('hasilDibongkar')}
                                className={`${errors.hasilDibongkar ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.hasilDibongkar && (
                                <HelperError>{errors.hasilDibongkar.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Belum Habis" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Belum Habis"
                                {...register('belumHabis')}
                                className={`${errors.belumHabis ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.belumHabis && (
                                <HelperError>{errors.belumHabis.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Luas Rusak / Tidak Berhasil / Puso (Hektar)" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Luas Rusak / Tidak Berhasil / Puso (Hektar)"
                                {...register('luasRusak')}
                                className={`${errors.luasRusak ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.luasRusak && (
                                <HelperError>{errors.luasRusak.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Luas Penanaman Baru / Tambah (hektar)" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Luas Penanaman Baru / Tambah (hektar)"
                                {...register('luasPenanamanBaru')}
                                className={`${errors.luasPenanamanBaru ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.luasPenanamanBaru && (
                                <HelperError>{errors.luasPenanamanBaru.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className='mb-5'>
                    <div className="text-primary text-lg font-bold mb-2">Produksi (Kuintal)</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Dipanen Habis / Dibongkar" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Dipanen Habis / Dibongkar"
                                {...register('dipanenHabis')}
                                className={`${errors.dipanenHabis ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.dipanenHabis && (
                                <HelperError>{errors.dipanenHabis.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Belum Habis" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Belum Habis"
                                {...register('produksiBelumHabis')}
                                className={`${errors.produksiBelumHabis ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.produksiBelumHabis && (
                                <HelperError>{errors.produksiBelumHabis.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Rata-rata Harga Jual di Petani Per Kilogram (Rupiah)"
                                {...register('rataRataHargaJual')}
                                className={`${errors.rataRataHargaJual ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.rataRataHargaJual && (
                                <HelperError>{errors.rataRataHargaJual.message}</HelperError>
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

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/korlub/palawija" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        BATAL
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        SIMPAN
                    </Button>
                </div>
            </form>
        </>
    )
}

export default TambahDataPadi