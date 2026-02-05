'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

export default function ForgotPasswordPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-primary/5">
            <Card className="w-full max-w-md relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                    onClick={() => router.push('/')}
                >
                    <X className="h-4 w-4" />
                </Button>
                <CardHeader className="text-center pt-10">
                    <CardTitle className="text-3xl font-bold text-primary">Tropic Tech</CardTitle>
                    <CardDescription>Reset Password</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-4 text-muted-foreground">
                        This feature is currently unavailable. Please contact support to reset your password.
                    </p>
                    <Button onClick={() => router.push('/auth/login')} className="w-full">
                        Back to Login
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
