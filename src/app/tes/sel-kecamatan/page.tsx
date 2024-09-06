"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import KecamatanSelect from "@/components/superadmin/SelectComponent/SelectKecamatan";

// Zod schema for validation
const formSchema = z.object({
    instansi: z
        .string()
        .nonempty("Instansi is required")
        .transform((value) => ({ id: value })), // Transform the selected value into an object containing the ID
});

// Define the form input types
type FormValues = z.infer<typeof formSchema>;

// Dummy data for the component
// const dummyResults = [
//     { id: "1", name: "Instansi A" },
//     { id: "2", name: "Instansi B" },
//     { id: "3", name: "Instansi C" },
// ];

const FormWithInstansiSelect = () => {
    // Initialize the form
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: FormValues) => {
        console.log("Selected Instansi ID:", data.instansi.id);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="instansi"
                control={control}
                render={({ field }) => (
                    <KecamatanSelect
                        // items={dummyResults}
                        label="Instansi"
                        placeholder="Pilih Instansi"
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                    />
                )}
            />
            {errors.instansi && (
                <p className="text-red-500">{errors.instansi.message}</p>
            )}
            <button
                type="submit"
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
                Submit
            </button>
        </form>
    );
};

export default FormWithInstansiSelect;
