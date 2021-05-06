import React from 'react'
import {render, cleanup, queryByText} from '@testing-library/react'
import Button from '../../../app/javascript/bundles/YouRadioReact/components/Button'

afterEach(cleanup)
describe('Button', () => {
    it('renders given text', () => {
    const givenText = 'my given text'
    const { container } = render(<Button>{givenText}</Button>)

    expect(queryByText(container, givenText)).toBeTruthy()
    })
})