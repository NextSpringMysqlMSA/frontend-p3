import {cn} from '@/lib/utils'
import {typeThemeConfig} from './collapsibleWindow'
import React from 'react'

type RowData = {
  id: number
  values: React.ReactNode[]
}

type CustomTableProps = {
  headers: React.ReactNode[]
  data: RowData[]
  type: keyof typeof typeThemeConfig
  theme: (typeof typeThemeConfig)[keyof typeof typeThemeConfig]
  onRowClick?: (
    type: CustomTableProps['type'],
    rowValues: React.ReactNode[],
    rowId: number
  ) => void
  className?: string
}

export default function CustomTable({
  type,
  headers,
  data,
  onRowClick,
  theme,
  className
}: CustomTableProps) {
  return (
    <div className={cn('w-full overflow-hidden border border-gray-200', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr
              className={cn(
                `${theme.bgHeader} ${theme.textColor.replace('600', '800')}`
              )}>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-3 py-3 text-center align-middle border-b border-gray-200',
                    index !== 0 && 'border-l border-gray-200'
                  )}>
                  <div className="flex items-center justify-center text-sm font-semibold">
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-8 text-center text-gray-500 border border-gray-200 bg-gray-50">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              data.map(({id, values}) => (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(type, values, id)} // 클릭 핸들러 수정
                  className={cn(
                    'transition-colors hover:bg-gray-50',
                    onRowClick && `cursor-pointer ${theme.hover}`
                  )}>
                  {values.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        'px-3 py-2.5 text-center text-gray-700 border-b border-gray-200',
                        colIndex !== 0 && 'border-l border-gray-200'
                      )}>
                      <div className="flex items-center justify-center w-full text-sm truncate">
                        {cell ?? '-'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
