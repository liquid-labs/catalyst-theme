import { createMuiTheme } from '@material-ui/core/styles'


const configuredColorScheme = (paletteKey, envKey) => {
  if (process.env[`THEME_PALETTE_${envKey}_MAIN`]) {
    const scheme = { main : process.env.THEME_PALETTE_PRIM_MAIN }
    if (!process.env[`THEME_PALETTE_${envKey}_DARK`]) {scheme.dark = process.env[`THEME_PALETTE_${envKey}_DARK`]}
    if (!process.env[`THEME_PALETTE_${envKey}_LIGHT`]) {scheme.light = process.env[`THEME_PALETTE_${envKey}_LIGHT`]}

    return scheme
  }
  else {
    if (process.env[`THEME_PALETTE_${envKey}_DARK`] || process.env[`THEME_PALETTE_${envKey}_LIGHT`]) {
      console.warn("Unexpected palette primary light or dark definition with no main definition. Settings ignored.") // eslint-disable-line no-console
    }
    // This is the material-ui 'indigo' color set as of 2019-01-25
    return envKey == 'PRIM'
      ? {
        dark  : '#2c387e',
        main  : '#3f51b5',
        light : '#6573c3'
      }
      : { main : '#558b2f' } // material UI 'lightGreen' scheme shadded to '800'
  }
}


const createCatalystTheme = (options) => {
  const palette = options.palette || {}
  if (!palette.primary) {palette.primary = configuredColorScheme('primary', 'PRIM')}
  if (!palette.secondary) {palette.secondary = configuredColorScheme('secondary', 'SEC')}

  const theme = createMuiTheme({
    palette    : palette,
    typography : {
      h3 : {
        fontVariation : 'oblique'
      }
    },
    overrides : {
      MuiTooltip : {
        popper : {
          '@media print' : {
            // Without this, the invisible tooltip messes up printing
            display : 'none'
          }
        }
      },
      MuiInput : {
        input : {
          padding : '4px 0 5px' // slightly more compact; was 6 0 7
        }
      },
      MuiMenuItem : {
        root     : {},
        selected : {
          '&:hover' : { backgroundColor : 'red' },
          '&$root'  : {
            backgroundColor : palette.primary.light
          }
        }
      },
      MuiListItem : {
        button : {
          '&:hover' : {
            backgroundColor : 'rgb(195, 238, 164)'
          }
        }
      }
    }
  })

  return theme
}

export {
  createCatalystTheme
}
