'use client'

import { authClient } from '@/src/lib/auth-client'
import { getArticleByUserId, softDeleteArticle } from '@/src/server/actions/articles/actions'
import { Article } from '@/src/types/types'
import { publishDate } from '@/src/utils/utils'
import type { Selection } from '@heroui/react'

import { Avatar, Button, Checkbox, Chip, Modal, Pagination, Spinner, Table } from '@heroui/react'
import { Icon } from '@iconify/react'
import { redirect, useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { useOverlayState } from '@heroui/react'

const ROWS_PER_PAGE = 10

export function MyArticles() {
  const router = useRouter()
  // eslint-disable-next-line
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState<Article[]>([])
  const deleteModal = useOverlayState()
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)

  const [page, setPage] = useState(1)

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true)
      const data = await authClient.getSession()
      setSession(data)
      setLoading(false)
    }

    fetchSession()
  }, [])

  const user = session?.data?.user

  useEffect(() => {
    if (!user?.id) return

    const fetchData = async () => {
      setLoading(true)
      const data = await getArticleByUserId(user.id)
      setArticles(data || [])
      setLoading(false)
    }

    fetchData()
  }, [user])

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set())

  const totalPages = Math.ceil(articles.length / ROWS_PER_PAGE)

  const paginatedArticles = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE
    return articles.slice(start, start + ROWS_PER_PAGE)
  }, [page, articles])

  const handleDelete = async () => {
    if (!selectedArticleId) return

    try {
      // optimistic UI
      setArticles((prev) => prev.filter((a) => a.id !== selectedArticleId))

      await softDeleteArticle(selectedArticleId)

      deleteModal.close()
      setSelectedArticleId(null)
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
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
            <Table.Column>სათაური</Table.Column>
            <Table.Column>კატეგორია</Table.Column>
            <Table.Column>ტიპი</Table.Column>
            <Table.Column>შექმნის დრო</Table.Column>
            <Table.Column>კონფიგურაცია</Table.Column>
          </Table.Header>

          <Table.Body>
            {paginatedArticles.map((article) => (
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
                    <Button isDisabled isIconOnly size="sm" variant="tertiary">
                      <Icon icon="gravity-ui:pencil" className="size-4" />
                    </Button>
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
                წაშლის შემდეგ სტატია გადაინაცვლებს ნაგვის ურნაში
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

      {/* ✅ Pagination */}
      {totalPages > 1 && (
        <Table.Footer>
          <Pagination size="sm">
            <Pagination.Content>
              {/* Prev */}
              <Pagination.Item>
                <Pagination.Previous
                  isDisabled={page === 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <Pagination.PreviousIcon />
                  უკან
                </Pagination.Previous>
              </Pagination.Item>

              {/* Pages */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Pagination.Item key={p}>
                  <Pagination.Link isActive={p === page} onPress={() => setPage(p)}>
                    {p}
                  </Pagination.Link>
                </Pagination.Item>
              ))}

              {/* Next */}
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
  )
}
