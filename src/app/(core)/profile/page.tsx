import { auth } from '@/src/lib/auth'
import { Tabs } from '@heroui/react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Profile from './Profile'
import MyArticles from './MyArticles'
import ManageUsers from './ManageUsers'

const page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) redirect('/auth')

  const currentUser = session.user
  const isAdmin = currentUser.role === 'admin'
  const isAuthor = currentUser.role === 'author'

  console.log(session)

  return (
    <div className="flex min-h-screen w-full flex-col px-2 py-10 sm:px-4 md:px-10 lg:px-14 xl:px-40">
      <Tabs className="w-full">
        <Tabs.ListContainer className="max-w-md">
          <Tabs.List aria-label="Options">
            <Tabs.Tab id="profile">
              პროფილი
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="articles">
              <Tabs.Separator />
              სტატიები
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="users">
              <Tabs.Separator />
              მომხმარებლები
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="w-full pt-4" id="profile">
          <Profile />
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="articles">
          <MyArticles />
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="users">
          <ManageUsers />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default page
