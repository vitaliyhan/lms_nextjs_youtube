import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive"
import { DataTable } from "@/components/sidebar/data-table"
import { SectionCards } from "@/components/sidebar/section-cards"

const data = [] as any[]

export default function AdminIndexPage() {
  return (
    <>
      <SectionCards />
      <div className="">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  )
}
