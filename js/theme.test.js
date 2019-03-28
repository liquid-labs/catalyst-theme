/* global describe expect jest test */

import { createCatalystTheme } from './theme'

const defaultTheme = createCatalystTheme()

const feedbackColors = ['confirm','warn','error']
const feedbackColorsProperties = ['light','main','dark','contrastLight','contrast','contrastDark']
const feedbackColorsDefinedTestTable =
  // yeilds: [ ['confirm', 'light' ], ['confirm','main'], ...]
  feedbackColors.map((series) =>
    [ feedbackColorsProperties.map((prop) => [series, prop]) ])
  // flatten 1 level TODO: use '.flat(1)' when available
    .reduce((acc, row) => acc.concat(...row), [])

const standardColors = ['primary', 'secondary']
const standardColorsProperties = ['light','main','dark','contrastLight','contrastText','contrastDark']
const standardColorsTestTable = // as above
  standardColors.map((series) =>
    [ standardColorsProperties.map((prop) => [series, prop]) ])
    .reduce((acc, row) => acc.concat(...row), [])

describe('createCatalystTheme', () => {
  // TODO: document and reference
  test.each(feedbackColorsDefinedTestTable)(
    "should create standard '%s' color series with '%s' concrete property",
    (series, property) => {
      expect(defaultTheme).toHaveProperty(`palette.${series}.${property}`)
    }
  )

  test.each(standardColorsTestTable)(
    "supports overriding '%s.%s' via environment variable",
    (series, property) => {
      try {
        process.env[`THEME_PALETTE_${series.toUpperCase()}_MAIN`] = '#abc123'
        process.env[`THEME_PALETTE_${series.toUpperCase()}_${property.toUpperCase()}`] = '#abc123'
        const theme = createCatalystTheme()
        expect(theme).toHaveProperty(`palette.${series}.${property}`, '#abc123')
      }
      finally {
        delete process.env[`THEME_PALETTE_${series.toUpperCase()}_MAIN`]
        delete process.env[`THEME_PALETTE_${series.toUpperCase()}_${property.toUpperCase()}`]
      }
    }
  )

  test.each`
    rank         | variant
    ${'PRIMARY'}   | ${'LIGHT'}
    ${'PRIMARY'}   | ${'DARK'}
    ${'SECONDARY'} | ${'LIGHT'}
    ${'SECONDARY'} | ${'DARK'}`(
  `will emit warning if '$rank'-'$variant' configuration provided with no 'MAIN' definition`,
  ({rank, variant}) => {
    const warningSpy = jest.spyOn(console, 'warn').mockImplementation()
    try {
      process.env[`THEME_PALETTE_${rank}_${variant}`] = '#abc123'
      createCatalystTheme()
      expect(warningSpy).toHaveBeenCalledTimes(1)
    }
    finally {
      warningSpy.mockClear()
      delete process.env[`THEME_PALETTE_${rank}_${variant}`]
    }
  })
})
