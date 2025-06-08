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
            'w-full justify-between',
            !selectedPartner && 'text-muted-foreground',
            className
          )}
          disabled={disabled}>
          {selectedPartner ? (
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span className="truncate">{selectedPartner.name}</span>
              <Badge
                variant={getStatusBadgeVariant(selectedPartner.status)}
                className="ml-auto">
                {getStatusText(selectedPartner.status)}
              </Badge>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput
            placeholder="협력사 검색..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>
            {loading ? '로딩 중...' : '협력사를 찾을 수 없습니다.'}
          </CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {partners.map(partner => (
              <CommandItem
                key={partner.id}
                value={`${partner.name} ${partner.businessNumber} ${partner.companyType}`}
                onSelect={() => handleSelect(partner)}
                className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{partner.name}</span>
                      <Badge
                        variant={getStatusBadgeVariant(partner.status)}
                        className="text-xs">
                        {getStatusText(partner.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
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
