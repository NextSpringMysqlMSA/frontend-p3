import NavBar from '@/components/layout/navbar'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <NavBar />
      <div className="flex flex-col flex-1 w-full mt-20">{children}</div>
    </div>
  )
}
