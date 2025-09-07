import { ReactNode } from "react"

export default function Layout({children}: { children: ReactNode }) {
  return (
    <div className="">
        <h1>
            navbar
        </h1>
        <main className="container mx-auto px-4 md:px-6 ld:px-8">{children}</main>
    </div>
  )
}