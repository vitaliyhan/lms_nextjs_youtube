import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'
import VerifyRequestForm from './_components/VerifyRequestForm'

function VerifyRequestLoading() {
  return (
    <Card className='w-full mx-auto'>
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>
          Please check your email
        </CardTitle>
        <CardDescription>
          Loading verification form...
        </CardDescription>
      </CardHeader>
      <CardContent className='flex justify-center py-8'>
        <Loader2 className='size-6 animate-spin' />
      </CardContent>
    </Card>
  )
}

export default function VerifyRequestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<VerifyRequestLoading />}>
          <VerifyRequestForm />
        </Suspense>
      </div>
    </div>
  )
}