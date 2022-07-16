import { createTheme } from '@/src/theming'
import fonts from '@/src/styles/fonts.scss'

const palette = {
  themePrimary: '#00803e',
  themeLighterAlt: '#f0faf5',
  themeLighter: '#c5ebd7',
  themeLight: '#98d9b7',
  themeTertiary: '#47b37b',
  themeSecondary: '#118f4e',
  themeDarkAlt: '#007337',
  themeDark: '#00612f',
  themeDarker: '#004723',
  neutralLighterAlt: '#f3f6f8',
  neutralLighter: '#eff2f4',
  neutralLight: '#e5e9ea',
  neutralQuaternaryAlt: '#d6d9da',
  neutralQuaternary: '#cccfd0',
  neutralTertiaryAlt: '#c4c7c8',
  neutralTertiary: '#a19f9d',
  neutralSecondary: '#605e5c',
  neutralPrimaryAlt: '#3b3a39',
  neutralPrimary: '#323130',
  neutralDark: '#201f1e',
  black: '#000000',
  white: '#fafdff',
}

const theme = createTheme({
  defaultFontStyle: { fontFamily: fonts.contentFont },
  palette
})

const paletteInverted = {
  themePrimary: '#02e879',
  themeLighterAlt: '#000905',
  themeLighter: '#002513',
  themeLight: '#014624',
  themeTertiary: '#018b49',
  themeSecondary: '#02cc6a',
  themeDarkAlt: '#1aea85',
  themeDark: '#3bee97',
  themeDarker: '#6cf2b1',
  neutralLighterAlt: '#2b363c',
  neutralLighter: '#323e44',
  neutralLight: '#3d4a51',
  neutralQuaternaryAlt: '#445259',
  neutralQuaternary: '#49585f',
  neutralTertiaryAlt: '#63737a',
  neutralTertiary: '#c8c8c8',
  neutralSecondary: '#d0d0d0',
  neutralPrimaryAlt: '#dadada',
  neutralPrimary: '#ffffff',
  neutralDark: '#f4f4f4',
  black: '#f8f8f8',
  white: '#242e33',
}

const themeInverted = createTheme({
  defaultFontStyle: { fontFamily: fonts.contentFont },
  palette: paletteInverted,
})

export {
  palette,
  theme,
  paletteInverted,
  themeInverted,
}