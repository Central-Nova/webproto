import '@testing-library/jest-dom/extend-expect';
import { generatePages } from '../pagination';

describe('lib: generatePages', () => {
    const tests = [
        {
            current: 1,
            total: 10,
            expectedPages: [4,3,2,1]
        },
        {
            current: 2,
            total: 10,
            expectedPages: [5,4,3,2,1]
        },
        {
            current: 3,
            total: 5,
            expectedPages: [5,4,3,2,1]
        },
        {
            current: 8,
            total: 10,
            expectedPages: [10,9,8,7,6]
        },
        {
            current: 41,
            total: 50,
            expectedPages: [44,43,42,41,40,39]
        }
    ]
    test('generates next three and last three pages in descending order', () => {
        for (let i in tests) {
            let pages = generatePages(tests[i].current, tests[i].total)
            expect(pages).toStrictEqual(tests[i].expectedPages)
        }

    })
})