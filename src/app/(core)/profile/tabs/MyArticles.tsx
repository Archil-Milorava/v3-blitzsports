'use client'

import { useAuthSession } from '@/src/hooks/use-auth-session'
import {
  getArticlesByUserIdPaginated,
  softDeleteArticle,
} from '@/src/server/actions/articles/actions'
import { Article } from '@/src/types/types'
import { publishDate } from '@/src/utils/utils'
import type { Selection } from '@heroui/react'

import {
  Avatar,
  Button,
  Chip,
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
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export function MyArticles() {
  const router = useRouter()
  const { user, isPending: sessionPending, session } = useAuthSession()
  const [listLoading, setListLoading] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const deleteModal = useOverlayState()
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const loadArticles = useCallback(async (userId: string, p: number, q: string) => {
    setListLoading(true)
    try {
      const data = await getArticlesByUserIdPaginated(userId, p, q)
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
    if (sessionPending || !user?.id) return
    void loadArticles(user.id, page, debouncedSearch)
  }, [sessionPending, user?.id, page, debouncedSearch, loadArticles])

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

  const handleDelete = async () => {
    if (!selectedArticleId) return

    try {
      setArticles((prev) => prev.filter((a) => a.id !== selectedArticleId))
      await softDeleteArticle(selectedArticleId)
      deleteModal.close()
      setSelectedArticleId(null)
      toast.success('სტატია გადატანილია ურნაში')
    } catch (err) {
      console.error(err)
      toast.danger(err instanceof Error ? err.message : 'წაშლა ვერ მოხერხდა')
      if (user?.id) void loadArticles(user.id, page, debouncedSearch)
    }
  }

  if (sessionPending || (listLoading && articles.length === 0 && user?.id)) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!session) {
    return redirect('/')
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
            aria-label="სტატიების ძიება"
          />
        </InputGroup>
      </TextField>

      <Table>
        <Table.ScrollContainer>
          <Table.Content
            aria-label="Articles table"
            className="min-w-[800px]"
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            onSelectionChange={setSelectedKeys}
          >
            <Table.Header>
              <Table.Column isRowHeader>სათაური</Table.Column>
              <Table.Column>კატეგორია</Table.Column>
              <Table.Column>ტიპი</Table.Column>
              <Table.Column>შექმნის დრო</Table.Column>
              <Table.Column>კონფიგურაცია</Table.Column>
            </Table.Header>

            <Table.Body>
              {articles.map((article) => (
                <Table.Row key={article.id} className="cursor-pointer">
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar size="md">
                        <Avatar.Image src={article.coverImage} />
                        <Avatar.Fallback>{article.title?.[0]}</Avatar.Fallback>
                      </Avatar>

                      <span className="line-clamp-2 max-w-80 text-xs">{article.title}</span>
                    </div>
                  </Table.Cell>

                  <Table.Cell>{article.category}</Table.Cell>

                  <Table.Cell>
                    <Chip
                      color={article.badge === 'news' ? 'warning' : 'success'}
                      size="sm"
                      variant="secondary"
                    >
                      {article.badge}
                    </Chip>
                  </Table.Cell>

                  <Table.Cell>{publishDate(article.createdAt)}</Table.Cell>

                  <Table.Cell>
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => router.push(`/article/${article.slug}`)}
                        isIconOnly
                        size="sm"
                        variant="tertiary"
                      >
                        <Icon icon="gravity-ui:eye" className="size-4" />
                      </Button>
                      <Link
                        className="rounded-full bg-amber-200 p-2 hover:opacity-80"
                        href={`edit/${article.slug}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon icon="gravity-ui:pencil" className="size-4" />
                      </Link>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="danger-soft"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedArticleId(article.id)
                          deleteModal.open()
                        }}
                      >
                        <Icon className="size-4" icon="gravity-ui:trash-bin" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>

        <Modal.Backdrop isOpen={deleteModal.isOpen} onOpenChange={deleteModal.setOpen}>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-[360px]">
              <Modal.CloseTrigger />

              <Modal.Header>
                <Modal.Icon className="bg-danger-soft text-danger-soft-foreground">
                  <Icon icon="gravity-ui:trash-bin" className="size-5" />
                </Modal.Icon>

                <Modal.Heading>სტატიის წაშლა</Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <p className="text-muted text-sm">
                  სტატია გადავა ურნაში; სურათი Cloudinary-დანაც წაიშლება. ადმინისტრატორს შეუძლია
                  სრულად წაშლა პროფილის ტაბიდან „წაშლილი სტატიები“.
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

                <Button variant="danger" onPress={handleDelete}>
                  წაშლა
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
