import FooterSecondary from '@/src/components/footer/FooterSecondary'
import { Surface, Tabs } from '@heroui/react'
import Link from 'next/link'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'

const SignInPage = () => {
  return (
    <main className="flex h-screen w-full flex-col">
      <div>
        <Surface
          variant="secondary"
          className="text-accent hover:text-accent/80 cursor-pointer py-1 pl-6 text-start text-2xl font-extrabold tracking-wider md:text-6xl"
        >
          <Link href="/">BLITZ</Link>
        </Surface>
      </div>
      <div className="flex flex-1 items-start justify-center overflow-scroll pt-2 md:pt-16">
        <Tabs className="w-full max-w-md">
          <Tabs.ListContainer>
            <Tabs.List aria-label="Options">
              <Tabs.Tab id="overview">
                ატორიზაცია
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="analytics">
                რეგისტრაცია
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel className="pt-4" id="overview">
            <SignInForm />
          </Tabs.Panel>
          <Tabs.Panel className="pt-4" id="analytics">
            <SignUpForm />
          </Tabs.Panel>
        </Tabs>
      </div>
      <div>
        <FooterSecondary />
      </div>
    </main>
  )
}

export default SignInPage
