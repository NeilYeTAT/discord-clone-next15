import { ClerkProvider } from '@clerk/nextjs'
import { shadesOfPurple } from '@clerk/themes'
import { Open_Sans } from 'next/font/google'
import StarsBackground from '~/components/layout/stars-background.tsx'
import { ModalProvider } from '~/components/providers/modal-provider'
import { QueryProvider } from '~/components/providers/query-provider'
import { SocketProvider } from '~/components/providers/socket-provider'
import { ThemeProvider } from '~/components/providers/theme-provider'
import '~/styles/tailwind.css'

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
      afterSignOutUrl="/"
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
            attribute="class"
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
