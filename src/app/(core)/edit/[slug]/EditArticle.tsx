'use client'

import RichTextEditor from '@/src/components/TipTap/RichTextEditor'
import { updateArticle } from '@/src/server/actions/articles/actions'

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
} from '@heroui/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Newspaper } from 'lucide-react'
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

export default function EditArticlePage({ initialData }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData.title,
      category: initialData.category || '',
      badge: initialData.badge || '',
      image: initialData.coverImage || '',
      content: initialData.content,
    },
  })

  // 📸 Image handler
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
    try {
      setIsSubmitting(true)
      await updateArticle(initialData.slug, data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ProgressBar className="w-64" value={60}>
          <Label>Loading</Label>
          <ProgressBar.Output />
          <ProgressBar.Track>
            <ProgressBar.Fill />
          </ProgressBar.Track>
        </ProgressBar>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(handlePostArticle)}
      className="flex min-h-screen w-full flex-col px-2 py-10 sm:px-4 md:px-10 lg:px-14 xl:px-40"
    >
      <h1 className="mb-4 text-3xl font-bold">Edit Article</h1>

      <div className="my-6 flex flex-col gap-4">

        {/* IMAGE */}
        <div>
          <Label>Image</Label>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleImageChange}
          />

          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus className="size-4" />
            Upload Image
          </Button>

          {fileName && <p>{fileName}</p>}
          {errors.image && <p className="text-red-500">{errors.image.message}</p>}
        </div>

        {/* CATEGORY */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onChange={field.onChange}>
              <Label>Category</Label>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {categories.map((cat) => (
                    <ListBox.Item key={cat.id} id={cat.id}>
                      {cat.name}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
              <FieldError>{errors.category?.message}</FieldError>
            </Select>
          )}
        />

        {/* BADGE */}
        <Controller
          name="badge"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onChange={field.onChange}>
              <Label>Type</Label>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="news">news</ListBox.Item>
                  <ListBox.Item id="history">history</ListBox.Item>
                </ListBox>
              </Select.Popover>
              <FieldError>{errors.badge?.message}</FieldError>
            </Select>
          )}
        />

        {/* TITLE */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField isInvalid={!!errors.title}>
              <Label>Title</Label>
              <InputGroup>
                <InputGroup.Prefix>
                  <Newspaper className="size-4" />
                </InputGroup.Prefix>
                <InputGroup.Input
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter title"
                />
              </InputGroup>
              <FieldError>{errors.title?.message}</FieldError>
            </TextField>
          )}
        />
      </div>

      {/* ✅ EDITOR FIXED */}
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <RichTextEditor
            currentContent={field.value}
            onContentChange={field.onChange}
          />
        )}
      />

      <div className="flex justify-end mt-4">
        <Button type="submit">
          {isSubmitting ? <Spinner size="sm" /> : 'Update'}
        </Button>
      </div>
    </form>
  )
}