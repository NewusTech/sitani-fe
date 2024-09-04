"use client"
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Label from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import HelperError from '@/components/ui/HelperError';
import { Button } from '@/components/ui/button';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr';
import { SWRResponse, mutate } from "swr";
import Image from 'next/image';
import Loading from '@/components/ui/Loading';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const schema = z.object({
    judul: z.string().min(1, { message: 'Title is required' }),
    konten: z.string().min(1, { message: 'Content is required' }),
    image: z.instanceof(File).optional().refine(file => !file || file.size > 0, { message: 'Image is required if provided' }),
});


type FormSchemaType = z.infer<typeof schema>;

const EditBerita = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm<FormSchemaType>({
        resolver: zodResolver(schema),
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const axiosPrivate = useAxiosPrivate();
    const navigate = useRouter();
    const params = useParams();
    const { slug } = params;
    const [loading, setLoading] = useState(false);


    const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
        setLoading(true); // Set loading to true when the form is submitted
        const formData = new FormData();
        formData.append('judul', data.judul);
        formData.append('konten', data.konten);

        // Memeriksa jika image ada sebelum menambahkannya ke formData
        if (data.image) {
            formData.append('image', data.image);
        }

        try {
            await axiosPrivate.put(`/article/update/${slug}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('sukses', formData);
            navigate.push('/data-master/kelola-berita');
            reset();
        } catch (e: any) {
            if (e.response && e.response.data && e.response.data.data) {
                console.log("Failed to update article:", e.response.data.data[0].message);
            } else {
                console.log("Failed to update article:", e.message);
            }
        } finally {
            setLoading(false); // Set loading to false once the process is complete
        }
        mutate(`/data-master/kelola-berita`);
    };



    interface Artikel {
        id?: string;
        judul?: string;
        slug?: string;
        konten?: string;
        image?: string;
        createdAt?: string;
    }

    interface Response {
        status: string,
        data: Artikel,
        message: string
    }

    const { data: dataArtikel, error } = useSWR<Response>(
        slug ? `article/get/${slug}` : null,
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
        if (dataArtikel?.data) {
            setValue("judul", dataArtikel.data.judul ?? '');
            setValue("konten", dataArtikel.data.konten ?? '');
            if (dataArtikel.data.image) {
                setImagePreview(dataArtikel.data.image);
            }
        }
    }, [dataArtikel, setValue]);

    const handleEditorChange = (content: string) => {
        setValue('konten', content); // Update form value when editor content changes
    };

    return (
        <div className="">
            <div className="text-xl md:text-2xl md:mb-4 mb-3 font-semibold text-primary uppercase">Edit Berita</div>
            <div className="max-full bg-primary-600/50 rounded-lg p-6">
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <div className="mb-4">
                        <Label className='text-sm mb-1' label="Judul" />
                        <Input
                            type="text"
                            placeholder="Judul"
                            {...register('judul')}
                            className={`${errors.judul ? 'border-red-500' : ''}`}
                        />
                        {errors.judul && (
                            <HelperError>{errors.judul.message}</HelperError>
                        )}
                    </div>
                    <div className="mb-4">
                        <Label className='text-sm mb-1' label="Deskripsi" />
                        <div className="text-editor bg-white border border-primary rounded-lg overflow-hidden">
                            <ReactQuill
                                className='h-[450px]'
                                value={getValues('konten')} // Pass the value from the form
                                onChange={handleEditorChange} // Update form value on change
                            />
                        </div>
                        {errors.konten && (
                            <p className="mt-1 text-red-600 text-sm">{errors.konten.message}</p>
                        )}
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
                            <div className="mt-4 w-[300px] h-[200px] overflow-hidden rounded">
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={300}
                                    height={200}
                                    className="rounded h-full object-contain"
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
                            "Perbarui Artikel"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditBerita;
