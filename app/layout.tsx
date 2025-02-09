import '~/styles/tailwind.css'
import { Open_Sans } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '~/components/providers/theme-provider'

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
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
