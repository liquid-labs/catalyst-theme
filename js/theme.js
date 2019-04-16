import { createMuiTheme } from '@material-ui/core/styles'
import merge from 'lodash.merge'

const schemeProperties = [
  'light',
  'main',
  'dark',
  'contrastLight',
  'contrastText',
  'contrastDark',
]

const configuredColorScheme = (colorRank) => {
  if (process.env[`THEME_PALETTE_${colorRank}_MAIN`]) {
    const scheme = { main : process.env[`THEME_PALETTE_${colorRank}_MAIN`] }
    schemeProperties.forEach((pKey) => {
      const eKey = pKey.toUpperCase()
      if (process.env[`THEME_PALETTE_${colorRank}_${eKey}`]) {
        scheme[pKey] = process.env[`THEME_PALETTE_${colorRank}_${eKey}`]
      }
    })

    return scheme
  }
  else {
    // check for irregularities and set defaults
    if (process.env[`THEME_PALETTE_${colorRank}_DARK`] || process.env[`THEME_PALETTE_${colorRank}_LIGHT`]) {
      // eslint-disable-next no-console
      console.warn("Unexpected palette primary light or dark definition with no main definition. Settings ignored.") // eslint-disable-line no-console
    }
    // This is the material-ui 'indigo' color set as of 2019-01-25
    return colorRank === 'PRIMARY'
      ? {
        dark          : '#2c387e',
        main          : '#3f51b5',
        light         : '#6573c3',
        contrastLight : 'white',
        contrastDark  : 'white',
        constrastText : 'white',
      }
      : { // secondary
        main          : '#558b2f', // material UI 'lightGreen' scheme shadded to '800'
        contrastLight : 'white',
        contrastDark  : 'white',
        constrastText : 'white',
      }
  }
}

const standardCatalystThemeOverrides = (palette) => {
  const light = palette.type === 'light'
  // a little lighter (and then darker) than the default
  const bottomLineColorView = light ? 'rgba(0, 0, 0, 0.10)' : 'rgba(255, 255, 255, 0.92)'
  // the defaults at the time of writing
  const bottomLineColorEdit = light ? 'rgba(0, 0, 0, 0.42)' : 'rgba(255, 255, 255, 0.7)'
  return {
    // TODO: the color settings work if only 'main' color is specified.
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
        padding  : '4px 0 2px', // more compact; was 6 0 7
        fontSize : 'calc(1em + 2px)', // and enlarge font
      },
      underline : {
        // Implement 'expanding effect' that the default uses for '$focused' on
        // :hover as well. It looks better, and why have two effects anyway?
        '&:hover:not($disabled):after' : {
          transform : 'scaleX(1)',
        },
        '&:before' : {
          // a bit bolder
          borderBottom : `1px solid ${bottomLineColorEdit}`,
          // longer, linear transition on colors
          transition   : 'border-bottom-color 375ms linear 0ms',
        },
        '&:hover:not($disabled):not($focused):not($error):before' : {
          // This is the other half of getting the 'expanding effect' on :hover.
          // It overrides the default hover rule.
          borderBottom : 'inherit',
        },
        '&$disabled:before' : {
          borderBottomStyle : 'solid', // intead of dotted
          // use our less-contrasting color
          borderBottom      : `1px solid ${bottomLineColorView}`,
        },
      },
    },
    MuiInputLabel : {
      // Our 'disabled' input is a 'view' input and so we want to highlight the
      // label, rather than diminish it.
      root : {
        // It would be preferrable to leave bold only for view (disabled) mode,
        // but 'font-weight' does not transition smoothly, so we hold it
        // constant.
        fontWeight   : 'bold',
        // and reduce contrast to compensate for the boldness
        color        : `${palette.type === 'light' ? 'rgba(0,0,0,.36)' : 'rgba(255,255,255,.80)' }`,
        '&$disabled' : {
          color : `${palette.type === 'light' ? palette.primary.dark : palette.primary.light }`,
        },
        '&$animated' : {
          // use the slow, linear color transform
          transition : 'color 375ms linear 0ms',
        }
      },
    },
    MuiMenuItem : {
      root : {
        "&$selected" : {
          "&:hover" : {
            "backgroundColor" : palette.primary.main
          },
          "&" : {
            "backgroundColor" : palette.primary.light
          }
        }
      },
      selected : {}
    },
    MuiListItem : {
      button : {
        '&:hover' : {
          backgroundColor : palette.primary.main
        }
      }
    },
    MuiSnackbarContent : {
      root : {
        "flexWrap" : "nowrap"
      }
    }
  }
}

const standardCatalystThemeTypography = (palette) => ({
  h3 : {
    color     : palette.primary.dark,
    fontStyle : 'oblique'
  },
  useNextVariants : true
})

const createCatalystTheme = (themeSpec) => {
  const palette = (themeSpec && themeSpec.palette) || {}
  if (!palette.primary) palette.primary = configuredColorScheme('PRIMARY')
  if (!palette.secondary) palette.secondary = configuredColorScheme('SECONDARY')
  if (!palette.type) palette.type = 'light'
  // TODO: document our convention for confirm, light, and dark to use light for
  // background, dark for borders, and main for icons. 'contrastLight' is
  // therefore the standard text color (on a 'light' background).
  // TODO: for the 'inverse' (dark?) theme, that all flips.
  // from: http://paletton.com/#uid=12B0u0kllllaFw0g0qFqFg0w0aF
  palette.confirm = Object.assign({
    light         : '#B8E297',
    main          : '#5E9732',
    dark          : '#214B00',
    contrastLight : '#214B00',
    contrast      : 'black',
    contrastDark  : '#B8E297'
  }, palette.confirm)
  // from http://paletton.com/#uid=11U050kN4zdVTkqZwpw73J5kdBt
  palette.warn = Object.assign({
    light         : '#FEFFC7',
    main          : '#FBFE00',
    dark          : '#C8CB00',
    contrastLight : '#C8CB00',
    contrast      : 'black',
    contrastDark  : '#FEFFC7'
  }, palette.warn)
  // from http://paletton.com/#uid=1050u0kviuIgPGxnwxzxwmLGGfG
  palette.error = Object.assign({
    light         : '#FF8979',
    main          : '#F52105',
    dark          : '#7D0E00',
    contrastLight : '#7D0E00',
    contrast      : 'white',
    contrastDark  : '#FF8979'
  }, palette.error)
  const dangerousBase = themeSpec && themeSpec.usePaletteSecondaryForDangerous
    ? palette.secondary
    : palette.error
  palette.dangerous = Object.assign({}, dangerousBase, palette.dangerous)

  const standardSpec = {
    palette    : palette,
    typography : standardCatalystThemeTypography(palette),
    overrides  : standardCatalystThemeOverrides(palette),
    layout     : {
      header : {
        variant : 'normal', // supports 'dense' and 'none'
        logoURL : 'placeholder',
        logoAltText : 'placehodler image'
      }
    }
  }

  const theme = createMuiTheme(merge(standardSpec, themeSpec || {}))

  if ('placeholder' == theme.layout.header.logoURL) {
    theme.layout.header.logoURL = theme.layout.header.variant == 'normal'
      ? 'https://via.placeholder.com/96x48'
      : 'https://via.placeholder.com/144x36'
  }

  return theme
}

export {
  createCatalystTheme
}
