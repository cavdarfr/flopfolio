import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-mono text-xs font-semibold uppercase tracking-[0.15em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-bone disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-2 border-ink bg-ink text-bone shadow-slab-vermilion hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_var(--vermilion)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none",
        destructive:
          "border-2 border-vermilion-bright bg-vermilion-bright text-cream hover:bg-vermilion hover:border-vermilion",
        outline:
          "border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-bone",
        secondary:
          "border-2 border-ink bg-acid text-ink shadow-slab-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
        ghost: "text-ink hover:bg-ink/5",
        link: "text-ink underline decoration-2 underline-offset-4 hover:text-vermilion",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3",
        lg: "h-12 px-8 text-sm",
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
