import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode } from 'react'
import Logo from '@/public/next.svg'

function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className='relative flex min-h-svh flex-col items-center justify-center'>
            <Link href='/' className={buttonVariants({ variant: 'outline', className: "absolute top-4 left-4" })}><ArrowLeft />Back</Link>
            <div className='flex w-full max-w-sm flex-col gap-6'>
                <Link href='/' className='flex gap-4 items-center self-center text-4xl font-medium '>
                    <Image src={Logo} alt='logo' className='size-9' />
                    <span>LMS</span>
                </Link>
                {children}

                <div className='text-balance text-center text-xs text-muted-foreground'>
                    By clicking continue, you agree to our <Link href='#' className='hover:text-primary hover:underline'>Terms of Service</Link> and <Link href='#'>Privacy Policy</Link>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout