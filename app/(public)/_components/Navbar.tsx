"use client"

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ThemeToggle } from '@/components/ui/themeToggle'
import { authClient } from '@/lib/auth-client'
import { buttonVariants } from '@/components/ui/button'
import UserDrodown from './UserDropdown'
import Logo from '@/components/ui/logo'

const navigationItems = [
  {
    name: "Home",
    href: "/"
  },
  {
    name: "Courses",
    href: "/courses",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
  }
]

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession()
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-backgroud/60'>
      <div className='container flex min-h-16 items-center mx-auto container-padding gap-6'>
        <Link href={"/"} className='flex items-center gap-3'>
          <Image src={Logo} className='size-9' alt="logo" />
          <span className='font-bold'>LMS</span>
        </Link>
        {/* Desktops navigation */}
        <nav className='hidden md:flex flex-1 justify-between'>
          <div className='flex items-center space-x-2'>
            {
              navigationItems.map(
                (item) => (
                  <Link key={item.name} href={item.href}>{item.name}</Link>
                )
              )
            }
          </div>
          <div className='flex items-center space-x-4'>
            <ThemeToggle />
            {
              isPending ? null : session ? (
                <UserDrodown email={session.user.email} image={session.user.image || ""} name={session.user.name} />
              )
                : (
                  <>
                    <Link href={"/login"} className={buttonVariants({ variant: 'secondary' })}>Login</Link>
                    <Link href={"/login"} className={buttonVariants()}>Get started</Link>
                  </>
                )
            }
          </div>
        </nav>
      </div>

    </header>
  )
}
