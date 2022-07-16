import { Home } from '@/src/scenes/Home'
import { translate } from '@/src/i18n'

export type AppRoute = {
  key: string,
  title: string,
  href: string,
  icon?: string,
  exact?: boolean,
  hidden?: boolean,
  disabled?: boolean,
  component?: React.ComponentType<any>,
}

export type AppRedirect = {
  key: string,
  from: string,
  to: string,
  exact?: boolean,
}

export const routes: { [name: string]: AppRoute } = {
  home: {
    key: 'home',
    title: translate('pages.home.pageTitle'),
    href: '/',
    exact: true,
    hidden: true,
    component: Home,
  },
}

export const redirects: { [name: string]: AppRedirect } = {
  home: {
    key: 'home-redirect',
    from: '/home',
    to: '/',
  }
}