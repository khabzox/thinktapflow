import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:translate-y-[-1px]",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700 transform hover:translate-y-[-1px]",
        outline:
          "border-2 border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-md text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
        secondary:
          "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 shadow-sm hover:shadow-md hover:from-slate-200 hover:to-slate-300 dark:from-slate-700 dark:to-slate-600 dark:text-slate-100",
        ghost: 
          "hover:bg-slate-100 hover:text-slate-900 transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-100",
        link: 
          "text-indigo-600 underline-offset-4 hover:underline hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300",
        success:
          "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-emerald-600 hover:to-green-700 transform hover:translate-y-[-1px]",
        premium:
          "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-lg hover:from-amber-600 hover:to-orange-600 transform hover:translate-y-[-1px]",
        glass:
          "bg-white/80 backdrop-blur-sm border border-white/30 text-slate-700 shadow-md hover:bg-white/90 hover:shadow-lg dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800/90",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-11 w-11",
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
