import { createTheme } from '@/src/theming'
import fonts from '@/src/styles/fonts.scss'

const palette = {
  themePrimary: '#02747a',
  themeLighterAlt: '#f0f9fa',
  themeLighter: '#c5e8ea',
  themeLight: '#98d4d7',
  themeTertiary: '#48aaaf',
  themeSecondary: '#13848a',
  themeDarkAlt: '#02696e',
  themeDark: '#02585d',
  themeDarker: '#014145',
  neutralLighterAlt: '#d4ebee',
  neutralLighter: '#d1e7ea',
  neutralLight: '#c8dee1',
  neutralQuaternaryAlt: '#bacfd1',
  neutralQuaternary: '#b2c5c8',
  neutralTertiaryAlt: '#abbdc0',
  neutralTertiary: '#a19f9d',
  neutralSecondary: '#605e5c',
  neutralPrimaryAlt: '#3b3a39',
  neutralPrimary: '#323130',
  neutralDark: '#201f1e',
  black: '#000000',
  white: '#daf1f4',
}

const theme = createTheme({
  defaultFontStyle: { fontFamily: fonts.contentFont },
  palette
})

const paletteInverted = {
  themePrimary: '#ffffff',
  themeLighterAlt: '#767676',
  themeLighter: '#a6a6a6',
  themeLight: '#c8c8c8',
  themeTertiary: '#d0d0d0',
  themeSecondary: '#dadada',
  themeDarkAlt: '#eaeaea',
  themeDark: '#f4f4f4',
  themeDarker: '#f8f8f8',
  neutralLighterAlt: '#12666a',
  neutralLighter: '#176c70',
  neutralLight: '#1f757a',
  neutralQuaternaryAlt: '#257c80',
  neutralQuaternary: '#2a8185',
  neutralTertiaryAlt: '#43959a',
  neutralTertiary: '#c8c8c8',
  neutralSecondary: '#d0d0d0',
  neutralPrimaryAlt: '#dadada',
  neutralPrimary: '#ffffff',
  neutralDark: '#f4f4f4',
  black: '#f8f8f8',
  white: '#0d5f63',
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