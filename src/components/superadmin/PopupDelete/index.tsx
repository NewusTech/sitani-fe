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
import HapusIcon from '../../../../public/icons/HapusIcon';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';

interface DeletePopupProps {
    onDelete: () => Promise<void>; // onDelete should return a promise
}

const DeletePopup: FC<DeletePopupProps> = ({ onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true); // Set loading to true when starting the delete operation
        try {
            await onDelete(); // Wait for the delete action to complete
        } catch (error) {
            console.error("Delete operation failed:", error);
        } finally {
            setLoading(false); // Set loading to false once the operation is complete
            setIsOpen(false); // Close the dialog
        }
    };

    return (
        <div title='Hapus' className='flex items-center'>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <button onClick={() => setIsOpen(true)}>
                        <HapusIcon />
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='text-start'>
                            Apakah kamu yakin menghapus ini?
                        </DialogTitle>
                        <DialogDescription className='text-start'>
                            Tindakan ini akan membuat data hilang permanen dan akan dihapus di server
                            <div className="wrap flex gap-3 justify-end mt-3">
                                <Button 
                                    type='button' 
                                    variant="outlinePrimary" 
                                    className='w-[100px]'
                                    onClick={() => setIsOpen(false)} // Menutup dialog
                                >
                                    Batal
                                </Button>
                                <Button 
                                    className={`w-[100px] ${loading ? 'bg-gray-500' : 'bg-red-500'}`} 
                                    onClick={handleDelete} // Menambahkan fungsi onClick
                                    disabled={loading} // Disable button while loading
                                >
                                    {loading ? <Loading /> : "Hapus"}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default DeletePopup;
