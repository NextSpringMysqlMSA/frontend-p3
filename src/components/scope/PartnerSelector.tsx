'use client'

import {useState, useEffect, useCallback} from 'react'
import {Check, ChevronsUpDown, Building2} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Badge} from '@/components/ui/badge'
import {cn} from '@/lib/utils'
import {PartnerCompanyForScope} from '@/types/scope'
import {fetchPartnerCompaniesForScope} from '@/services/partnerCompany'

interface PartnerSelectorProps {
  selectedPartnerId?: string | null
  onSelect: (partnerId: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  includeInactive?: boolean
}

export function PartnerSelector({
  selectedPartnerId,
  onSelect,
  placeholder = '협력사를 선택하세요',
  disabled = false,
  className,
  includeInactive = false
}: PartnerSelectorProps) {
  const [open, setOpen] = useState(false)
  const [partners, setPartners] = useState<PartnerCompanyForScope[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const selectedPartner = partners.find(p => p.id === selectedPartnerId)

  // 파트너 회사 데이터를 PartnerCompanyForScope 형식으로 변환하는 함수
  const convertToPartnerCompanyForScope = useCallback(
    (partners: any[]): PartnerCompanyForScope[] => {
      console.log('🔄 변환 전 파트너 데이터:', partners)
      const converted = partners.map(partner => {
        console.log('🔍 개별 파트너 데이터:', partner)
        // PartnerCompany 타입의 필드명들을 우선적으로 사용
        const name =
          partner.companyName || partner.corpName || partner.corp_name || '이름 없음'
        return {
          id: partner.id,
          name: name,
          status: partner.status || 'ACTIVE'
        }
      })
      console.log('✅ 변환 후 파트너 데이터:', converted)
      return converted
    },
    []
  )

  // 파트너사 목록 로드 함수
  const loadPartners = useCallback(
    async (searchQuery: string = '') => {
      setLoading(true)
      try {
        const response = await fetchPartnerCompaniesForScope(
          1,
          100,
          searchQuery,
          includeInactive
        )
        const convertedPartners = convertToPartnerCompanyForScope(response.content)
        setPartners(convertedPartners)
        console.log('✅ 파트너사 목록 로드 완료:', convertedPartners.length, '개')
      } catch (error) {
        console.error('파트너사 목록 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    },
    [includeInactive, convertToPartnerCompanyForScope]
  )

  // 초기 파트너사 목록 로드
  useEffect(() => {
    loadPartners()
  }, [loadPartners])

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPartners(searchTerm)
    }, 300) // 300ms 디바운스

    return () => clearTimeout(timeoutId)
  }, [searchTerm, loadPartners])

  const handleSelect = (partner: PartnerCompanyForScope) => {
    onSelect(partner.id)
    setOpen(false)
  }

  const handleClear = () => {
    onSelect(null)
    setOpen(false)
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'default'
      case 'INACTIVE':
        return 'secondary'
      case 'SUSPENDED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return '활성'
      case 'INACTIVE':
        return '비활성'
      case 'SUSPENDED':
        return '정지'
      default:
        return status
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between bg-white border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200',
            !selectedPartner && 'text-muted-foreground',
            className
          )}
          disabled={disabled}>
          {selectedPartner ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                <Building2 className="w-3 h-3 text-indigo-600" />
              </div>
              <span className="text-gray-800 truncate">{selectedPartner.name}</span>
              <Badge
                variant={getStatusBadgeVariant(selectedPartner.status)}
                className="ml-auto text-xs">
                {getStatusText(selectedPartner.status)}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span>{placeholder}</span>
            </div>
          )}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-white/95 backdrop-blur-sm border border-white/50 shadow-xl">
        <Command>
          <CommandInput
            placeholder="협력사 검색..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="border-0 focus-visible:ring-1 focus-visible:ring-indigo-500"
          />
          <CommandEmpty className="py-6 text-center text-gray-500">
            {loading ? '로딩 중...' : '협력사를 찾을 수 없습니다.'}
          </CommandEmpty>
          <CommandGroup className="p-2 overflow-auto max-h-64">
            {selectedPartner && (
              <CommandItem
                key="clear"
                onSelect={handleClear}
                className="flex items-center justify-center p-3 m-1 text-gray-500 transition-all duration-200 border border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                선택 해제
              </CommandItem>
            )}
            {partners.map(partner => (
              <CommandItem
                key={partner.id}
                value={`${partner.name}`}
                onSelect={() => handleSelect(partner)}
                className="flex items-center justify-between p-3 m-1 transition-all duration-200 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">
                <div className="flex items-center flex-1 gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">
                        {partner.name}
                        {partner.status === 'INACTIVE' && ' (비활성)'}
                      </span>
                      <Badge
                        variant={getStatusBadgeVariant(partner.status)}
                        className="text-xs">
                        {getStatusText(partner.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Check
                  className={cn(
                    'h-4 w-4',
                    selectedPartnerId === partner.id ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
