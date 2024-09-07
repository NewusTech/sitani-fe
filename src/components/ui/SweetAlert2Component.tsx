// components/SweetAlert2Component.tsx
import Swal from 'sweetalert2';
import React from 'react';

interface SweetAlert2ComponentProps {
    type: 'success' | 'error' | 'warning' | 'info' | 'question';
    title: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    timer?: number; // Tambahkan opsi timer (dalam milidetik)
}

const SweetAlert2Component: React.FC<SweetAlert2ComponentProps> = ({
    type,
    title,
    text,
    confirmButtonText,
    cancelButtonText,
    onConfirm,
    onCancel,
    timer, // tambahkan di sini
}) => {
    const showAlert = () => {
        Swal.fire({
            icon: type,
            title: title,
            text: text,
            showCancelButton: !!cancelButtonText,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            timer: timer, // set timer
            timerProgressBar: true, // Menampilkan progress bar timer
        }).then((result) => {
            if (result.isConfirmed && onConfirm) {
                onConfirm();
            } else if (result.isDismissed && onCancel) {
                onCancel();
            }
        });
    };

    return (
        <button onClick={showAlert}>
            Show Alert
        </button>
    );
};

export default SweetAlert2Component;
