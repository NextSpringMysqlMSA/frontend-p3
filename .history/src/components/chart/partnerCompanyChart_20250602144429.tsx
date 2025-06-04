'use client'

import {useEffect, useState} from 'react'
import {Skeleton} from '@/components/ui/skeleton'
import {Card, CardContent} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

interface PartnerCompany {
  id: number
  name: string
  registeredAt: string
}

export default function PartnerCompanyChart({refreshTrigger}: {refreshTrigger: number}) {
  const [data, setData] = useState<PartnerCompany[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const dummyData: PartnerCompany[] = [
          {id: 1, name: '에코그린 주식회사', registeredAt: '2024-05-01'},
          {id: 2, name: '클린에너지솔루션', registeredAt: '-'},
          {id: 3, name: '지속가능텍 주식회사', registeredAt: '2024-04-22'},
          {id: 4, name: '블루오션산업', registeredAt: '-'},
          {id: 5, name: '그린어스코리아', registeredAt: '2024-05-28'},
          {id: 6, name: '에버에코 주식회사', registeredAt: '2024-03-19'},
          {id: 7, name: '선샤인테크', registeredAt: '-'},
          {id: 8, name: '퓨처에너지', registeredAt: '2024-05-04'},
          {id: 9, name: '넥스트그린', registeredAt: '-'},
          {id: 10, name: '에코리더스', registeredAt: '2024-05-10'},
          {id: 11, name: '바이오플랜', registeredAt: '2024-05-11'},
          {id: 12, name: '솔라플랜트', registeredAt: '-'},
          {id: 13, name: '코리아에코텍', registeredAt: '2024-05-13'},
          {id: 14, name: '지구사랑기업', registeredAt: '-'},
          {id: 15, name: '엘지에너지파트너스', registeredAt: '2024-05-05'},
          {id: 16, name: '에코어스테크', registeredAt: '-'},
          {id: 17, name: '클린에버', registeredAt: '2024-05-09'},
          {id: 18, name: '청정하이텍', registeredAt: '-'},
          {id: 19, name: '바이오넥스트', registeredAt: '2024-05-14'},
          {id: 20, name: '그린테크솔루션', registeredAt: '-'}
        ]
        setData(dummyData)
      } catch (err) {
        console.error('협력사 데이터 로딩 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [refreshTrigger])

  return loading ? (
  <div className="p-4 space-y-2">
    <Skeleton className="w-1/3 h-4" />
    <Skeleton className="w-full h-4" />
    <Skeleton className="w-full h-4" />
  </div>
) : (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>협력사명</TableHead>
        <TableHead className="text-right">등록일</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map(company => (
        <TableRow key={company.id}>
          <TableCell>{company.name}</TableCell>
          <TableCell className="text-right">{company.registeredAt}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)}
   
  )
}
