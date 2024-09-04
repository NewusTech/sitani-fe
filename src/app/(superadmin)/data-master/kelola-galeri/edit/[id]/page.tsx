"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import 'react-quill/dist/quill.snow.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Label from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
// 
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import Loading from '@/components/ui/Loading';


const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const schema = z.object({
  deskripsi: z.string().min(1, { message: 'Deskripsi wajib diisi' }),
  image: z.instanceof(File).optional().refine(file => !file || file.size > 0, { message: 'Image is required if provided' }),
});


type FormSchemaType = z.infer<typeof schema>;

const EditGaleri = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
  });

  // const onSubmit = (data: FormSchemaType) => {
  //   console.log(data);
  //   // Handle form submission
  // };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  // integrasi
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useRouter();
  const params = useParams();
  const { id } = params;

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true); // Set loading to true when the form is submitted
    const formData = new FormData();
    formData.append('deskripsi', data.deskripsi);

    // Memeriksa jika image ada sebelum menambahkannya ke formData
    if (data.image) {
      formData.append('image', data.image);
    }

    try {
      await axiosPrivate.put(`/galeri/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate.push('/data-master/kelola-galeri');
      console.log("berhasil update", formData)
      reset();
    } catch (e: any) {
      if (e.response && e.response.data && e.response.data.data) {
        console.log("Failed to update galeri:", e.response.data.data[0].message);
      } else {
        console.log("Failed to update galeri:", e.message);
      }
    } finally {
      setLoading(false); // Set loading to false once the process is complete
    }
    mutate(`/data-master/kelola-galeri`);
  };



  interface Galeri {
    id?: string;
    deskripsi?: string;
    image?: string;
  }

  interface Response {
    status: string,
    data: Galeri,
    message: string
  }

  const { data: dataGaleri, error } = useSWR<Response>(
    id ? `galeri/get/${id}` : null,
    async (url: string) => {
      try {
        const response = await axiosPrivate.get(url);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        return null;
      }
    }
  );

  useEffect(() => {
    if (dataGaleri?.data) {
      setValue("deskripsi", dataGaleri.data.deskripsi ?? '');
      if (dataGaleri.data.image) {
        setImagePreview(dataGaleri.data.image);
      }
    }
  }, [dataGaleri, setValue]);

  const handleEditorChange = (content: string) => {
    setValue('deskripsi', content); // Update form value when editor content changes
  };
  // integrasi

  return (
    <div className="">
      {/* title */}
      <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Edit Galeri</div>
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
            {loading ? (
              <Loading />
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditGaleri;
