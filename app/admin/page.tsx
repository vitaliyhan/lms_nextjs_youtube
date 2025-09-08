import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive"
import { DataTable } from "@/components/sidebar/data-table"
import { SectionCards } from "@/components/sidebar/section-cards"

import data from "./data.json"

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
