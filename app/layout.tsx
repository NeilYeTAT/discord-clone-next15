import '~/styles/tailwind.css'
import { Open_Sans } from 'next/font/google'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const OpenSansFont = Open_Sans({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // * 注意包裹的是 html 喵~
    <ClerkProvider>
      <html lang="en" className={OpenSansFont.className}>
        <body className="h-full">
          {/* <SignedOut>
            <SignInButton />
          </SignedOut> */}
          {/* <SignedIn>
            <UserButton />
          </SignedIn> */}
          {children}v
        </body>
      </html>
    </ClerkProvider>
  )
}
