export let PAGE_SIZE = 16

export function setPageSize(size: number): void {
    PAGE_SIZE = size
}

// Page size 0 = all rows; the backend then applies no limit.
export const ALL_ROWS = 0

const sizes = (...values: number[]) =>
    values.map((value) => ({ value, label: String(value) }))

// Page-size choices (CR task 7).
export const MUNICIPALITY_PAGE_SIZE_OPTIONS = [
    ...sizes(10, 20, 50, 100, 200, 500),
    { value: ALL_ROWS, label: 'Wszystkie' },
]

// No "Wszystkie" for leads: ~18k rows freeze the browser while the table is
// built (~22 inputs/dropdowns per row). The backend still accepts take=0.
export const COMPANY_PAGE_SIZE_OPTIONS = sizes(
    10,
    20,
    50,
    100,
    200,
    500,
    1000,
    1500,
)

export function getPagesCount(count: number, pageSize: number): number {
    return pageSize === ALL_ROWS ? 1 : Math.ceil(count / pageSize)
}
