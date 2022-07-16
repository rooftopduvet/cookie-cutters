import { enUS } from './enUS'
import { get } from 'lodash'

/*
@describe
Takes a dot-separated 'path' corresponding to an element of
a AppStrings object (e.g. 'pages.home.pageTitle') and translates
it into the current language.
*/
export function translate(path: string): string | null {
  const strings = enUS as any
  return get(strings, path, null)
}