export const generatePages = (current, total) => {
    const floor = current - 3 < 0 ? 0 : current -3
    const start = current + 3 > total ? total : current + 3
    let pages = []

    // Generate pages from total to current
    for (let i = start; i >floor; i--) {
    pages.push(i)
    }

    return pages
}