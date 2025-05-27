'use client'

export default function Arrow({open}: {open: boolean}) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20"
      fill="currentColor">
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  )
}
