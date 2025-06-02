'use client'

import {useEffect, useRef, useState} from 'react'
import Home from './home'
import Results from './results'
import DotIndicator from '@/components/tools/dotIndicator'

export default function Page() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<HTMLElement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const sectionCount = 2

  useEffect(() => {
    let isScrolling = false

    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return

      const delta = e.deltaY
      let newIndex = currentIndex

      if (delta > 1 && currentIndex < sectionCount - 1) {
        newIndex = currentIndex + 1
      } else if (delta < -1 && currentIndex > 0) {
        newIndex = currentIndex - 1
      } else {
        return
      }

      isScrolling = true
      setCurrentIndex(newIndex)
      sectionRefs.current[newIndex]?.scrollIntoView({behavior: 'smooth'})

      setTimeout(() => {
        isScrolling = false
      }, 700)
    }

    const container = containerRef.current
    container?.addEventListener('wheel', handleWheel)
    return () => container?.removeEventListener('wheel', handleWheel)
  }, [currentIndex])

  const scrollTo = (index: number) => {
    setCurrentIndex(index)
    sectionRefs.current[index]?.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <div ref={containerRef} className="w-full h-screen overflow-hidden">
      {[...Array(sectionCount)].map((_, i) => (
        <section
          key={i}
          ref={el => {
            if (el) sectionRefs.current[i] = el
          }}
          className="w-full h-full">
          {i === 0 ? <Home /> : <Results />}
        </section>
      ))}

      <DotIndicator
        total={sectionCount}
        currentIndex={currentIndex}
        onDotClick={scrollTo}
      />
    </div>
  )
}
