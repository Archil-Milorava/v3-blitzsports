'use client'

import { useAuthSession } from '@/src/hooks/use-auth-session'
import {
  adminDeleteUser,
  adminUpdateUserRole,
  getUsersPaginated,
  type AdminUserRow,
} from '@/src/server/actions/users/actions'
import { publishDate } from '@/src/utils/utils'
import {
  Avatar,
  Button,
  InputGroup,
  Label,
  ListBox,
  Modal,
  Pagination,
  Select,
  Spinner,
  Table,
  TextField,
  toast,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { redirect } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { useOverlayState } from '@heroui/react'

const roleOptions: { id: AdminUserRow['role']; label: string }[] = [
  { id: 'user', label: 'მომხმარებელი' },
  { id: 'writer', label: 'ავტორი' },
  { id: 'admin', label: 'ადმინისტრატორი' },
]

export function ManageUsers() {
  const { user, isPending: sessionPending, isAdmin } = useAuthSession()
  const [listLoading, setListLoading] = useState(false)
  const [users, setUsers] = useState<AdminUserRow[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const deleteModal = useOverlayState()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [roleSavingId, setRoleSavingId] = useState<string | null>(null)

  const currentUserId = user?.id

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const loadUsers = useCallback(async (p: number, q: string) => {
    setListLoading(true)
    try {
      const data = await getUsersPaginated(p, q)
      setUsers(data.users)
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
    void loadUsers(page, debouncedSearch)
  }, [sessionPending, currentUserId, isAdmin, page, debouncedSearch, loadUsers])

  const handleDelete = async () => {
    if (!selectedUserId) return
    try {
      await adminDeleteUser(selectedUserId)
      setUsers((prev) => prev.filter((u) => u.id !== selectedUserId))
      deleteModal.close()
      setSelectedUserId(null)
      toast.success('მომხმარებელი წაიშალა')
    } catch (e) {
      toast.danger(e instanceof Error ? e.message : 'წაშლა ვერ მოხერხდა')
    }
  }

  const handleRoleChange = async (userId: string, role: string) => {
    setRoleSavingId(userId)
    try {
      await adminUpdateUserRole(userId, role)
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: role as AdminUserRow['role'] } : u)))
      toast.success('როლი განახლდა')
    } catch (e) {
      toast.danger(e instanceof Error ? e.message : 'როლის განახლება ვერ მოხერხდა')
    } finally {
      setRoleSavingId(null)
    }
  }

  if (sessionPending || (isAdmin && listLoading && users.length === 0)) {
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
            placeholder="სახელი, ელ-ფოსტა, display name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="მომხმარებლების ძიება"
          />
        </InputGroup>
      </TextField>

      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Users table" className="min-w-[880px]">
            <Table.Header>
              <Table.Column>მომხმარებელი</Table.Column>
              <Table.Column>ელ-ფოსტა</Table.Column>
              <Table.Column>როლი</Table.Column>
              <Table.Column>რეგისტრაცია</Table.Column>
              <Table.Column>მოქმედებები</Table.Column>
            </Table.Header>

            <Table.Body>
              {users.map((u) => {
                const isSelf = u.id === currentUserId
                return (
                  <Table.Row key={u.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <Avatar size="md">
                          <Avatar.Image src={u.image ?? undefined} />
                          <Avatar.Fallback>{u.name?.[0] ?? '?'}</Avatar.Fallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="line-clamp-1 max-w-56 text-sm font-medium">{u.name}</span>
                          {u.displayName && (
                            <span className="text-muted line-clamp-1 max-w-56 text-xs">@{u.displayName}</span>
                          )}
                        </div>
                      </div>
                    </Table.Cell>

                    <Table.Cell>
                      <span className="line-clamp-2 max-w-48 text-xs">{u.email}</span>
                    </Table.Cell>

                    <Table.Cell>
                      <Select
                        className="w-48 min-w-44"
                        placeholder="როლი"
                        value={u.role}
                        isDisabled={roleSavingId === u.id}
                        onChange={(value) => {
                          const next = value != null ? String(value) : ''
                          if (next && next !== u.role) void handleRoleChange(u.id, next)
                        }}
                      >
                        <Label className="sr-only">როლი</Label>
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {roleOptions.map((opt) => (
                              <ListBox.Item key={opt.id} id={opt.id} textValue={opt.label}>
                                {opt.label}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </Table.Cell>

                    <Table.Cell>{publishDate(u.createdAt)}</Table.Cell>

                    <Table.Cell>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="danger-soft"
                        isDisabled={isSelf}
                        onPress={() => {
                          setSelectedUserId(u.id)
                          deleteModal.open()
                        }}
                      >
                        <Icon className="size-4" icon="gravity-ui:trash-bin" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
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

                <Modal.Heading>მომხმარებლის წაშლა</Modal.Heading>
              </Modal.Header>

              <Modal.Body>
                <p className="text-muted text-sm">
                  მომხმარებელი სამუდამოდ წაიშლება ბაზიდან. მის მიერ დაწერილი სტატიებიც წაიშლება. გსურთ
                  გაგრძელება?
                </p>
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="secondary"
                  onPress={() => {
                    deleteModal.close()
                    setSelectedUserId(null)
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
