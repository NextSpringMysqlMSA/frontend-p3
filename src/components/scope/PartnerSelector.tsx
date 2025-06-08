'use client'

import {useState, useEffect} from 'react'
import {Check, ChevronsUpDown, Search, Building2} from 'lucide-react'
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
import {PartnerCompany} from '@/types/scope'
import {fetchActivePartnerCompanies, searchPartnerCompanies} from '@/services/partner'

interface PartnerSelectorProps {
  selectedPartnerId?: number
  onSelect: (partner: PartnerCompany | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function PartnerSelector({
  selectedPartnerId,
  onSelect,
  placeholder = '협력사를 선택하세요',
  disabled = false,
  className
}: PartnerSelectorProps) {
  const [open, setOpen] = useState(false)
  const [partners, setPartners] = useState<PartnerCompany[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const selectedPartner = partners.find(p => p.id === selectedPartnerId)

  // 초기 파트너사 목록 로드
  useEffect(() => {
    const loadPartners = async () => {
      setLoading(true)
      try {
        const data = await fetchActivePartnerCompanies()
        setPartners(data)
      } catch (error) {
        console.error('파트너사 목록 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPartners()
  }, [])

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchDebounced = setTimeout(async () => {
        try {
          const searchResults = await searchPartnerCompanies(searchTerm)
          setPartners(searchResults)
        } catch (error) {
          console.error('파트너사 검색 실패:', error)
        }
      }, 300)

      return () => clearTimeout(searchDebounced)
    } else {
      // 검색어가 없으면 전체 목록 다시 로드
      fetchActivePartnerCompanies().then(setPartners)
    }
  }, [searchTerm])

  const handleSelect = (partner: PartnerCompany) => {
    onSelect(partner)
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
                className="ml-auto text-green-700 border-green-200 bg-gradient-to-r from-green-100 to-emerald-100">
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
            {partners.map(partner => (
              <CommandItem
                key={partner.id}
                value={`${partner.name} ${partner.businessNumber} ${partner.companyType}`}
                onSelect={() => handleSelect(partner)}
                className="flex items-center justify-between p-3 m-1 transition-all duration-200 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">
                <div className="flex items-center flex-1 gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{partner.name}</span>
                      <Badge
                        variant={getStatusBadgeVariant(partner.status)}
                        className="text-xs text-green-700 border-green-200 bg-gradient-to-r from-green-100 to-emerald-100">
                        {getStatusText(partner.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {partner.businessNumber} • {partner.companyType}
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
