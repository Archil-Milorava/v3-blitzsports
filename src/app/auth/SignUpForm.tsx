'use client'
import { signUpAction } from '@/src/server/actions/users/users.actions'
import { Button, Card, Input, Label, TextField } from '@heroui/react'
import Link from 'next/link'

const SignUpForm = () => {
  return (
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title className="pb-4 text-center text-2xl font-bold">რეგისტრაცია</Card.Title>
        <Card.Description className="text-center">
          შეიყვანეთ თქვენი მონაცემები სარეგისტრაციოდ
        </Card.Description>
      </Card.Header>
      <form action={signUpAction}>
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
            Sign Up
          </Button>
          <Link className="text-center text-sm" href="#">
            already have an account?
          </Link>
        </Card.Footer>
      </form>
    </Card>
  )
}

export default SignUpForm
