import '@testing-library/jest-dom/extend-expect'
import { removeEmptyFields, removeEmptyObjects } from '../sanitize';

describe('Lib: removeEmptyFields', () => {
    test('removes empty fields', () => {
        let fields = {
            name: 'danny',
            email: '', 
            phone: 102938901232131,
        }
        removeEmptyFields(fields);
        expect(fields.name).toBe('danny');
        expect(fields.phone).toBe(102938901232131);
        expect(fields.email).toBeFalsy();
    }),
    test('removes empty fields in objects', () => {
        let fields = {
            name: 'danny',
            email: 'danny@mail.com', 
            phone: 102938901232131,
            address: {
                street: '',
                suite: '12'
            }
        }
        removeEmptyFields(fields);
        expect(fields.address.street).toBeFalsy();
        expect(fields.address.suite).toBe('12')
    })
}),
describe('Lib: removeEmptyObjects', () => {
    test('removes empty objects', () => {
        let fields = {
            name: 'danny',
            email: 'danny@mail.com', 
            phone: 102938901232131,
            address: {}
        }
        removeEmptyObjects(fields);
        expect(fields.address).toBeFalsy();
    })
})