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
      <div className="flex flex-col items-center w-full min-h-screen">
        <HomeNavbar />
        <div className="flex flex-col flex-1 w-full max-w-screen-xl mt-20 transition-all duration-300">
          {children}
        </div>
      </div>
    </ProfileProvider>
  )
}
