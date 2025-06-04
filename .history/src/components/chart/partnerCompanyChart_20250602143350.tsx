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
import {fetchPartnerCompanyProgress} from '@/services/dashboard'

interface PartnerCompany {
  id: number
  name: string
  status: 'REGISTERED' | 'PENDING'
  manager: string
  registeredAt: string
}

export default function PartnerCompanyChart({refreshTrigger}: {refreshTrigger: number}) {
  const [data, setData] = useState<PartnerCompany[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const res = await fetchPartnerCompanyProgress()
        setData(res) // API가 리스트를 반환한다고 가정
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
              <TableHead>담당자</TableHead>
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
                    <span className="text-gray-500">미입력</span>
                  )}
                </TableCell>
                <TableCell>{company.manager}</TableCell>
                <TableCell className="text-right">{company.registeredAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </CardContent>
  )
}
