const app = require(`./app`)
const supertest = require(`supertest`)
const request = supertest(app)

describe(`Test /data routes`, () => {
    test(`Get data/cyclesMissed return status 200`, async () => {
        const response = await request.get(`/data/cyclesMissed`)
        expect(response.status).toBe(200)
    })
    test(`Get data/generateReportEmail return status 200`, async () => {
        const response = await request.get(`/data/generateReportEmail`)
        expect(response.status).toBe(200)
    })
    test(`Get /data return status 404`, async () => {
        const response = await request.get(`/data`)
        expect(response.status).toBe(404)
    })
})

describe(`checking status logic`, () => {
    
    test(`red`, async () => {
        const dummyData = [
            { rel_name: `Dummy 1`, cycleInterval: 86400, missed_cycles: 100, time_since_refresh_s: 87142 },
        ]
        jest.spyOn(global, `fetch`).mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(dummyData),
            })
        )
        const response = await supertest(app).get(`/data/cyclesMissed`)
        expect(response.body).toEqual([
            {
                name: `Dummy 1`,
                cyclesMissed: 100,
                timeSinceLastRefresh: { hours: 24, minutes: 12, seconds: 22 },
                Status: `red`,
            },
        ])
        expect(response.body).not.toEqual([
            {
                name: `Dummy 1`,
                cyclesMissed: 100,
                timeSinceLastRefresh: { hours: 24, minutes: 12, seconds: 22 },
                Status: `green`,
            },
        ])
        global.fetch.mockRestore()
    })

    test(`yellow`, async () => {
        const dummyData = [
            { rel_name: `Dummy 1`, cycleInterval: 180, missed_cycles: 1, time_since_refresh_s: 300 },
        ]
        jest.spyOn(global, `fetch`).mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(dummyData),
            })
        )
        const response = await supertest(app).get(`/data/cyclesMissed`)
        expect(response.body).toEqual([
            {
                name: `Dummy 1`,
                cyclesMissed: 1,
                timeSinceLastRefresh: { hours: 0, minutes: 5, seconds: 0 },
                Status: `yellow`,
            },
        ])
        expect(response.body).not.toEqual([
            {
                name: `Dummy 1`,
                cyclesMissed: 100,
                timeSinceLastRefresh: { hours: 24, minutes: 12, seconds: 22 },
                Status: `green`,
            },
        ])
        global.fetch.mockRestore()
    })

    test(`green`, async () => {
        const dummyData = [
            { rel_name: `Dummy 1`, cycleInterval: 86400, missed_cycles: 0, time_since_refresh_s: 36610 },
        ]
        jest.spyOn(global, `fetch`).mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve(dummyData),
            })
        )
        const response = await supertest(app).get(`/data/cyclesMissed`)
        expect(response.body).toEqual([
            {
                name: `Dummy 1`,
                cyclesMissed: 0,
                timeSinceLastRefresh: { hours: 10, minutes: 10, seconds: 10 },
                Status: `green`,
            },
        ])
        expect(response.body).not.toEqual([
            {
                name: `Dummy 1`,
                cyclesMissed: 100,
                timeSinceLastRefresh: { hours: 24, minutes: 12, seconds: 22 },
                Status: `red`,
            },
        ])
        global.fetch.mockRestore()
    })
})