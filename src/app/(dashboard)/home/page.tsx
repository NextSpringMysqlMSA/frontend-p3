import Dashboard from './dashboard'

export const metadata = {
  title: '대시보드',
  description: 'NSMM dashboard page',
  icons: {
    icon: '/icons/leaf.svg'
  }
}

export default function home() {
  return (
    <div className="w-full h-full">
      <Dashboard />
    </div>
  )
}
