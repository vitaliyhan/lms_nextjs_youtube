import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GithubIcon } from "lucide-react"

function LoginPage() {
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
        <Button className="w-full" variant={'outline'}>
          <GithubIcon className="size-4" />
          Sign in with Github
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

export default LoginPage