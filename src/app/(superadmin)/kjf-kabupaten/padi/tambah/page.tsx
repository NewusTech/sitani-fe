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
    lahan: z
        .string()
        .min(1, { message: "Lahian wajib diisi" }).optional(),
    jenisPadi: z
        .string()
        .min(1, { message: "Jenis Padi wajib diisi" }).optional(),
    kategori: z
        .string()
        .min(1, { message: "Kategori wajib diisi" }).optional(),
    sawahIrigasi: z
        .string()
        .min(1, { message: "Sawah Irigasi wajib diisi" }).optional(),
    panen: z
        .string()
        .min(1, { message: "Panen diisi" }).optional(),
    tanam: z
        .string()
        .min(1, { message: "Tanam diisi" }).optional(),
    puso: z
        .string()
        .min(1, { message: "Puso diisi" }).optional(),
    sawahRawaLebak: z
        .string()
        .min(1, { message: "Sawah Rawa Lebak wajib diisi" }).optional(),
    sawahTadahHujanPanen: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),
    sawahTadahHujanTanam: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),
    sawahTadahHujanPuso: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),
    sawahTadahHujanSawahRawaLebak: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),

    sawahRawaPasangSurutPanen: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),
    sawahRawaPasangSurutTanam: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),
    sawahRawaPasangSurutPuso: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),
    sawahRawaPasangSurutSawahRawaLebak: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),

    sawahRawaLebakPanen: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),
    sawahRawaLebakTanam: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),
    sawahRawaLebakPuso: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),
    sawahRawaLebakSawahRawaLebak: z
        .string()
        .min(1, { message: "wajib diisi" }).optional(),
});

type FormSchemaType = z.infer<typeof formSchema>;

