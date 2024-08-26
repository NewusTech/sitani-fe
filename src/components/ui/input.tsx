"use client"

import * as React from "react";
import { cn } from "@/lib/utils";
import EyeClose from "../../../public/icons/EyeClose";
import EyeOpen from "../../../public/icons/EyeOpen";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode; // Properti untuk ikon di sebelah kiri
  rightIcon?: React.ReactNode; // Properti untuk ikon di sebelah kanan
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleShowPassword = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative w-full flex items-center">
        {leftIcon && <span className="absolute left-4">{leftIcon}</span>}
        <input
          type={type === "password" && showPassword ? "text" : type}
          className={cn(
            "flex h-10 w-full rounded-full border border-primary bg-white px-4 py-6 text-md ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-none focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon ? "pl-11" : "", // Tambahkan padding kiri jika ada ikon
            (rightIcon || type === "password") ? "pr-11" : "", // Tambahkan padding kanan jika ada ikon di kanan atau tipe password
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && <span className="absolute right-4">{rightIcon}</span>}
        {type === "password" && (
          <span
            className="absolute right-4 cursor-pointer"
            onClick={toggleShowPassword}
          >
            {showPassword ? <EyeClose /> : <EyeOpen />}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
