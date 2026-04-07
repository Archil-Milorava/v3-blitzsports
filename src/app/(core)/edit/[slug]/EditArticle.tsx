'use client'

import RichTextEditor from '@/src/components/TipTap/RichTextEditor'
import { updateArticle } from '@/src/server/actions/articles/actions'
import { Article } from '@/src/types/types'
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
import { useParams } from 'next/navigation'
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

const EditArticle = ({ initialData, slug }: { initialData: Article; slug: string }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState('')
  const [editorContent, setEditorContent] = useState(initialData.content)

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      image: initialData.coverImage,
      category: initialData.category || 'არ არის ხელმისაწვდომი',
      badge: initialData.badge || 'არ არის ხელმისაწვდომი',
      title: initialData.title,
      content: initialData.content,
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
    try {
      setIsSubmitting(true)
      await updateArticle(slug, data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitting) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <ProgressBar aria-label="Loading" className="w-64" value={60}>
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
            <TextField className="w-full" name="title" isInvalid={!!errors.title}>
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

      {/* Rich Text Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">სტატია</label>
        <RichTextEditor onContentChange={setEditorContent} currentContent={editorContent} />
      </div>

      <div className="my-2 flex w-full items-end justify-end">
        <Button type="submit" isPending={isSubmitting}>
          {({ isPending }) => <>{isPending ? <Spinner color="current" size="sm" /> : 'დაპოსტვა'}</>}
        </Button>
      </div>
    </form>
  )
}

export default EditArticle
