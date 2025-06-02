import {Card} from '@/components/ui/card'
import Link from 'next/link'

export default function Results() {
  return (
    <div className="flex flex-col w-full h-full min-h-screen p-4 space-y-4">
      <div className="flex flex-row w-full h-[50%] space-x-4">
        <Link href="/CSDDD">
          <Card className="h-full overflow-hidden transition-shadow w-72 hover:shadow-lg"></Card>
        </Link>
        <Link href="/CSDDD">
          <Card className="h-full overflow-hidden transition-shadow w-72 hover:shadow-lg"></Card>
        </Link>
      </div>
      <div className="flex flex-row w-full h-[50%] space-x-4">
        <Link href="/CSDDD">
          <Card className="h-full overflow-hidden transition-shadow w-72 hover:shadow-lg"></Card>
        </Link>
        <Link href="/CSDDD">
          <Card className="h-full overflow-hidden transition-shadow w-72 hover:shadow-lg"></Card>
        </Link>
        <Link href="/CSDDD">
          <Card className="h-full overflow-hidden transition-shadow w-72 hover:shadow-lg"></Card>
        </Link>
      </div>
    </div>
  )
}
