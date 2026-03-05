import { getCurrentUser } from '@/src/lib/auth/getCurrentUser'

const page = async () => {
  const user = await getCurrentUser()
  return <div>hello {user?.displayName}</div>
}

export default page
