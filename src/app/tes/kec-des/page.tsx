"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import KecValue from "@/components/superadmin/SelectComponent/KecamatanValue";
import DesaValue from "@/components/superadmin/SelectComponent/DesaValue";

// Dummy Data
// const kecamatanItems = [
//     { id: "1", nama: "Metro Kibang" },
//     { id: "2", nama: "Batanghari" },
//     { id: "3", nama: "Sekampung" },
// ];

// const desaItems = [
//     { id: "1", nama: "Sumber Agung", kecamatanId: "1" },
//     { id: "2", nama: "Purbo Sembodo", kecamatanId: "1" },
//     { id: "3", nama: "Desa C", kecamatanId: "2" },
// ];

const schema = z.object({
    kecamatan: z.string().min(1, "Kecamatan is required"),
    desa: z.string().min(1, "Desa is required"),
});

type FormValues = z.infer<typeof schema>;

const SelectKecamatanDesa: React.FC = () => {
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            kecamatan: "",
            desa: "",
        },
    });

    const kecamatanValue = watch("kecamatan");

    // const filteredDesaItems = desaItems.filter(
    //     (desa) => desa.kecamatanId === kecamatanValue
    // );

    const onSubmit = (data: FormValues) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="kecamatan"
                control={control}
                render={({ field }) => (
                    <KecValue
                        // kecamatanItems={kecamatanItems}
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
            {errors.kecamatan && (
                <p className="text-red-500 mt-1">{errors.kecamatan.message}</p>
            )}

            <Controller
                name="desa"
                control={control}
                render={({ field }) => (
                    <DesaValue
                        // desaItems={filteredDesaItems}
                        value={field.value}
                        onChange={field.onChange}
                        kecamatanValue={kecamatanValue}
                    />
                )}
            />
            {errors.desa && (
                <p className="text-red-500 mt-1">{errors.desa.message}</p>
            )}
            <button type="submit" className="px-6 py-2 rounded-full mt-2 bg-purple-600 text-white">Submit</button>
        </form>
    );
};

export default SelectKecamatanDesa;
