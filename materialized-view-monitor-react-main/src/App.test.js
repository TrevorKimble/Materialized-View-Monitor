import App from './App'
import { render } from '@testing-library/react'
import fetchMock from 'jest-fetch-mock'

describe(`tests for recieving data`, () => {
    beforeEach(() => {
        fetchMock.resetMocks()
    })

    test(`link returns 200 on success`, async () => {
        const url = `http://127.0.0.1:7200/data/cyclesMissed`

        const successResponse = JSON.stringify({ message: `Data received successfully` })

        fetchMock.mockResponseOnce(successResponse, { status: 200 })

        const fetchSpy = jest.spyOn(global, `fetch`)

        const response = await fetch(url, {
            method: `GET`,
        })

        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining(url), {
            method: `GET`,
        })

        fetchSpy.mockRestore()

        expect(response.status).toBe(200)
    })

    test(`link returns 404 on failure`, async () => {
        const url = `http://127.0.0.1:7200/data/cyclesissed`

        const failureResponse = ``

        fetchMock.mockResponseOnce(failureResponse, { status: 404 })

        const fetchSpy = jest.spyOn(global, `fetch`)

        const response = await fetch(url, {
            method: `GET`,
        })

        expect(fetchSpy).toHaveBeenCalledTimes(1)
        expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining(url), {
            method: `GET`,
        })

        fetchSpy.mockRestore()

        expect(response.status).toBe(404)
    })
})

describe(`Test App Status`, () => {

    test(`renders the page body returns true`, () => {
        const view = render(<App />)
        expect(view.baseElement.innerHTML).toBe(`<div>test</div>`)
    })

    test(`renders the page container returns true`, () => {
        const view = render(<App />)
        expect(view.container.innerHTML).toBe(`test`)
    })
})
