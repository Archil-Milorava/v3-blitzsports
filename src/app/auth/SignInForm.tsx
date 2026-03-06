'use client'
import { authClient } from '@/src/lib/auth-client'
import { Button, Card, Input, Label, TextField } from '@heroui/react'
import { GoogleIcon } from './o-auth-icons'

const SignInForm = () => {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
    })
  }

  return (
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title className="pb-4 text-center text-2xl font-bold">ავტორიზაცია</Card.Title>
        <Card.Description className="text-center">
          შეიყვანეთ თქვენი მონაცემები ავტორიზაციისთვის
        </Card.Description>
      </Card.Header>
      <form>
        <Card.Content>
          <div className="flex flex-col gap-4">
            <TextField name="email" type="email">
              <Label>Email</Label>
              <Input placeholder="email@example.com" variant="secondary" />
            </TextField>
            <TextField name="password" type="password">
              <Label>პაროლი</Label>
              <Input placeholder="••••••••" variant="secondary" />
            </TextField>
          </div>
        </Card.Content>
        <Card.Footer className="mt-4 flex flex-col gap-2">
          <Button className="w-full" type="submit">
            ავტორიზაცია
          </Button>
          {/* <Link className="text-center text-sm" href="#">
            Forgot password?
          </Link> */}
        </Card.Footer>
      </form>
      <div className="bg-muted/10 h-0.5 w-full rounded-2xl"></div>
      <Card.Description className='text-center'>ან გაიარეთ ავტორიზაცია google-ით</Card.Description>
      <Button
        onClick={handleGoogleSignIn}
        className="hover:bg-accent/10 w-full border bg-transparent text-2xl"
      >
        <GoogleIcon />
      </Button>
    </Card>
  )
}

export default SignInForm
