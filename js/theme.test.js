/* global describe expect test */

import { createCatalystTheme } from './theme'

const defaultTheme = createCatalystTheme()
const standardColors = ['confirm','warn','error']
const standardColorsProperties = ['light','main','dark','contrastLight','contrast','contrastDark']


const standardColorsDefinedTestTable =
  // yeilds: [ ['confirm', 'light' ], ['confirm','main'], ...]
  standardColors.map((series) => {
    return [ standardColorsProperties.map((prop) => [series, prop]) ]
  })
  // flatten 1 level TODO: use '.flat(1)' when available
    .reduce((acc, row) => acc.concat(...row), [])

describe('createCatalystTheme', () => {
  // TODO: document and reference
  test.each(standardColorsDefinedTestTable)(
    "should create standard '%s' color series with '%s' concrete property",
    (series, property) => {
      expect(defaultTheme).toHaveProperty(`palette.${series}.${property}`)
    }
  )
})
