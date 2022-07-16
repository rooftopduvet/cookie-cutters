import { Link } from '@/src/components/Link'
import { Logo } from '@/src/components/Logo'
import { translate } from '@/src/i18n'
import classNames from './Header.scss'

export type HeaderNavItem = {
  key: string,
  title: string,
  onClick: (e: React.SyntheticEvent) => void,
  hidden?: boolean,
  disabled?: boolean,
}

export interface HeaderProps {
  navItems: HeaderNavItem[],
}

/* 
@ description
Main header for the app.
*/
export function Header(props: HeaderProps): JSX.Element {
  const navItems = props.navItems.filter(x => !x.hidden)

  return (
    <header data-testid={'Header'}>
      <div className={classNames['root']}>
        <div className={classNames['inner-wrapper']}>
          <Logo className={classNames['logo']} />
          <nav
            className={classNames['navigation']}
            aria-label={translate('header.navigation')}
            data-testid={'Header-navigation'}
          >
            <ul>
              {
                navItems.map(
                  navItem => (
                    <li key={navItem.key}>
                      <Link
                        className={classNames['nav-item']}
                        onClick={navItem.onClick}
                        role='menuitem'
                        disabled={navItem.disabled}
                        data-testid={'Header-navItem'}
                      >
                        {navItem.title}
                      </Link>
                    </li>
                  )
                )
              }
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}