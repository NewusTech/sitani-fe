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
    onVerifikasi: () => Promise<void>; // onDelete should return a promise
}

const VerifikasiPopup: FC<VerifikasiPopupProps> = ({ onVerifikasi }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        setLoading(true); // Set loading to true when starting the delete operation
        try {
            await onVerifikasi(); // Wait for the delete action to complete
        } catch (error) {
            console.error("Verifikasi operation failed:", error);
        } finally {
            setLoading(false); // Set loading to false once the operation is complete
            setIsOpen(false); // Close the dialog
        }
    };

    return (
        <div title='Verifikasi' className='flex items-center'>
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
                                    className={`w-[100px] ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'}`}
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
}

export default VerifikasiPopup;
