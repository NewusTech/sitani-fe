"use client";
import React, { FC, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';
import VerifikasiIcon from '../../../../public/icons/VerifikasiIcon';

interface VerifikasiPopupProps {
    kecamatanId: number;
    bulan: string;
    onVerifikasi: (payload: { kecamatan_id: number; bulan: string; status: string }) => Promise<void>;
}

const VerifikasiPopup: FC<VerifikasiPopupProps> = ({ kecamatanId, bulan, onVerifikasi }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setLoading(true);
        const payload = {
            kecamatan_id: kecamatanId,
            bulan: bulan,
            status: "terima"
        };

        try {
            await onVerifikasi(payload); // Call the API with the payload
        } catch (error) {
            console.error("Verifikasi gagal:", error);
        } finally {
            setLoading(false);
            setIsOpen(false); // Close the dialog after operation
        }
    };

    return (
        <div title='Terima Validasi' className='flex items-center'>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button onClick={() => setIsOpen(true)}>
                        <VerifikasiIcon />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Apakah kamu yakin ingin memverifikasi data ini?
                        </DialogTitle>
                        <DialogDescription>
                            Tindakan ini akan memverifikasi data yang dikirim oleh Korluh. Pastikan data sudah sesuai.
                            <div className="wrap flex gap-3 justify-end mt-3">
                                <Button
                                    type='button'
                                    variant="outlinePrimary"
                                    className='w-[100px]'
                                    onClick={() => setIsOpen(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    className={`w-[100px] ${loading ? 'bg-gray-500' : 'bg-primary hover:bg-primary-hover'}`}
                                    onClick={handleVerify}
                                    disabled={loading}
                                >
                                    {loading ? <Loading /> : "Verifikasi"}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VerifikasiPopup;
