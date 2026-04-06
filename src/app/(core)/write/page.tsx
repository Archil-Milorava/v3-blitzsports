'use client'

import RichTextEditor from '@/src/components/TipTap/RichTextEditor'
import { useAuthSession } from '@/src/hooks/use-auth-session'
import { createArticle } from '@/src/server/actions/articles/actions'
import {
  Button,
  FieldError,
  InputGroup,
  Label,
  ListBox,
  ProgressBar,
  Select,
  Spinner,
  TextField,
  toast,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Newspaper } from 'lucide-react'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import z from 'zod'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const categories = [
  { id: 'football', name: 'Football' },
  { id: 'mma', name: 'MMA' },
  { id: 'f1', name: 'F1' },
  { id: 'other', name: 'Other' },
]

const articleSchema = z.object({
  image: z.string().min(1, 'სურათი აუცილებელია'),
  category: z.string().min(1, 'კატეგორია აუცილებელია'),
  badge: z.string().min(1, 'ტიპი აუცილებელია'),
  title: z.string().min(1, 'სათაური აუცილებელია'),
  content: z.string().min(1, 'კონტენტი აუცილებელია'),
})

type Inputs = z.infer<typeof articleSchema>

const Page = () => {
  const router = useRouter()
  const { user, isPending: sessionPending } = useAuthSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      image: '',
      category: '',
      badge: '',
      title: '',
      content: '',
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_IMAGE_SIZE) {
      setValue('image', '', { shouldValidate: true })
      setFileName('სურათი ძალიან დიდია (მაქს. 5MB)')
      return
    }
    setFileName(file.name)

    const reader = new FileReader()
    reader.onloadend = () => {
      setValue('image', reader.result as string, { shouldValidate: true })
    }
    reader.readAsDataURL(file)
  }

  const handlePostArticle: SubmitHandler<Inputs> = async (data) => {
    if (!user?.id) {
      toast.danger('სესია ვერ მოიძებნა. გთხოვთ თავიდან შეხვიდეთ სისტემაში.')
      return
    }

    setIsSubmitting(true)
    try {
      await createArticle(data, user.id)
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }
      console.error(error)
      const message =
        error instanceof Error ? error.message : 'სტატიის გამოქვეყნება ვერ მოხერხდა'
      toast.danger(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (sessionPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted text-center text-sm">სტატიის დასაწერად საჭიროა ავტორიზაცია.</p>
        <Button variant="primary" onPress={() => router.push('/auth')}>
          ავტორიზაცია
        </Button>
      </div>
    )
  }

  if (isSubmitting) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-4">
        <ProgressBar
          aria-label="სტატია იგზავნება"
          className="w-full max-w-sm"
          isIndeterminate
        >
          <Label className="text-foreground text-sm font-medium">სტატია იგზავნება…</Label>
          <ProgressBar.Track className="mt-3">
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
        <p className="text-muted max-w-sm text-center text-xs">
          სურათის ატვირთვა და შენახვა შეიძლება რამდენიმე წამს დასჭირდეს.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(handlePostArticle)}
      className="flex min-h-screen w-full flex-col px-2 py-10 sm:px-4 md:px-10 lg:px-14 xl:px-40"
    >
      <h1 className="mb-4 text-3xl font-bold text-gray-800">დაწერე სტატია</h1>

      <div className="my-6 flex flex-col items-start gap-4">
        {/* image */}
        <div className="flex flex-col gap-1">
          <Label>სურათი (მაქს. 5MB)</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-[280px]"
          >
            <ImagePlus className="text-muted size-4" />
            სურათის ატვირთვა
          </Button>
          {fileName && !errors.image && <p className="text-muted text-sm">✓ {fileName}</p>}
          {errors.image && <p className="text-sm text-red-500">{errors.image.message as string}</p>}
        </div>

        {/* category */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              className="w-full"
              placeholder="კატეგორიის არჩევა"
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!errors.category}
            >
              <Label>კატეგორია</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {categories.map((cat) => (
                    <ListBox.Item key={cat.id} id={cat.id} textValue={cat.name}>
                      {cat.name}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
              <FieldError>{errors.category?.message as string}</FieldError>
            </Select>
          )}
        />

        {/* badge */}
        <Controller
          name="badge"
          control={control}
          render={({ field }) => (
            <Select
              className="w-full"
              placeholder="ტიპის არჩევა"
              value={field.value}
              onChange={field.onChange}
              isInvalid={!!errors.badge}
            >
              <Label>ტიპი</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="news" textValue="news">
                    news <ListBox.ItemIndicator />
                  </ListBox.Item>
                  <ListBox.Item id="history" textValue="history">
                    history <ListBox.ItemIndicator />
                  </ListBox.Item>
                </ListBox>
              </Select.Popover>
              <FieldError>{errors.badge?.message as string}</FieldError>
            </Select>
          )}
        />

        {/* ── TITLE ─────────────────────────────────────────────── */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              className="w-full"
              name="title"
              isInvalid={!!errors.title}
            >
              <Label>სათაური</Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <Newspaper className="text-muted size-4" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  className="w-full"
                  placeholder="შეიყვანეთ სტატიის სათაური"
                  value={field.value}
                  onChange={field.onChange}
                />
              </InputGroup>
              <FieldError>{errors.title?.message as string}</FieldError>
            </TextField>
          )}
        />
      </div>

      {/* ── RICH TEXT EDITOR ────────────────────────────────────── */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">სტატია</label>
        <RichTextEditor
          onContentChange={(html) => setValue('content', html, { shouldValidate: true })}
        />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message as string}</p>
        )}
      </div>

      <div className="my-2 flex w-full items-end justify-end">
        <Button type="submit" isPending={isSubmitting}>
          {({ isPending }) => <>{isPending ? <Spinner color="current" size="sm" /> : 'დაპოსტვა'}</>}
        </Button>
      </div>
    </form>
  )
}

export default Page
