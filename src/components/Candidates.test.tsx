import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import Candidates from './Candidates'

const SampleData = {
  data: [
    {
      id: 1,
      name: 'Alvin Satterfield',
      email: 'cornellbartell@connellyleannon.biz',
      birth_date: '1997-09-07',
      year_of_experience: 5,
      position_applied: 'Technician',
      application_date: '2018-07-02',
      status: 'rejected',
    },
    {
      id: 2,
      name: 'Colette Morar',
      email: 'corinnestark@pacocha.co',
      birth_date: '1998-08-03',
      year_of_experience: 3,
      position_applied: 'Designer',
      application_date: '2017-11-18',
      status: 'waiting',
    },
    {
      id: 3,
      name: 'Rosalind Rath DDS',
      email: 'sandyankunding@marks.io',
      birth_date: '1980-03-28',
      year_of_experience: 15,
      position_applied: 'Orchestrator',
      application_date: '2018-01-31',
      status: 'approved',
    },
  ],
}

const server = setupServer(
  rest.get('/candidates', (req, res, ctx) => {
    return res(ctx.json(SampleData))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('loads and display candidates', async () => {
  const { container, getByText } = render(<Candidates endpoint="/candidates" />)

  expect(container.getElementsByClassName('loader').length).toBe(1)

  await waitFor(() => expect(container.getElementsByClassName('table').length).toBe(1))

  expect(container.getElementsByClassName('sortable').length).toBe(3)
  expect(container.getElementsByClassName('filter-input').length).toBe(2)
  expect(container.getElementsByClassName('filter-select').length).toBe(1)
  expect(container.getElementsByClassName('cell name').length).toBe(3)

  fireEvent(
    getByText('Years of Experience'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )

  expect(getByText('Years of Experience').getElementsByClassName('arrow up').length).toBe(1)
  expect(container.getElementsByClassName('cell year_of_experience').length).toBe(3)

  fireEvent(
    getByText('Years of Experience'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
  )

  expect(getByText('Years of Experience').getElementsByClassName('arrow down').length).toBe(1)
  expect(container.getElementsByClassName('cell year_of_experience').length).toBe(3)
})

test('loads and display error message', async () => {
  server.use(
    rest.get('/candidates', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: { code: 500, message: 'Server Error' } }))
    })
  )

  const { container } = render(<Candidates endpoint="/candidates" />)
  expect(container.getElementsByClassName('loader').length).toBe(1)
  await waitFor(() => expect(container.getElementsByClassName('message error').length).toBe(1))
})
