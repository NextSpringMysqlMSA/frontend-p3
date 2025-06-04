import {Card} from '@/components/ui/card'
import Link from 'next/link'

export default function Results() {
  return (
    <div className="flex flex-col w-full h-screen min-h-screen p-4 pt-24 space-y-4">
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
        <motion.div variants={itemVariants}>
          <Link href="/CSDDD">
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-amber-600" />
                    <span className="text-xl text-amber-800">공급망 실사 자가진단</span>
                  </CardTitle>
                  <Badge variant="outline" className="text-amber-700 bg-amber-50">
                    실시간 데이터
                  </Badge>
                </div>
                <CardDescription>(EU공급망 / 인권 / 환경) 실사 위반 현황</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center pt-2 h-60">
                <div className="flex flex-col gap-3 w-[280px]">
                  {mounted && <CsdddChart refreshTrigger={refreshTrigger} />}
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        <Link href="/CSDDD">
          <Card className="h-full overflow-hidden transition-shadow w-72 hover:shadow-lg"></Card>
        </Link>
      </div>
    </div>
  )
}
