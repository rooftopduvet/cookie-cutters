import { MainContent } from "@/src/components/MainContent"
import { translate } from '@/src/i18n'
import classNames from './Home.scss'

/*
@description
Home-Page/Dashboard area.
Nothing on this page at the moment as we just show an expanded header.
*/
export function Home(): JSX.Element {
  return (
    <MainContent>
      <div data-testid={'Scene-Home'}>
        <h1>{translate('pages.home.pageTitle')}</h1>
      </div>
    </MainContent>
  )
}