import '~/styles/tailwind.css'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { shadesOfPurple } from '@clerk/themes'
import { ThemeProvider } from '~/components/providers/theme-provider'
import { ModalProvider } from '~/components/providers/modal-provider'
import { SocketProvider } from '~/components/providers/socket-provider'
import { QueryProvider } from '~/components/providers/query-provider'
import StarsBackground from '~/components/layout/stars-background.tsx'

const OpenSansFont = Open_Sans({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={'/'}
      appearance={{
        baseTheme: shadesOfPurple,
      }}
    >
      <html
        lang="zh-CN"
        className={OpenSansFont.className}
        suppressHydrationWarning
      >
        <body className="bg-black">
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
          <StarsBackground />
        </body>
      </html>
    </ClerkProvider>
  )
}
