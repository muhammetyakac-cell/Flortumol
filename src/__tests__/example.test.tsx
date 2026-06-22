import { render, screen } from '@testing-library/react'
import React from 'react'

test('renders hello world', () => {
  render(<div>Hello Test</div>)
  expect(screen.getByText('Hello Test')).toBeInTheDocument()
})
