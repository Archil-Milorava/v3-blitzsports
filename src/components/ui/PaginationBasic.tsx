'use client'
import { Pagination } from '@heroui/react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export function PaginationBasic({ totalPages }: { totalPages: number }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Number(searchParams.get('page')) || 1

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())

    router.push(`${pathname}?${params.toString()}`)

    window.scrollTo({
      top: 0,
    })
  }

  return (
    <Pagination className="justify-center">
      <Pagination.Content>
        {/* Previous Button */}
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={currentPage === 1}
            onPress={() => handlePageChange(currentPage - 1)}
          >
            <Pagination.PreviousIcon />
            <span>უკან</span>
          </Pagination.Previous>
        </Pagination.Item>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Pagination.Item key={p}>
            <Pagination.Link isActive={p === currentPage} onPress={() => handlePageChange(p)}>
              {p}
            </Pagination.Link>
          </Pagination.Item>
        ))}

        {/* Next Button */}
        <Pagination.Item>
          <Pagination.Next
            isDisabled={currentPage === totalPages}
            onPress={() => handlePageChange(currentPage + 1)}
          >
            <span>შემდეგ</span>
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  )
}
