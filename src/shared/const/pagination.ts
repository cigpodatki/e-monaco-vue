export let PAGE_SIZE = 16

export function setPageSize(size: number): void {
    PAGE_SIZE = size
}

// 0 = all rows.
export const ALL_ROWS = 0

const sizes = (...values: number[]) =>
    values.map((value) => ({ value, label: String(value) }))

export const MUNICIPALITY_PAGE_SIZE_OPTIONS = [
    ...sizes(10, 20, 50, 100, 200, 500),
    { value: ALL_ROWS, label: 'Wszystkie' },
]

// No "Wszystkie" for leads: ~18k rows freeze the browser. The API still accepts take=0.
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
