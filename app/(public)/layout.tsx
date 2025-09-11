import { ReactNode } from "react"
import Navbar from "./_components/Navbar"

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <div className="">
            <Navbar />
            <main className="container mx-auto container-padding">{children}</main>
        </div>
    )
}