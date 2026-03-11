'use client'
import { authClient } from '@/src/lib/auth-client'
import { Button, Card, FieldError, Input, Label, Spinner, TextField, toast } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'
import { GoogleIcon } from './o-auth-icons'
import { useState } from 'react'

const signInSchema = z.object({
  email: z.string().min(1, 'Email აუცილებელია'),
  password: z.string().min(1, 'შიყვანეთ პაროლი'),
})

type Inputs = z.infer<typeof signInSchema>

const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(signInSchema),
  })
  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
    })
  }

  const handleSignIn: SubmitHandler<Inputs> = async (data) => {
    try {
      setIsLoading(true)
      const { data: res, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: true,
      })
      setIsLoading(false)

      if (error) return toast.danger('დაფიქსირდა შეცდომა')

      toast.success('მოგესალმებით')
      router.push('/')
      router.refresh()
    } catch (error) {
      setIsLoading(false)
      toast.danger('სერვერზე დაფიქსირდა შეცდომა')
    }
  }

  return (
    <Card className="w-full max-w-md">
      <Card.Header>
        <Card.Title className="pb-4 text-center text-2xl font-bold">ავტორიზაცია</Card.Title>
        <Card.Description className="text-center">
          შეიყვანეთ თქვენი მონაცემები ავტორიზაციისთვის
        </Card.Description>
      </Card.Header>
      <form onSubmit={handleSubmit(handleSignIn)} method="POST" action="#">
        <Card.Content>
          <div className="flex flex-col gap-4">
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
          <Button className="w-full" type="submit" isPending={isLoading}>
            {({ isPending }) => (
              <>{isPending ? <Spinner color="current" size="sm" /> : 'ავტორიზაცია'}</>
            )}
          </Button>
        </Card.Footer>
      </form>
      <div className="bg-muted/10 h-0.5 w-full rounded-2xl"></div>
      <Card.Description className="text-center">ან გაიარეთ ავტორიზაცია google-ით</Card.Description>
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
