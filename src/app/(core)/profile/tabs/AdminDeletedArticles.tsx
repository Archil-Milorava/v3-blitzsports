'use client'

import { useAuthSession } from '@/src/hooks/use-auth-session'
import {
  getSoftDeletedArticlesPaginated,
  permanentlyDeleteArticle,
} from '@/src/server/actions/articles/actions'
import type { Article } from '@/src/types/types'
import { publishDate } from '@/src/utils/utils'
import {
  Avatar,
  Button,
  InputGroup,
  Label,
  Modal,
  Pagination,
  Spinner,
  Table,
  TextField,
  toast,
  useOverlayState,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { redirect } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

type ArticleWithAuthor = Article & {
  author?: {
    id: string
    name: string
    displayName: string | null
    image: string | null
  } | null
}

export function AdminDeletedArticles() {
  const { user, isPending: sessionPending, isAdmin } = useAuthSession()
  const [listLoading, setListLoading] = useState(false)
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const deleteModal = useOverlayState()
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)

  const currentUserId = user?.id

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const loadArticles = useCallback(async (p: number, q: string) => {
    setListLoading(true)
    try {
      const data = await getSoftDeletedArticlesPaginated(p, q)
      setArticles(data.articles)
      setTotalPages(data.totalPages)
    } catch (e) {
      console.error(e)
      toast.danger(e instanceof Error ? e.message : 'მონაცემების ჩატვირთვა ვერ მოხერხდა')
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    if (sessionPending || !currentUserId || !isAdmin) return
    void loadArticles(page, debouncedSearch)
  }, [sessionPending, currentUserId, isAdmin, page, debouncedSearch, loadArticles])

  const handlePermanentDelete = async () => {
    if (!selectedArticleId) return
    try {
      await permanentlyDeleteArticle(selectedArticleId)
      setArticles((prev) => prev.filter((a) => a.id !== selectedArticleId))
      deleteModal.close()
      setSelectedArticleId(null)
      toast.success('სტატია სამუდამოდ წაიშალა')
    } catch (e) {
      toast.danger(e instanceof Error ? e.message : 'წაშლა ვერ მოხერხდა')
    }
  }

  if (sessionPending || (isAdmin && listLoading && articles.length === 0)) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    return redirect('/')
  }

  if (!isAdmin) {
    return (
      <p className="text-muted text-sm">ამ გვერდზე წვდომა მხოლოდ ადმინისტრატორს აქვს.</p>
    )
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <TextField className="max-w-md">
        <Label>ძიება</Label>
        <InputGroup>
          <InputGroup.Prefix>
            <Icon icon="gravity-ui:magnifier" className="text-muted size-4" />
          </InputGroup.Prefix>
          <InputGroup.Input
            placeholder="სათაური, slug, კატეგორია"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="წაშლილი სტატიების ძიება"
          />
        </InputGroup>
      </TextField>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Deleted articles table" className="min-w-[800px]">
            <Table.Header>
              <Table.Column>სათაური</Table.Column>
              <Table.Column>ავტორი</Table.Column>
              <Table.Column>კატეგორია</Table.Column>
              <Table.Column>წაშლის თარიღი</Table.Column>
              <Table.Column>მოქმედება</Table.Column>
            </Table.Header>

            <Table.Body>
              {articles.map((article) => (
                <Table.Row key={article.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar size="md">
                        <Avatar.Image src={article.coverImage} />
                        <Avatar.Fallback>{article.title?.[0]}</Avatar.Fallback>
                      </Avatar>
                      <span className="line-clamp-2 max-w-72 text-xs">{article.title}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-xs">{article.author?.name ?? '—'}</span>
                  </Table.Cell>
                  <Table.Cell>{article.category}</Table.Cell>
                  <Table.Cell>
                    {article.deletedAt ? publishDate(article.deletedAt) : '—'}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="danger-soft"
                      onPress={() => {
                        setSelectedArticleId(article.id)
                        deleteModal.open()
                      }}
                    >
                      <Icon className="size-4" icon="gravity-ui:trash-bin" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>

        <Modal.Backdrop isOpen={deleteModal.isOpen} onOpenChange={deleteModal.setOpen}>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[400px]">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Icon className="bg-danger-soft text-danger-soft-foreground">
                  <Icon icon="gravity-ui:trash-bin" className="size-5" />
                </Modal.Icon>
                <Modal.Heading>სტატიის სამუდამო წაშლა</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-muted text-sm">
                  სტატია და მისი სურათი სრულად წაიშლება. ეს ქმედება უკან არ ბრუნდება.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onPress={() => {
                    deleteModal.close()
                    setSelectedArticleId(null)
                  }}
                >
                  გამოსვლა
                </Button>
                <Button variant="danger" onPress={handlePermanentDelete}>
                  სამუდამოდ წაშლა
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>

        {totalPages > 1 && (
          <Table.Footer>
            <Pagination size="sm">
              <Pagination.Content>
                <Pagination.Item>
                  <Pagination.Previous
                    isDisabled={page === 1}
                    onPress={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <Pagination.PreviousIcon />
                    უკან
                  </Pagination.Previous>
                </Pagination.Item>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Pagination.Item key={p}>
                    <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                      {p}
                    </Pagination.Link>
                  </Pagination.Item>
                ))}
                <Pagination.Item>
                  <Pagination.Next
                    isDisabled={page === totalPages}
                    onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    შემდეგ
                    <Pagination.NextIcon />
                  </Pagination.Next>
                </Pagination.Item>
              </Pagination.Content>
            </Pagination>
          </Table.Footer>
        )}
      </Table>
    </div>
  )
}
