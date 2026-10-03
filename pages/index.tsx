import type { GetStaticProps } from 'next'
import { PieChartWithLegend } from '@/components/ui/pie-chart-with-legend'
import {SampleDataTable} from '@/components/ui/sample-data-table'
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Spending Insights Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Monitor streaks, category spending, and credit vs. debit trends</p>
        </div>
        
        <PieChartWithLegend />

        
        
      </div>
      
      <div className="w-full max-w-4xl mx-auto mt-6 mb-6 md:mb-8">
        <SampleDataTable />
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: {} }
}
