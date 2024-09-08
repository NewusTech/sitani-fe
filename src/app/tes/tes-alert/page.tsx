"use client"

// pages/index.tsx

import SweetAlert2Component from "@/components/ui/SweetAlert2Component";

const TesAlert = () => {
    const handleConfirm = () => {
        console.log('Confirmed!');
    };

    const handleCancel = () => {
        console.log('Cancelled!');
    };

    return (
        <div>
            <h1>SweetAlert2 Example</h1>
            <SweetAlert2Component
                type="success"
                title="Success!"
                text="You have successfully triggered an alert."
                confirmButtonText="Okay"
                cancelButtonText="Cancel"
                timer={3000} // Alert akan hilang setelah 3 detik
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </div>
    );
};

export default TesAlert;

// Swal.fire({
//     icon: 'success',
//     title: 'Data berhasil dihapus!',
//     text: 'Penerima UPPO telah dihapus.',
//     timer: 1000,
//     timerProgressBar: true,
//     confirmButtonText: "Okay",
//     showClass: {
//         popup: 'animate__animated animate__fadeInDown',
//     },
//     hideClass: {
//         popup: 'animate__animated animate__fadeOutUp',
//     },
//     customClass: {
//         title: 'text-2xl font-semibold text-green-600',
//         icon: 'text-green-500 animate-bounce',
//         confirmButton: 'bg-primary hover:bg-primary-light text-white py-2 px-4 rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-105 shadow-md',
//         timerProgressBar: 'bg-gradient-to-r from-blue-400 to-green-400', // Gradasi warna yang lembut
//     },
//     backdrop: `rgba(0, 0, 0, 0.4)`,
// });

// <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110duration-300">

// </div>
