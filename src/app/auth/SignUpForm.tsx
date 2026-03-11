'use client'

import { authClient } from '@/src/lib/auth-client'
import { Button, Card, FieldError, Input, Label, TextField, toast } from '@heroui/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { GoogleIcon } from './o-auth-icons'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

const signUpSchema = z.object({
  name: z.string().min(1, 'სახელი აუცილებელია'),
  email: z.string().min(1, 'Email აუცილებელია'),
  password: z.string().min(8, 'მინიმუმ 8 სიმბოლო'),
})

type Inputs = z.infer<typeof signUpSchema>

const SignUpForm = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(signUpSchema),
  })

  const handleGoogleSignUp = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
    })
  }

  const handleSignUp: SubmitHandler<Inputs> = async (data) => {
    try {
      const { data: res, error } = await authClient.signUp.email({
        ...data,
        displayName: data.name,
        callbackURL: '/',
      })

      if (error) {
        if (error.status === 422 || error.code === 'USER_ALREADY_EXISTS') {
          toast.danger('რეგისტრაცია ვერ მოხერხდა.')
        } else {
          toast.danger(error.message || 'სერვერთან კავშირი ვერ დამყარდა')
        }
        return
      }

      toast.success('წარმატებით გაიარეთ რეგისტრაცია')
      router.push('/')
      router.refresh()
    } catch (err) {
      toast.danger('სერვერზე დაფიქსირდა შეცდომა')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title className="pb-4 text-center text-2xl font-bold">რეგისტრაცია</Card.Title>
        <Card.Description className="text-center">
          შეიყვანეთ თქვენი მონაცემები სარეგისტრაციოდ
        </Card.Description>
      </Card.Header>
      <form onSubmit={handleSubmit(handleSignUp)}>
        <Card.Content>
          <div className="flex flex-col gap-4">
            <TextField name="name" type="text" isInvalid={!!errors.name}>
              <Label>სახელი</Label>
              <Input placeholder="თქვენი სახელი" variant="secondary" {...register('name')} />
              <FieldError>{errors.name?.message}</FieldError>
            </TextField>
            <TextField name="email" type="email" isInvalid={!!errors.email}>
              <Label>Email</Label>
              <Input placeholder="email@example.com" variant="secondary" {...register('email')} />
              <FieldError>{errors.email?.message}</FieldError>
            </TextField>
            <TextField name="password" type="password" isInvalid={!!errors.password}>
              <Label>პაროლი</Label>
              <Input placeholder="••••••••" variant="secondary" {...register('password')} />
              <FieldError>{errors.password?.message}</FieldError>
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
        onClick={handleGoogleSignUp}
        className="hover:bg-accent/10 w-full border bg-transparent text-2xl"
      >
        <GoogleIcon />
      </Button>
    </Card>
  )
}

export default SignUpForm
