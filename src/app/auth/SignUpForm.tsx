'use client'

import { authClient } from '@/src/lib/auth-client'
import { Button, Card, Input, Label, TextField } from '@heroui/react'
import { GoogleIcon } from './o-auth-icons'

const SignUpForm = () => {
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
    })
  }
  return (
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title className="pb-4 text-center text-2xl font-bold">რეგისტრაცია</Card.Title>
        <Card.Description className="text-center">
          შეიყვანეთ თქვენი მონაცემები სარეგისტრაციოდ
        </Card.Description>
      </Card.Header>
      <form>
        <Card.Content>
          <div className="flex flex-col gap-4">
            <TextField name="name" type="text">
              <Label>სახელი</Label>
              <Input placeholder="თქვენი სახელი" variant="secondary" required />
            </TextField>
            <TextField name="email" type="email">
              <Label>Email</Label>
              <Input placeholder="email@example.com" variant="secondary" required />
            </TextField>
            <TextField name="password" type="password">
              <Label>პაროლი</Label>
              <Input placeholder="••••••••" variant="secondary" required />
            </TextField>
          </div>
        </Card.Content>
        <Card.Footer className="mt-4 flex flex-col gap-2">
          <Button className="w-full" type="submit">
            რეგისტრაცია
          </Button>
        </Card.Footer>
      </form>
      <div className="bg-muted/10 h-0.5 w-full rounded-2xl"></div>
      <Card.Description className="text-center">ან გაიარეთ რეგისტრაცია google-ით</Card.Description>
      <Button
        onClick={handleGoogleSignIn}
        className="hover:bg-accent/10 w-full border bg-transparent text-2xl"
      >
        <GoogleIcon />
      </Button>
    </Card>
  )
}

export default SignUpForm
