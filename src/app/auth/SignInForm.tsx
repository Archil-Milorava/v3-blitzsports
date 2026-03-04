'use client'
import { signInAction } from '@/src/server/actions/users/users.actions'
import { Button, Card, Input, Label, TextField } from '@heroui/react'
import Link from 'next/link'

const SignInForm = () => {
  return (
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title>Login</Card.Title>
        <Card.Description>Enter your credentials to access your account</Card.Description>
      </Card.Header>
      <form action={signInAction}>
        <Card.Content>
          <div className="flex flex-col gap-4">
            <TextField name="email" type="email">
              <Label>Email</Label>
              <Input placeholder="email@example.com" variant="secondary" />
            </TextField>
            <TextField name="password" type="password">
              <Label>Password</Label>
              <Input placeholder="••••••••" variant="secondary" />
            </TextField>
          </div>
        </Card.Content>
        <Card.Footer className="mt-4 flex flex-col gap-2">
          <Button className="w-full" type="submit">
            Sign In
          </Button>
          <Link className="text-center text-sm" href="#">
            Forgot password?
          </Link>
        </Card.Footer>
      </form>
    </Card>
  )
}

export default SignInForm
