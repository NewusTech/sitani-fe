"use client"

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SelectMultipleKecamatan from '@/components/superadmin/KecamatanMultiple';

// Define the validation schema and type directly in the file
const schema = z.object({
  kecamatan_list: z.array(z.number()).min(1, "At least one kecamatan must be selected"),
});

type SchemaType = z.infer<typeof schema>;

// Define dummy data for kecamatan options
const dummyKecamatanOptions = [
  { id: 1, nama: 'Kecamatan A' },
  { id: 2, nama: 'Kecamatan B' },
  { id: 3, nama: 'Kecamatan C' },
  { id: 4, nama: 'Kecamatan D' },
];

const KecamatanPage: React.FC = () => {
  // Initialize form with react-hook-form and zod resolver
  const { control, handleSubmit, formState: { errors } } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      kecamatan_list: [],
    },
  });

  // Handle form submission
  const onSubmit = (data: SchemaType) => {
    console.log('Form Data:', data);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Select Multiple Kecamatan</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="kecamatan_list"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <SelectMultipleKecamatan
              kecamatanOptions={dummyKecamatanOptions}
              selectedKecamatan={dummyKecamatanOptions.filter(option =>
                value.includes(option.id)
              )}
              onChange={(selected: any[]) => onChange(selected.map((d: { id: any; }) => d.id))}
            />
          )}
        />
        {errors.kecamatan_list && (
          <p className="text-red-500">{errors.kecamatan_list.message}</p>
        )}
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2">
          Submit
        </button>
      </form>
    </div>
  );
};

export default KecamatanPage;
