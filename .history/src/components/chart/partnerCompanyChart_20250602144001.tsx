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
  status: 'REGISTERED' | 'PENDING'
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
          {
            id: 1,
            name: '에코그린 주식회사',
            status: 'REGISTERED',
            registeredAt: '2024-05-01'
          },
          {
            id: 2,
            name: '클린에너지솔루션',
            status: 'PENDING',
            registeredAt: '-'
          },
          {
            id: 3,
            name: '지속가능텍 주식회사',
            status: 'REGISTERED',
            registeredAt: '2024-04-22'
          },
          {
            id: 4,
            name: '블루오션산업',
            status: 'PENDING',
            registeredAt: '-'
          },
          {
            id: 5,
            name: '그린어스코리아',
            status: 'REGISTERED',
            registeredAt: '2024-05-28'
          }
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

  return (
    <CardContent className="p-0">
      {loading ? (
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
              <TableHead>등록상태</TableHead>
              <TableHead className="text-right">등록일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(company => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>
                  {company.status === 'REGISTERED' ? (
                    <span className="font-medium text-green-600">등록 완료</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">{company.registeredAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </CardContent>
  )
}
