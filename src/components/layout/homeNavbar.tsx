'use client'

import {use, useEffect, useState, useRef} from 'react'
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
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,

} from '../ui/navigation-menu'
import {Separator} from '@radix-ui/react-select'
import { Button } from '../ui/button'
import HomeNavCard from './homeNavCard'
import  ImageCarousel from '@/components/tools/row_dotindicator'
/**
 * 상단 네비게이션 바 컴포넌트
 * ESG 테마와 일치하는 녹색 디자인으로 구현
 */
export default function HomeNavbar() {
  const containerRef = useRef<HTMLDivElement>(null);
  // 상태 관리
  const {profile, fetchProfile} = useProfileStore()
  const {logout} = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const [openMenu, setOpenMenu] = useState<"scope" |"tcfd"|"manage"| null>(null)
  const [prev, setPrev] = useState<string | null>(null)
  
  const handleToggle = (menu: "scope" | "tcfd" | "manage") => {
    console.log(pathname)
    setOpenMenu(prev === menu ? null : menu);
    if (prev === menu) {
      setPrev(null);
    } else {
      setPrev(menu);
    }
  }
  const closeMenu = () => {setOpenMenu(null)
    setPrev(null);
  }

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
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // 허공 클릭: 상태 초기화하거나 전환
        setOpenMenu(null);
        setPrev(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // 사용자 이름 또는 기본값 설정
  const fullName = profile?.name || '사용자'
  const position = profile?.position || '직책 미설정'
  const userInitials = fullName.charAt(0)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full">
      <div className="flex items-center justify-between w-full h-20 px-4 bg-white border-b border-gray-200 shadow-sm lg:px-6">
        {/* 로고 영역 */}
        <div className="flex items-center">
          <Link href="/" className="flex flex-row items-center space-x-2"
          >
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

        {/* --------------------------------------------------------------------------------------------------메뉴 영역 */}
        <NavigationMenu >
          <NavigationMenuList className="flex flex-row items-center justify-center w-full h-full  ">
            <NavigationMenuItem  className="space-x-5">
              <Button
                onClick = {()=> router.push('/home')}
                variant = "ghost"
                className={`px-4 py-2 rounded-full text-base ${
                  pathname === '/home'
                    ? 'bg-customG text-white hover:bg-customG hover:text-white'
                    : 'hover:bg-gray-100'
                }`}>
                HOME
              </Button>
              <Button
                variant = "ghost"
                onClick = {()=>{
                  console.log(openMenu)
                  handleToggle('scope')}}
                className={`px-4 py-2 rounded-full text-base ${
                  pathname === '/scope1' || pathname === '/scope2'
                    ? 'bg-customG text-white hover:bg-customG hover:text-white'
                    : 'hover:bg-gray-100'
                }`}>
                Scope
              </Button>
              <Button
                variant = "ghost"
                onClick = {()=>handleToggle('tcfd')}
                className={`px-4 py-2 rounded-full text-base ${
                  pathname === '/governance' ||
                  pathname === '/strategy' ||
                  pathname === '/goal'
                    ? 'bg-customG text-white hover:bg-customG hover:text-white'
                    : 'hover:bg-gray-100'
                }`}>
                TCFD
              </Button>
              <Button
                onClick = {()=> router.push('/GRI')}
                variant = "ghost"
                className={`px-4 py-2 rounded-full text-base ${
                  pathname === '/GRI'
                    ? 'bg-customG text-white hover:bg-customG hover:text-white'
                    : 'hover:bg-gray-100'
                }`}>
                GRI
              </Button>
              <Button
              onClick = {()=> router.push('/CSDDD')}
                variant = "ghost"
                className={`px-4 py-2 rounded-full text-base ${
                  pathname === '/CSDDD'
                    ? 'bg-customG text-white hover:bg-customG hover:text-white'
                    : 'hover:bg-gray-100'
                }`}>
                공급망실사
              </Button>
              <Button
                variant = "ghost"
                onClick = {()=>handleToggle('manage')}
                className={`px-4 py-2 rounded-full text-base ${
                  pathname === '/managePartner' || pathname === '/financialRisk'
                    ? 'bg-customG text-white hover:bg-customG hover:text-white'
                    : 'hover:bg-gray-100'
                }`}>
                협력사 관리
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        {/* --------------------------------------------------------------------------------------------------메뉴 영역 끝 */}

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
              <button
                className={`flex items-center px-4 py-2 space-x-2 text-gray-700 transition-colors rounded-full hover:bg-gray-100 ${
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
            <DropdownMenuContent align="end" className="w-full  prt123" sideOffset={13.5}>
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
      <div ref = {containerRef} className=" flex-row justify-center flex pointer-events-auto">
        <div
          className={`absolute top-20 transition-opacity duration-300 ${
            openMenu === "scope" ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        ><HomeNavCard description='bg-white'>
          <div className='flex flex-row '>
            <div className='flex flex-col border-r space-y-2 border-gray-300'>
          <Button
              variant="ghost"
                  onClick= {()=> 
                  {
                  router.push('/scope1')
                  closeMenu()
                  }}
                  className="w-full text-base ">
                  <span
                    className={`flex w-full justify-start pr-12 ${
                      pathname === '/scope1' ? 'border-b border-black' : ''
                    }`}>
                    Scope 1
                  </span>
                </Button>
                <Button
                  variant="ghost"
                   onClick= {
                    ()=> {router.push('/scope2')
                  closeMenu()
                   }}
                  className="w-full text-base ">
                  <span
                    className={`flex w-full justify-start pr-12 ${
                      pathname === '/scope2' ? 'border-b border-black' : ''
                    }`}>
                    Scope 2
                  </span>
                </Button>
            </div>
            <div className='justify-start h-full pl-4 '
            style={{ caretColor: "transparent" }}>
              <ImageCarousel imgpath={
                ['/images/scope1.png', '/images/scope2.png']
              }
              />
            </div>
            </div>

          </HomeNavCard>
          </div>
        <div
          className={`absolute top-20 transition-opacity duration-300 ${
            openMenu === "tcfd" ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <HomeNavCard description='bg-white'>
          <div className='flex flex-row '>
            <div className='flex flex-col border-r space-y-2 border-gray-300'>
          <Button
          variant="ghost"
                  onClick= {()=> {router.push('/governance')
                  closeMenu()
                  }}
                  className="w-full text-base ">
                  <span
                    className={`flex w-full justify-start pr-12 ${
                      pathname === '/governance' ? 'border-b border-black' : ''
                    }`}>
                    거버넌스
                  </span>
                </Button>
                <Button
                  variant="ghost"
                   onClick= {()=> {router.push('/strategy')
                    closeMenu()
                   }}
                  className="w-full text-base ">
                  <span
                    className={`flex w-full justify-start pr-12 ${
                      pathname === '/strategy' ? 'border-b border-black' : ''
                    }`}>
                    전략
                  </span>
                </Button>
                <Button
                  variant="ghost"
                   onClick= {()=> {router.push('/goal')
                    closeMenu()
                   }}
                  className="w-full text-base ">
                  <span
                    className={`flex w-full justify-start pr-12 ${
                      pathname === '/goal' ? 'border-b border-black' : ''
                    }`}>
                    목표 및 지표
                  </span>
                </Button>
            </div>
            <div className='justify-start h-full pl-4 '
            style={{ caretColor: "transparent" }}>
              <ImageCarousel imgpath={
                ['/images/governance.gif', '/images/lisk_manage.png', '/images/goal.png']
              }
              />
            </div>
            </div>

          </HomeNavCard>
        </div>
        <div
          className={`absolute top-20 transition-opacity duration-300 ${
            openMenu === "manage" ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
                    <HomeNavCard description='bg-white'>
          <div className='flex flex-row '>
            <div className='flex flex-col border-r space-y-2 border-gray-300'>
          <Button
          variant="ghost"
                  onClick= {()=> {router.push('/managePartner')
                  closeMenu()
                  }}
                  className="w-full text-base ">
                  <span
                    className={`flex w-full justify-start pr-12 ${
                      pathname === '/managePartner' ? 'border-b border-black' : ''
                    }`}>
                    파트너사 관리
                  </span>
                </Button>
                <Button
                  variant="ghost"
                   onClick= {()=> {router.push('/financialRisk')
                    closeMenu()
                   }}
                  className="w-full text-base ">
                  <span
                    className={`flex w-full justify-start pr-12 ${
                      pathname === '/financialRisk' ? 'border-b border-black' : ''
                    }`}>
                    제무제표 리스크 관리
                  </span>
                </Button>
            </div>
            <div className='justify-start h-full pl-4 '
            style={{ caretColor: "transparent" }}>
              <ImageCarousel imgpath={
                ['/images/partner.gif', '/images/partner_manage.png']
              }
              />
            </div>
            </div>

          </HomeNavCard>
        </div>
        </div>
    </header>
    
  )
}
