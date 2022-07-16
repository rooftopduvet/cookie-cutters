import { MainContent } from '@/src/components/MainContent'
import { translate } from '@/src/i18n'

/*
@description
Default page to show when the route doesn't exist.
*/
export function NotFound(): JSX.Element {
  return (
    <MainContent>
      <div data-testid={'Scene-NotFound'}>
        <h1>{translate('pages.notFound.pageTitle')}</h1>
      </div>
    </MainContent>
  )
}