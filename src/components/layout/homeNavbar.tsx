'use client'

import {useEffect, useState, useRef} from 'react'
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
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem
} from '../ui/navigation-menu'
import {Button} from '../ui/button'
import HomeNavCard from './homeNavCard'
import ImageCarousel from '@/components/tools/row_dotindicator'

const getActiveTab = (pathname: string): string => {
  if (pathname === '/home') return 'home'
  if (pathname.startsWith('/scope')) return 'scope'
  if (
    pathname.startsWith('/governance') ||
    pathname.startsWith('/strategy') ||
    pathname.startsWith('/goal')
  )
    return 'tcfd'
  if (pathname === '/GRI') return 'gri'
  if (pathname === '/CSDDD') return 'csddd'
  if (pathname.startsWith('/managePartner') || pathname.startsWith('/financialRisk'))
    return 'manage'
  return ''
}

export default function HomeNavbar() {
  const containerRef = useRef<HTMLDivElement>(null)
  const {profile, fetchProfile} = useProfileStore()
  const {logout} = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<'scope' | 'tcfd' | 'manage' | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const [selectedTab, setSelectedTab] = useState<string>(() => getActiveTab(pathname))

  useEffect(() => {
    setSelectedTab(getActiveTab(pathname))
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
        setSelectedTab(getActiveTab(pathname))
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [pathname])

  const handleToggle = (menu: 'scope' | 'tcfd' | 'manage') => {
    if (openMenu === menu) {
      setOpenMenu(null)
      setSelectedTab(getActiveTab(pathname))
    } else {
      setOpenMenu(menu)
      setSelectedTab(menu)
    }
  }
  const closeMenu = () => {
    setOpenMenu(null)
    setSelectedTab(getActiveTab(pathname))
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem('auth-storage')
    router.push('/login')
  }

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const fullName = profile?.name || '사용자'
  const position = profile?.position || '직책 미설정'
  const userInitials = fullName.charAt(0)

  // 하위탭: customG 절대 적용X, 선택된 경우만 밑줄, 나머진 회색hover
  const SubMenuButton = ({
    onClick,
    isActive,
    children
  }: {
    onClick: () => void
    isActive: boolean
    children: React.ReactNode
  }) => (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`p-0 hover:bg-gray-100`}
      style={isActive ? {fontWeight: 600} : {}}>
      <span className="flex px-4 py-2 transition-colors rounded-lg">
        <span className={isActive ? 'border-b-2 border-black' : ''}>{children}</span>
      </span>
    </Button>
  )

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-md">
      <div className="flex items-center justify-between w-full h-20 px-4 border-b border-gray-200 lg:px-6">
        {/* 로고 영역 */}
        <div className="flex items-center">
          <Link href="/" className="flex flex-row items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-customG">
              <Leaf className="text-white" size={20} />
            </div>
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.2}}
              className="hidden text-center md:flex md:flex-col">
              <span className="text-2xl font-bold tracking-tight text-customGTextLight">
                NSMM
              </span>
              <span className="-mt-1 text-sm font-medium text-customG">Dashboard</span>
            </motion.div>
          </Link>
        </div>

        {/* ----------- 메뉴 영역 ----------- */}
        <NavigationMenu>
          <NavigationMenuList className="flex flex-row items-center justify-center w-full h-full">
            <NavigationMenuItem className="space-x-5">
              {/* HOME */}
              <Button
                onClick={() => {
                  setSelectedTab('home')
                  router.push('/home')
                  closeMenu()
                }}
                variant="ghost"
                className={`px-4 py-2 rounded-full text-base
                  ${
                    selectedTab === 'home'
                      ? 'bg-customG text-white hover:bg-customG hover:text-white !hover:text-white'
                      : 'hover:bg-gray-100'
                  }
                `}>
                HOME
              </Button>
              {/* Scope */}
              <Button
                variant="ghost"
                onClick={() => handleToggle('scope')}
                className={`px-4 py-2 rounded-full text-base
                  ${
                    selectedTab === 'scope'
                      ? 'bg-customG text-white hover:bg-customG hover:text-white !hover:text-white'
                      : 'hover:bg-gray-100'
                  }
                `}>
                Scope
              </Button>
              {/* TCFD */}
              <Button
                variant="ghost"
                onClick={() => handleToggle('tcfd')}
                className={`px-4 py-2 rounded-full text-base
                  ${
                    selectedTab === 'tcfd'
                      ? 'bg-customG text-white hover:bg-customG hover:text-white !hover:text-white'
                      : 'hover:bg-gray-100'
                  }
                `}>
                TCFD
              </Button>
              {/* GRI */}
              <Button
                onClick={() => {
                  setSelectedTab('gri')
                  router.push('/GRI')
                  closeMenu()
                }}
                variant="ghost"
                className={`px-4 py-2 rounded-full text-base
                  ${
                    selectedTab === 'gri'
                      ? 'bg-customG text-white hover:bg-customG hover:text-white !hover:text-white'
                      : 'hover:bg-gray-100'
                  }
                `}>
                GRI
              </Button>
              {/* 공급망실사 */}
              <Button
                onClick={() => {
                  setSelectedTab('csddd')
                  router.push('/CSDDD')
                  closeMenu()
                }}
                variant="ghost"
                className={`px-4 py-2 rounded-full text-base
                  ${
                    selectedTab === 'csddd'
                      ? 'bg-customG text-white hover:bg-customG hover:text-white !hover:text-white'
                      : 'hover:bg-gray-100'
                  }
                `}>
                공급망실사
              </Button>
              {/* 협력사 관리 */}
              <Button
                variant="ghost"
                onClick={() => handleToggle('manage')}
                className={`px-4 py-2 rounded-full text-base
                  ${
                    selectedTab === 'manage'
                      ? 'bg-customG text-white hover:bg-customG hover:text-white !hover:text-white'
                      : 'hover:bg-gray-100'
                  }
                `}>
                협력사 관리
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* ------------------- 우측 메뉴 영역 ------------------- */}
        <div className="flex items-center space-x-4">
          {/* 구분선 */}
          <div className="hidden h-6 border-l border-gray-300 md:block" />
          {/* 프로필 */}
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
              <button
                className={`flex items-center px-4 py-2 space-x-2 text-gray-700 transition-colors rounded-full ${
                  dropdownOpen ? 'bg-customG text-white' : ''
                }`}>
                <span className="hidden md:inline-block max-w-[120px] truncate">
                  {fullName}
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-full prt123" sideOffset={13.5}>
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
                className="gap-2 text-red-300 cursor-pointer hover:text-red-700 hover:bg-red-50">
                <LogOut size={16} />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 드롭다운 메뉴 컨테이너 - 배경색 추가 및 그림자 제거 */}
      <div ref={containerRef} className="relative bg-white">
        <div className="flex flex-row justify-center">
          {/* Scope 드롭다운 */}
          <div
            className={`absolute w-full max-w-3xl transition-all duration-300 ${
              openMenu === 'scope'
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible -translate-y-2'
            }`}>
            <HomeNavCard description="bg-white border-none">
              <div className="flex flex-row ">
                <div className="flex flex-col space-y-2 border-r border-gray-300">
                  <SubMenuButton
                    onClick={() => {
                      setSelectedTab('scope')
                      router.push('/scope1')
                      closeMenu()
                    }}
                    isActive={pathname === '/scope1'}>
                    Scope 1
                  </SubMenuButton>
                  <SubMenuButton
                    onClick={() => {
                      setSelectedTab('scope')
                      router.push('/scope2')
                      closeMenu()
                    }}
                    isActive={pathname === '/scope2'}>
                    Scope 2
                  </SubMenuButton>
                </div>
                <div
                  className="justify-start h-full pl-4"
                  style={{caretColor: 'transparent'}}>
                  <ImageCarousel imgpath={['/images/scope1.png', '/images/scope2.png']} />
                </div>
              </div>
            </HomeNavCard>
          </div>

          {/* TCFD 드롭다운 */}
          <div
            className={`absolute w-full max-w-3xl transition-all duration-300 ${
              openMenu === 'tcfd'
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible -translate-y-2'
            }`}>
            <HomeNavCard description="bg-white border-none">
              <div className="flex flex-row ">
                <div className="flex flex-col space-y-2 border-r border-gray-300">
                  <SubMenuButton
                    onClick={() => {
                      setSelectedTab('tcfd')
                      router.push('/governance')
                      closeMenu()
                    }}
                    isActive={pathname === '/governance'}>
                    거버넌스
                  </SubMenuButton>
                  <SubMenuButton
                    onClick={() => {
                      setSelectedTab('tcfd')
                      router.push('/strategy')
                      closeMenu()
                    }}
                    isActive={pathname === '/strategy'}>
                    전략
                  </SubMenuButton>
                  <SubMenuButton
                    onClick={() => {
                      setSelectedTab('tcfd')
                      router.push('/goal')
                      closeMenu()
                    }}
                    isActive={pathname === '/goal'}>
                    목표 및 지표
                  </SubMenuButton>
                </div>
                <div
                  className="justify-start h-full pl-4"
                  style={{caretColor: 'transparent'}}>
                  <ImageCarousel
                    imgpath={[
                      '/images/governance.gif',
                      '/images/lisk_manage.png',
                      '/images/goal.png'
                    ]}
                  />
                </div>
              </div>
            </HomeNavCard>
          </div>

          {/* 협력사 관리 드롭다운 */}
          <div
            className={`absolute w-full max-w-3xl transition-all duration-300 ${
              openMenu === 'manage'
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible -translate-y-2'
            }`}>
            <HomeNavCard description="bg-white border-none">
              <div className="flex flex-row ">
                <div className="flex flex-col space-y-2 border-r border-gray-300">
                  <SubMenuButton
                    onClick={() => {
                      setSelectedTab('manage')
                      router.push('/managePartner')
                      closeMenu()
                    }}
                    isActive={pathname === '/managePartner'}>
                    파트너사 관리
                  </SubMenuButton>
                  <SubMenuButton
                    onClick={() => {
                      setSelectedTab('manage')
                      router.push('/financialRisk')
                      closeMenu()
                    }}
                    isActive={pathname === '/financialRisk'}>
                    재무제표 리스크 관리
                  </SubMenuButton>
                </div>
                <div
                  className="justify-start h-full pl-4"
                  style={{caretColor: 'transparent'}}>
                  <ImageCarousel
                    imgpath={['/images/partner.gif', '/images/partner_manage.png']}
                  />
                </div>
              </div>
            </HomeNavCard>
          </div>
        </div>
      </div>
    </header>
  )
}
