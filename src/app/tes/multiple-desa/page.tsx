"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SelectKecamatan from "@/components/superadmin/KecamatanSelect";
import SelectMultipleDesa from "@/components/superadmin/DesaSelect/page";
import useLocalStorage from "@/hooks/useLocalStorage";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSWR, { SWRResponse } from "swr";


// GET ALL KECAMATAN
interface Kecamatan {
    id: number;
    nama: string;
}

interface ResponseKecamatan {
    status: string;
    data: Kecamatan[];
    message: string;
}


// GET ALL DESA
interface Desa {
    id: number;
    nama: string;
    kecamatanId: number;
}

interface ResponseDesa {
    status: string;
    data: Desa[];
    message: string;
}


// Zod schema for validation
const schema = z.object({
    kecamatan: z
        .object({
            id: z.number(),
            nama: z.string(),
        })
        .nullable(), // Allow kecamatan to be null
    desa: z
        .array(
            z.object({
                id: z.number(),
                nama: z.string(),
                kecamatanId: z.number(),
            })
        )
        .min(1, "Please select at least one desa."),
});

type FormData = z.infer<typeof schema>;

const HomePage: React.FC = () => {
    // kecamatan
    const [accessToken] = useLocalStorage("accessToken", "");
    const axiosPrivate = useAxiosPrivate();

    const { data: dataKecamatan, error: errorKecamatan } = useSWR<ResponseKecamatan>(
        `kecamatan/get`,
        (url: string) =>
            axiosPrivate
                .get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                .then((res: any) => res.data)
    );
    // kecamatan

    // desa
    
const { data: dataDesa, error: errorDesa } = useSWR<ResponseDesa>(
    `desa/get`,
    (url: string) =>
        axiosPrivate
            .get(url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then((res: any) => res.data)
);
    // desa
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            kecamatan: null, // Explicitly set to null
            desa: [],
        },
    });

    const selectedKecamatan = watch("kecamatan"); // Watch selected kecamatan

    const onSubmit = (data: FormData) => {
        // Format the data to match the API structure
        const formattedData = {
            kecamatan_id: data.kecamatan?.id ?? 0,
            desa_list: data.desa.map((desa) => desa.id),
        };

        console.log("Formatted Data for API:", formattedData);
        // Submit the formatted data to the API
    };

    if (errorKecamatan) return <p>Error fetching kecamatan data.</p>;
    if (errorDesa) return <p>Error fetching desa data.</p>;
    if (!dataKecamatan || !dataDesa) return <p>Loading...</p>;

    // Filter desa options based on the selected kecamatan
    const filteredDesaOptions = selectedKecamatan
        ? dataDesa.data.filter((desa) => desa.kecamatanId === selectedKecamatan.id)
        : [];

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Pilih Kecamatan dan Desa</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Kecamatan Select */}
                <Controller
                    name="kecamatan"
                    control={control}
                    render={({ field }) => (
                        <SelectKecamatan
                            kecamatanOptions={dataKecamatan.data}
                            selectedKecamatan={field.value || null} // Ensure value can be null
                            onChange={(kecamatan) => field.onChange(kecamatan)}
                        />
                    )}
                />
                {errors.kecamatan && (
                    <p className="text-red-500 text-sm">{errors.kecamatan.message}</p>
                )}

                {/* Desa Select */}
                <div className="mt-4">
                    <Controller
                        name="desa"
                        control={control}
                        render={({ field }) => (
                            <SelectMultipleDesa
                                desaOptions={filteredDesaOptions}
                                selectedDesa={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.desa && (
                        <p className="text-red-500 text-sm">{errors.desa.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default HomePage;
