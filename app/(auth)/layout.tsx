import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen flex-col justify-center items-center">
      {children}
    </main>
  )
}

export default AuthLayout
