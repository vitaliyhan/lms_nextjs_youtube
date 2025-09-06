"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

export default function VerifyRequest() {

    const router = useRouter()
    const [otp, setOtp] = useState('')
    const [emailPending, startEmailTransition] = useTransition()
    const params = useSearchParams()
    const email = params.get('email') as string
    const isOtpComplete = otp.length === 6

    function verifyOtp() {
        startEmailTransition(async () => {
            await authClient.signIn.emailOtp({
                otp: otp,
                email: email,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success('Email verified successfully')
                        router.push("/")
                    },
                    onError: (error) => {
                        toast.error('Error verifying Email/OTP')
                    }
                }
            })
        })
    }

    return (
        <Card className='w-full mx-auto'>
            <CardHeader className='text-center'>
                <CardTitle className='text-xl'>
                    Plese check your email
                </CardTitle>
                <CardDescription>
                    We have sent you a verification code to your email. Please enter the code below to verify your account.
                </CardDescription>

            </CardHeader>
            <CardContent className='space-y-6'>
                <div className='flex flex-col items-center space-y-2'>
                    <InputOTP maxLength={6} className='gap-2' value={otp} onChange={(val) => setOtp(val)}>
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                    <p className='text-sm text-muted-foreground'>Enter your 6-digit code send to your email</p>
                </div>

                <Button onClick={verifyOtp} disabled={emailPending || !isOtpComplete} className='w-full'>{emailPending ?<><Loader2 className='size-4 animate-spin'/>Loading...</>: <>Verify Accout</>}</Button>
            </CardContent>
        </Card>
    )
}