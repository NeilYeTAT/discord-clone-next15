import '~/styles/tailwind.css'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '~/components/providers/theme-provider'
import { ModalProvider } from '~/components/providers/modal-provider'
import { SocketProvider } from '~/components/providers/socket-provider'
import { QueryProvider } from '~/components/providers/query-provider'

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
    <ClerkProvider afterSignOutUrl={'/'}>
      <html
        lang="en"
        className={OpenSansFont.className}
        suppressHydrationWarning
      >
        <body className="dark:bg-slate-700 bg-slate-300">
          {/* <SignedOut>
            <SignInButton />
          </SignedOut> */}
          {/* <SignedIn>
            <UserButton />
          </SignedIn> */}
          <ThemeProvider
            attribute={'class'}
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
