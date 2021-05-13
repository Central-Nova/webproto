import '@testing-library/jest-dom/extend-expect'
import { filterProfiles, filterDepartments } from '../filter';

describe('lib: filterProfiles', () => {
    let employees = {
        warehouseManager: {
            email: "john@mail.com",
            firstName: "John",
            isVerified: false,
            lastName: "Lee",
            roles: [
                    {   department: "Sales",
                    manager: false,
                    worker: false,
                    _id: "60858b12af99ca0034999d20"},
                    {   department: "Warehouse",
                    manager: true,
                    worker: true,
                    _id: "60858b12af99ca0034999d21"},
                    {   department: "Payments",
                    manager: false,
                    worker: false,
                    _id: "60858b12af99ca0034999d22"},
            ]
        },
        paymentsWorker1: {
            email: "chris@mail.com",
            firstName: "Chris",
            isVerified: false,
            lastName: "Chan",
            roles: [
                {   department: "Sales",
                    manager: false,
                    worker: false,
                    _id: "60858b12af99ca0034999d23"},
                    {   department: "Warehouse",
                    manager: false,
                    worker: false,
                    _id: "60858b12af99ca0034999d24"},
                    {   department: "Payments",
                    manager: false,
                    worker: true,
                    _id: "60858b12af99ca0034999d25"},
            ]
        },
        paymentsWorker2: {
            email: "sally@mail.com",
            firstName: "Sally",
            isVerified: false,
            lastName: "Lee",
            roles: [
                {   department: "Sales",
                    manager: false,
                    worker: false,
                    _id: "60858b12af99ca0034999d26"},
                    {   department: "Warehouse",
                    manager: false,
                    worker: false,
                    _id: "60858b12af99ca0034999d27"},
                    {   department: "Payments",
                    manager: false,
                    worker: true,
                    _id: "60858b12af99ca0034999d28"},
            ]
        }
    }
    const { warehouseManager, paymentsWorker1, paymentsWorker2 } = employees;
    const profiles = [warehouseManager, paymentsWorker1, paymentsWorker2]

    const filterDepartments = [{
        filterName: 'department',
        filterValue: 'Payments'
    }]
    const filters = {
        byDepartment: [{
            filterName: 'department',
            filterValue: 'Payments'
        }],
        byRole: [{
            filterName: 'role',
            filterValue: 'manager'
        }],
        bySearch: [{
            filterName: 'search',
            filterValue: 'sally'
        }],
        bySalesManager: [
            {
                filterName: 'department',
                filterValue: 'Sales'
            },
            {
                filterName: 'role',
                filterValue: 'manager'
            }
        ],
        byWarehouseManager: [
            {
                filterName: 'department',
                filterValue: 'Warehouse'
            },
            {
                filterName: 'role',
                filterValue: 'manager'
            }
        ]
    }

    test('filters by department', () => {
        let newProfiles = filterProfiles(profiles, filters.byDepartment);
        expect(newProfiles.length).toBe(2)
        expect(newProfiles[0].firstName).toBe(paymentsWorker1.firstName);
        expect(newProfiles[1].firstName).toBe(paymentsWorker2.firstName);
    }),
    test('filters by role', () => {
        let newProfiles = filterProfiles(profiles, filters.byRole);
        expect(newProfiles.length).toBe(1)
        expect(newProfiles[0].firstName).toBe(warehouseManager.firstName);
    }),
    test('filters by search', () => {
        let newProfiles = filterProfiles(profiles, filters.bySearch);
        expect(newProfiles.length).toBe(1)
        expect(newProfiles[0].firstName).toBe(paymentsWorker2.firstName);
    }),
    test('filters by role and department: 1 result', () => {
        let newProfiles = filterProfiles(profiles, filters.byWarehouseManager);
        expect(newProfiles.length).toBe(1);
        expect(newProfiles[0].firstName).toBe(warehouseManager.firstName);
    }),
    test('filters by role and department: no result', () => {
        let newProfiles = filterProfiles(profiles, filters.bySalesManager);
        expect(newProfiles.length).toBe(0);
    }),
    test('throws error if filters is not an array', () => {
        expect(() => filterProfiles(profiles, 'filter')).toThrow('Filters must be an Array of objects');
    }),
    test('throws error if filters is an empty array', () => {
        expect(() => filterProfiles(profiles, [])).toThrow('Filters must have at least one object');
    }),
    test('throws error if profiles is not an array', () => {
        expect(() => filterProfiles('profiles', filters.byDepartment)).toThrow('Profiles must be an Array of objects');
    })
}),
describe('lib: filterDepartments', () => {
    const rolesArray = {
        salesWorker: [
                {   department: "Sales",
                manager: false,
                worker: true,
                _id: "60858b12af99ca0034999d26"},
                {   department: "Warehouse",
                manager: false,
                worker: false,
                _id: "60858b12af99ca0034999d27"},
                {   department: "Payments",
                manager: false,
                worker: false,
                _id: "60858b12af99ca0034999d28"}
            ]
        ,
        warehouseManager: [
            {   department: "Sales",
            manager: false,
            worker: false,
            _id: "60858b12af99ca0034999d26"},
            {   department: "Warehouse",
            manager: true,
            worker: false,
            _id: "60858b12af99ca0034999d27"},
            {   department: "Payments",
            manager: false,
            worker: false,
            _id: "60858b12af99ca0034999d28"}
        ],
        noRoles: [
            {   department: "Sales",
            manager: false,
            worker: false,
            _id: "60858b12af99ca0034999d26"},
            {   department: "Warehouse",
            manager: false,
            worker: false,
            _id: "60858b12af99ca0034999d27"},
            {   department: "Payments",
            manager: false,
            worker: false,
            _id: "60858b12af99ca0034999d28"}
        ],
    }

    const roleCriteria = {
        worker: 'worker',
        manager: 'manager'
    }

    test('filters by worker role', () => {
        let departments = filterDepartments(rolesArray.salesWorker, roleCriteria.worker);
        expect(departments.length).toBe(1)
        expect(departments[0]).toBe('Sales');
    }),
    test('filters by manager role', () => {
        let departments = filterDepartments(rolesArray.warehouseManager, roleCriteria.manager);
        expect(departments.length).toBe(1)
        expect(departments[0]).toBe('Warehouse');
    }),
    test('can return no result', () => {
        let departments = filterDepartments(rolesArray.noRoles, roleCriteria.worker);
        expect(departments.length).toBe(0);
    }),
    test('throws error if rolesArray is not an array', () => {
        expect(() => filterDepartments('rolesArray', roleCriteria.worker)).toThrow('Roles must be an Array of objects');
    }),
    test('throws error if roleCriteria is not a string', () => {
        expect(() => filterDepartments(rolesArray.salesWorker,['roleCriteria'] )).toThrow('Criteria must be of type string');
    })
})