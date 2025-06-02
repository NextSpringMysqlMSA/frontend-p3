import HomeNavbar from '@/components/layout/homeNavbar'
import {ProfileProvider} from '@/contexts/ProfileContext'
import Reminder from './reminder'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProfileProvider>
      {/* <Reminder /> */}
      <div className="flex flex-col items-center w-full">
        <HomeNavbar />
        <div className="flex flex-col w-full h-full max-w-screen-xl transition-all duration-300">
          {children}
        </div>
      </div>
    </ProfileProvider>
  )
}
