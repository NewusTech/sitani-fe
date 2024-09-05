"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputComponent from "@/components/ui/InputKecDesa";

// Validation schemas
const schema = z.object({
  selectedKecamatan: z.string().nonempty("Kecamatan is required"),
  selectedDesa: z.string().nonempty("Desa is required"),
});

type FormData = z.infer<typeof schema>;

const PageComponent = () => {
  const [dummyKecamatan] = useState([
    { id: 1, nama: "Metro Kibang" },
    { id: 2, nama: "Batanghari" },
    { id: 3, nama: "Sekampung" },
    { id: 4, nama: "Margatiga" },
  ]);

  const [dummyDesa] = useState([
    { id: 1, nama: "Sumber Agung", kecamatanId: 1 },
    { id: 2, nama: "Purbo Sembodo", kecamatanId: 1 },
    { id: 3, nama: "Kibang", kecamatanId: 1 },
    { id: 4, nama: "Desa A", kecamatanId: 2 },
    { id: 5, nama: "Desa B", kecamatanId: 2 },
    { id: 6, nama: "Desa C", kecamatanId: 3 },
    { id: 7, nama: "Desa D", kecamatanId: 4 },
  ]);

  // INTEGRASI DESA KECAMATAN

  // INTEGRASI DESA KECAMATAN

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const selectedKecamatan = watch("selectedKecamatan");

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const kecamatanOptions = dummyKecamatan.map(kecamatan => ({
    id: kecamatan.id.toString(),
    name: kecamatan.nama,
  }));

  const desaOptions = dummyDesa
    .filter(desa => desa.kecamatanId.toString() === selectedKecamatan)
    .map(desa => ({
      id: desa.id.toString(),
      name: desa.nama,
    }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <h1>Select Kecamatan and Desa</h1>

      <Controller
        name="selectedKecamatan"
        control={control}
        render={({ field }) => (
          <InputComponent
            typeInput="selectSearch"
            placeholder="Select Kecamatan"
            label="Kecamatan"
            value={field.value}
            onChange={field.onChange}
            items={kecamatanOptions}
          />
        )}
      />
      {errors.selectedKecamatan && (
        <p className="text-red-500">{errors.selectedKecamatan.message}</p>
      )}

      <Controller
        name="selectedDesa"
        control={control}
        render={({ field }) => (
          <InputComponent
            typeInput="selectSearch"
            placeholder="Select Desa"
            label="Desa"
            value={field.value}
            onChange={field.onChange}
            items={desaOptions}
            valueInput={field.value}
            onChangeInputSearch={() => { }}
          />
        )}
      />
      {errors.selectedDesa && (
        <p className="text-red-500">{errors.selectedDesa.message}</p>
      )}

      <button type="submit" className="mt-4 p-2 bg-blue-500 text-white">
        Submit
      </button>
    </form>
  );
};

export default PageComponent;
