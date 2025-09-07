import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logo from '@/public/next.svg'

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
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-backgroud/60'>
      <div className='container flex min-h-16 items-center mx-auto container-padding gap-4'>
        <Link href={"/"} className='flex items-center gap-3'>
          <Image src={Logo} className='size-9' alt="logo" />
          <span className=''>LMS</span>
        </Link>
        {/* Desktops navigation */}
        <nav>
          <div className='flex items-center space-x-2'>
            {
              navigationItems.map(
                (item) => (
                  <Link key={item.name} href={item.href}>{item.name}</Link>
                )
              )
            }
          </div>
        </nav>
      </div>

    </header>
  )
}
