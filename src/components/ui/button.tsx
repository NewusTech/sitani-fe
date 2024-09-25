import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm md:text-base font-medium ring-offset-white transition-colors focus-visible:outline-none  disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-slate-50 hover:bg-primary/90",
        primary: "bg-primary text-slate-50 hover:bg-primary/90",
        destructive:
          "bg-danger text-slate-50 hover:bg-danger/90",
        outline:
          "border border-[#656565] bg-white hover:bg-slate-100 hover:text-slate-900",
        outlinePrimary:
          "border border-primary bg-white hover:bg-slate-100 hover:text-slate-900",
        secondary:
          "bg-secondary text-white hover:bg-secondary/90",
        ghost: "hover:bg-slate-100 hover:text-slate-900 ",
        link: "text-slate-900 underline-offset-4 hover:underline ",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-full",
        sm: "md:h-9 h-7 rounded-full px-3",
        lg: "md:h-11 h-10 rounded-full px-8",
        full: "h-9 w-full py-6 rounded-full",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
