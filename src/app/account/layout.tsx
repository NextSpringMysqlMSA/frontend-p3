import {ReactNode} from 'react'
import {ProfileProvider} from '@/contexts/ProfileContext'
import HomeNavbar from '@/components/layout/homeNavbar'

export default function AccountLayout({children}: {children: ReactNode}) {
  return (
    <ProfileProvider>
      <div className="flex flex-col">
        <HomeNavbar />
        <div className="mt-24">{children}</div>
      </div>
    </ProfileProvider>
  )
}
