'use client'

import { authClient } from '@/src/lib/auth-client'
import { publishDate } from '@/src/utils/utils'
import { Card, Chip, Skeleton, toast, Tooltip } from '@heroui/react'
import { FileImage, LogOutIcon, PencilLineIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type ProfileProps = {
  isAdmin: boolean
  isWriter: boolean
}

const Profile = ({ isAdmin, isWriter }: ProfileProps) => {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await authClient.getSession()
      setUser(session?.user)
      setLoading(false)
    }
    fetchSession()
  }, [])

  async function handleSignOut() {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/')
            router.refresh()
          },
        },
      })
    } catch (error) {
      toast.danger('გამოსვლისას დაფიქსირდა შეცდომა')
    }
  }

  if (loading) return <Skeleton className="h-60 w-full rounded-xl" />
  if (!user) return <p className="text-gray-500">მომხმარებელი ვერ მოიძებნა</p>

  return (
    <div className="h-full w-full max-w-2xl">
      <Card variant="transparent" className="border-none bg-transparent shadow-none">
        <Card.Header className="flex-row items-center gap-5 px-0 pb-6">
          <div className="border-divider relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border">
            <Image
              src={user.image || '/default-avatar.png'}
              alt={user.displayName || 'User'}
              className="object-cover"
              fill
            />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-bold tracking-tight">{user.name}</h2>
            <p className="text-default-500 font-medium">@{user.displayName}</p>
          </div>
        </Card.Header>

        <Card.Content className="space-y-6 px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-default-400 text-xs font-bold tracking-wider uppercase">
                ელ-ფოსტა
              </span>
              <span className="text-medium font-medium">{user.email}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-default-400 text-xs font-bold tracking-wider uppercase">
                 რეგისტრაცია გაიარა
              </span>
              <span className="text-medium font-medium">{publishDate(user.createdAt)}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {(isAdmin || isWriter) && (
              <>
                <Link href="/card" className="">
                  <Tooltip closeDelay={0}>
                    <Chip
                      color="success"
                      className="h-10 cursor-pointer gap-2 px-3 transition-transform hover:scale-105 active:scale-95"
                      // onClick={handleSignOut}
                    >
                      <FileImage size={18} />
                      <span className="font-semibold">ქარდის გაკეთება</span>
                    </Chip>
                  </Tooltip>
                </Link>
                <Link href="/write" className="">
                  <Tooltip closeDelay={0}>
                    <Chip
                      color="warning"
                      className="h-10 cursor-pointer gap-2 px-3 transition-transform hover:scale-105 active:scale-95"
                      // onClick={handleSignOut}
                    >
                      <PencilLineIcon size={18} />
                      <span className="font-semibold">სტატიის დაწერა</span>
                    </Chip>
                  </Tooltip>
                </Link>
              </>
            )}
            <div className="">
              <Tooltip closeDelay={0}>
                <Chip
                  color="danger"
                  className="h-10 cursor-pointer gap-2 px-3 transition-transform hover:scale-105 active:scale-95"
                  onClick={handleSignOut}
                >
                  <LogOutIcon size={18} />
                  <span className="font-semibold">ანგარიშიდან გამოსვლა</span>
                </Chip>
              </Tooltip>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default Profile
