"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Label from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const schema = z.object({
  deskripsi: z.string().min(1, { message: 'Title is required' }),
  image: z.instanceof(File).refine(file => file.size > 0, { message: 'Image is required' }),
});


type FormData = z.infer<typeof schema>;

const TambahGaleri = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Handle form submission
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="">
      {/* title */}
      <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Tambah Galeri</div>
      {/* title */}
      <div className="max-full bg-primary-600/50 rounded-lg  p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <div className="flex justify-between gap-2 md:lg-3 lg:gap-5">
              <div className="flex flex-col mb-2 w-full">
                <Label className='text-sm mb-1' label="Deskripsi" />
                <Textarea  {...register('deskripsi')}
                  className={`h-[200px] ${errors.deskripsi ? 'border-red-500' : 'py-5 text-sm'}`}
                />
                {errors.deskripsi && (
                  <HelperError>{errors.deskripsi.message}</HelperError>
                )}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <Label className='text-sm mb-1' label="Gambar" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-full cursor-pointer focus:outline-none "
            />
            {errors.image && (
              <p className="mt-1 text-red-600 text-sm">{errors.image.message}</p>
            )}
            {imagePreview && (
              <div className="mt-4">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="rounded"
                />
              </div>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="w-full mt-5 hover:primary-hover">
            Tambah
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TambahGaleri;
