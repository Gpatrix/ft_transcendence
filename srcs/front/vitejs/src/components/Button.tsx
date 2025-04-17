// import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const variants = tv({
    base: 'px-16 py-1 rounded-lg',
    variants: {
      type: {
        full: 'bg-yellow text-grey',
        stroke: 'text-yellow border border-yellow',
      }
    },
    defaultVariants: {
        type: 'stroke',
    },
});

type ButtonProps = {
    text: string;
    className?: string;
} & VariantProps<typeof variants>;

export default function Button({text, type, className} : ButtonProps) {
    return (
        <button className={variants({ type }) + " " + className}>{text}</button>
    );
}