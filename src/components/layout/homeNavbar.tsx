'use client'

import {use, useEffect, useState} from 'react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {Avatar, AvatarImage, AvatarFallback} from '@/components/ui/avatar'
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card'
import {useProfileStore} from '@/stores/profileStore'
import {useAuthStore} from '@/stores/authStore'
import {useRouter, usePathname} from 'next/navigation'
import {ChevronDown, LogOut, User, Leaf} from 'lucide-react'
import {motion} from 'framer-motion'

/**
 * 상단 네비게이션 바 컴포넌트
 * ESG 테마와 일치하는 녹색 디자인으로 구현
 */
export default function HomeNavbar() {
  // 상태 관리
  const {profile, fetchProfile} = useProfileStore()
  const {logout} = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const [TCFDOpen, setTCFDOpen] = useState(false)
  const [partnerOpen, setPartnerOpen] = useState(false)
  const [scopeOpen, setScopeOpen] = useState(false)
  const pathname = usePathname()
  /**
   * 로그아웃 처리 함수
   */
  const handleLogout = () => {
    logout()
    localStorage.removeItem('auth-storage')
    router.push('/login')
  }

  // 프로필 정보 가져오기
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  // 사용자 이름 또는 기본값 설정
  const fullName = profile?.name || '사용자'
  const position = profile?.position || '직책 미설정'
  const userInitials = fullName.charAt(0)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="flex items-center justify-between w-full h-20 px-4 bg-white border-b border-gray-200 shadow-sm lg:px-6">
        {/* 로고 영역 */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-customG">
              <Leaf className="text-white" size={20} />
            </div>
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.2}}
              className="hidden md:flex md:flex-col">
              <span className="text-xl tracking-tight font-gmBold text-customGTextLight">
                NSMM
              </span>
              <span className="-mt-1 text-xs font-medium text-customG">Dashboard</span>
            </motion.div>
          </Link>
        </div>

        {/* --------------------------------------------------------------------------------------------------메뉴 영역 */}
        <div className="flex flex-row items-center justify-center w-full h-full space-x-4 ">
          {/* 대시보드 ===================================================== */}
          <Link href="/home">
            <div
              className={`px-4 py-2 text-sm rounded-full ${
                pathname === '/home' ? 'bg-customG text-white' : 'hover:bg-gray-100'
              }`}>
              HOME
            </div>
          </Link>
          {/* TCFD ===================================================== */}
          <DropdownMenu open={TCFDOpen} onOpenChange={setTCFDOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex flex-row items-center px-4 py-2 text-sm rounded-full ${
                  pathname === '/governance' ||
                  pathname === '/strategy' ||
                  pathname === '/goal'
                    ? 'bg-customG text-white'
                    : 'hover:bg-gray-100'
                }`}>
                TCFD
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 pt-3" sideOffset={13.5}>
              <DropdownMenuSeparator className="md:hidden" />

              <Link href="/governance">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <span
                    className={`${
                      pathname === '/governance' ? 'border-b border-black' : ''
                    }`}>
                    거버넌스
                  </span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <Link href="/strategy">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <span
                    className={`${
                      pathname === '/strategy' ? 'border-b border-black' : ''
                    }`}>
                    전략
                  </span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <Link href="/goal">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <span
                    className={`${pathname === '/goal' ? 'border-b border-black' : ''}`}>
                    목표 및 지표
                  </span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* GRI ===================================================== */}
          <Link href="/GRI">
            <div
              className={`px-4 py-2 text-sm rounded-full ${
                pathname === '/GRI' ? 'bg-customG text-white' : 'hover:bg-gray-100'
              }`}>
              GRI
            </div>
          </Link>
          {/* Scope ===================================================== */}
          <DropdownMenu open={scopeOpen} onOpenChange={setScopeOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex flex-row items-center px-4 py-2 text-sm rounded-full ${
                  pathname === '/managePartner' || pathname === '/financialRisk'
                    ? 'bg-customG text-white'
                    : 'hover:bg-gray-100'
                }`}>
                Scope
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 pt-3" sideOffset={13.5}>
              <DropdownMenuSeparator className="md:hidden" />

              <Link href="/managePartner">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <span
                    className={`${
                      pathname === '/managePartner' ? 'border-b border-black' : ''
                    }`}>
                    Scope 1
                  </span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <Link href="/financialRisk">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <span
                    className={`${
                      pathname === '/financialRisk' ? 'border-b border-black' : ''
                    }`}>
                    Scope 2
                  </span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* 공급망 실사 ===================================================== */}
          <Link href="/CSDDD">
            <div
              className={`px-4 py-2 text-sm rounded-full ${
                pathname === '/CSDDD' ? 'bg-customG text-white' : 'hover:bg-gray-100 '
              }`}>
              공급망 실사
            </div>
          </Link>
          {/* 협력사 관리 ===================================================== */}
          <DropdownMenu open={partnerOpen} onOpenChange={setPartnerOpen}>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex flex-row items-center px-4 py-2 text-sm rounded-full ${
                  pathname === '/managePartner' || pathname === '/financialRisk'
                    ? 'bg-customG text-white'
                    : 'hover:bg-gray-100'
                }`}>
                협력사 관리
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 pt-3" sideOffset={13.5}>
              <DropdownMenuSeparator className="md:hidden" />

              <Link href="/managePartner">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <span
                    className={`${
                      pathname === '/managePartner' ? 'border-b border-black' : ''
                    }`}>
                    파트너사 관리
                  </span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <Link href="/financialRisk">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <span
                    className={`${
                      pathname === '/financialRisk' ? 'border-b border-black' : ''
                    }`}>
                    재무제표 리스크 관리
                  </span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 우측 메뉴 영역 */}
        <div className="flex items-center space-x-4">
          {/* 구분선 */}
          <div className="hidden h-6 border-l border-gray-300 md:block" />

          {/* 프로필 섹션 */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="flex items-center transition-opacity rounded-full hover:opacity-80">
                <Avatar className="border-2 w-9 h-9 border-customGBorder">
                  {profile?.profileImageUrl ? (
                    <AvatarImage
                      src={profile.profileImageUrl}
                      alt={fullName}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-white bg-customGDark">
                      {userInitials}
                    </AvatarFallback>
                  )}
                </Avatar>
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="p-4 w-80" align="end">
              <div className="flex space-x-4">
                <Avatar className="w-16 h-16 border-2 border-customGBorder">
                  {profile?.profileImageUrl ? (
                    <AvatarImage
                      src={profile.profileImageUrl}
                      alt={fullName}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-xl text-white bg-customGDark">
                      {userInitials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-1">
                  <h4 className="text-lg font-semibold">{fullName}</h4>
                  <p className="text-sm text-gray-500">{position}</p>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-gray-100">
                <div className="grid gap-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">이메일</span>
                    <span className="font-medium">
                      {profile?.email || '이메일 미설정'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">연락처</span>
                    <span className="font-medium">
                      {profile?.phoneNumber || '연락처 미설정'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Link
                  href="/account"
                  className="text-xs text-customG hover:text-customGTextLight hover:underline">
                  프로필 관리
                </Link>
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* 드롭다운 메뉴 */}
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors rounded-full hover:bg-gray-100">
                <span className="hidden md:inline-block max-w-[120px] truncate">
                  {fullName}
                </span>
                {/* <ChevronDown
                  size={16}
                  className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                /> */}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 pt-3" sideOffset={13.5}>
              <div className="flex items-center gap-2 p-2 md:hidden">
                <Avatar className="w-8 h-8">
                  {profile?.profileImageUrl ? (
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${profile.profileImageUrl}`}
                      alt={fullName}
                    />
                  ) : (
                    <AvatarFallback className="text-white bg-customGDark">
                      {userInitials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{fullName}</span>
                  <span className="text-xs text-gray-500">{position}</span>
                </div>
              </div>

              <DropdownMenuSeparator className="md:hidden" />

              <Link href="/account">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                  <User size={16} />
                  <span>내 프로필</span>
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="gap-2 text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50">
                <LogOut size={16} />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