const TambahDataPadi = () => {
    const [date, setDate] = React.useState<Date>()
    const [valueSelect, setValueSelectt] = React.useState(""); // Untuk menyimpan nilai jenis padi

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
            navigate.push('/korlub/padi');
            console.log("Success to create Padi:");
            reset()
        } catch (e: any) {
            console.log(data)
            console.log("Failed to create Padi:");
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
                                <Label className='text-sm mb-1' label="Pilih Lahan" />
                                <Select
                                    onValueChange={(value) => setValue("lahan", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Lahan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lahanSawah">Lahan Sawah</SelectItem>
                                        <SelectItem value="lahanBukanSawah">Lahan Bukan Sawah</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Pilih Jenis Padi" />
                                <Select
                                    onValueChange={(value) => {
                                        setValue("jenisPadi", value);
                                        setValueSelectt(value); // Simpan nilai jenis padi
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih Jenis Padi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hibrida">hibrida</SelectItem>
                                        <SelectItem value="unggul">unggul</SelectItem>
                                        <SelectItem value="lokal">lokal</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.jenisPadi && (
                                    <HelperError>{errors.jenisPadi.message}</HelperError>
                                )}
                            </div>
                        </div>

                        {(valueSelect === 'hibrida' || valueSelect === 'unggul') && (
                            <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                                <div className="flex flex-col mb-2 w-full">
                                    <Label className='text-sm mb-1' label="Pilih Kategori" />
                                    <Select
                                        onValueChange={(value) => setValue("kategori", value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kategori1">Kategori 1</SelectItem>
                                            <SelectItem value="kategori2">Kategori 2</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.kategori && (
                                        <HelperError>{errors.kategori.message}</HelperError>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Sawah Irigasi" />
                                <Input
                                    autoFocus
                                    type="text"
                                    placeholder="Sawah Irigasi"
                                    {...register('sawahIrigasi')}
                                    className={`${errors.sawahIrigasi ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.sawahIrigasi && (
                                    <HelperError>{errors.sawahIrigasi.message}</HelperError>
                                )}
                            </div>
                        </div>

                        <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Panen" />
                                <Input
                                    autoFocus
                                    type="text"
                                    placeholder="Panen"
                                    {...register('panen')}
                                    className={`${errors.panen ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.panen && (
                                    <HelperError>{errors.panen.message}</HelperError>
                                )}
                            </div>
                            <div className="flex flex-col mb-2 w-full">
                                <Label className='text-sm mb-1' label="Tanam" />
                                <Input
                                    autoFocus
                                    type="text"
                                    placeholder="Tanam"
                                    {...register('tanam')}
                                    className={`${errors.tanam ? 'border-red-500' : 'py-5 text-sm'}`}
                                />
                                {errors.tanam && (
                                    <HelperError>{errors.tanam.message}</HelperError>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Puso"
                                {...register('puso')}
                                className={`${errors.puso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.puso && (
                                <HelperError>{errors.puso.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Sawah Rawa Lebak" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Sawah Rawa Lebak"
                                {...register('sawahRawaLebak')}
                                className={`${errors.sawahRawaLebak ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahRawaLebak && (
                                <HelperError>{errors.sawahRawaLebak.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className='mb-5'>
                    <div className="text-primary text-lg font-bold mb-2">Sawah Tadah Hujan</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Panen"
                                {...register('sawahTadahHujanPanen')}
                                className={`${errors.sawahTadahHujanPanen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahTadahHujanPanen && (
                                <HelperError>{errors.sawahTadahHujanPanen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Tanam"
                                {...register('sawahTadahHujanTanam')}
                                className={`${errors.sawahTadahHujanTanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahTadahHujanTanam && (
                                <HelperError>{errors.sawahTadahHujanTanam.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Puso"
                                {...register('sawahTadahHujanPuso')}
                                className={`${errors.sawahTadahHujanPuso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahTadahHujanPuso && (
                                <HelperError>{errors.sawahTadahHujanPuso.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Sawah Rawa Lebak" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Sawah Rawa Lebak"
                                {...register('sawahTadahHujanSawahRawaLebak')}
                                className={`${errors.sawahTadahHujanSawahRawaLebak ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahTadahHujanSawahRawaLebak && (
                                <HelperError>{errors.sawahTadahHujanSawahRawaLebak.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className='mb-5'>
                    <div className="text-primary text-lg font-bold mb-2">Sawah Rawa Pasang Surut</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Panen"
                                {...register('sawahRawaPasangSurutPanen')}
                                className={`${errors.sawahRawaPasangSurutPanen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahRawaPasangSurutPanen && (
                                <HelperError>{errors.sawahRawaPasangSurutPanen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Tanam"
                                {...register('sawahRawaPasangSurutTanam')}
                                className={`${errors.sawahRawaPasangSurutTanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahRawaPasangSurutTanam && (
                                <HelperError>{errors.sawahRawaPasangSurutTanam.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Puso"
                                {...register('sawahRawaPasangSurutPuso')}
                                className={`${errors.sawahRawaPasangSurutPuso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahRawaPasangSurutPuso && (
                                <HelperError>{errors.sawahRawaPasangSurutPuso.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Sawah Rawa Lebak" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Sawah Rawa Lebak"
                                {...register('sawahRawaPasangSurutSawahRawaLebak')}
                                className={`${errors.sawahRawaPasangSurutSawahRawaLebak ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahRawaPasangSurutSawahRawaLebak && (
                                <HelperError>{errors.sawahRawaPasangSurutSawahRawaLebak.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className='mb-5'>
                    <div className="text-primary text-lg font-bold mb-2">Sawah Rawa Lebak</div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Panen" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Panen"
                                {...register('sawahRawaLebakPanen')}
                                className={`${errors.sawahRawaLebakPanen ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahRawaLebakPanen && (
                                <HelperError>{errors.sawahRawaLebakPanen.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Tanam" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Tanam"
                                {...register('sawahRawaLebakTanam')}
                                className={`${errors.sawahRawaLebakTanam ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahRawaLebakTanam && (
                                <HelperError>{errors.sawahRawaLebakTanam.message}</HelperError>
                            )}
                        </div>
                    </div>
                    <div className="flex md:flex-row flex-col justify-between gap-2 md:lg-3 lg:gap-5">
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Puso" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Puso"
                                {...register('sawahRawaLebakPuso')}
                                className={`${errors.sawahRawaLebakPuso ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahRawaLebakPuso && (
                                <HelperError>{errors.sawahRawaLebakPuso.message}</HelperError>
                            )}
                        </div>
                        <div className="flex flex-col mb-2 w-full">
                            <Label className='text-sm mb-1' label="Sawah Rawa Lebak" />
                            <Input
                                autoFocus
                                type="text"
                                placeholder="Sawah Rawa Lebak"
                                {...register('sawahRawaLebakSawahRawaLebak')}
                                className={`${errors.sawahRawaLebakSawahRawaLebak ? 'border-red-500' : 'py-5 text-sm'}`}
                            />
                            {errors.sawahRawaLebakSawahRawaLebak && (
                                <HelperError>{errors.sawahRawaLebakSawahRawaLebak.message}</HelperError>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-10 flex justify-end gap-3">
                    <Link href="/kjf-kabupaten/padi" className='bg-white w-[120px] rounded-full text-primary hover:bg-slate-50 p-2 border border-primary text-center font-medium'>
                        Batal
                    </Link>
                    <Button type="submit" variant="primary" size="lg" className="w-[120px]">
                        Ssimpan
                    </Button>
                </div>
            </form>
        </>
    )
}

export default TambahDataPadi