"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { GithubIcon, Loader } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"

export function LoginForm() {
    const [githubPanding, startGithubTransition] = useTransition()
    async function signInWithGithub() {
        startGithubTransition(async () => {
            await authClient.signIn.social({
                provider: 'github', callbackURL: '/', fetchOptions: {
                    onSuccess: () => {
                        toast.success('Signed in with Github, you will be redirected...')
                    },
                    onError: (error) => {
                        toast.error("Internal server error");
                    }
                }
            })
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">
                    Welcome Back!
                </CardTitle>
                <CardDescription>
                    Sign in to your account to continue your journey.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button disabled={githubPanding} onClick={signInWithGithub} className="w-full" variant={'outline'}>
                    {
                        githubPanding ? (
                            <>
                                <Loader className="size-4 animate-spin" />
                                <span>Loading...</span>
                            </>
                        )
                            :
                            (
                                <>
                                    <GithubIcon className="size-4" />
                                    Sign in with Github
                                </>
                            )
                    }
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:border-border after:border-t">
                    <span className="relative z-10 bg-card px-2 text-muted-foreground">
                        or continue with
                    </span>
                </div>

                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" placeholder="mail@example.com" />
                        <Button>Continue with Email</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}