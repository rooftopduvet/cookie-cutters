import { translate } from '@/src/i18n'
import classNames from './{{cookiecutter.name}}.scss'

export interface {{cookiecutter.name}}Props {
  prop: String,
}

/* 
@ description
{{cookiecutter.name}}
*/
export function {{cookiecutter.name}}(props: {{cookiecutter.name}}Props): JSX.Element {
  return (
    <div
      data-testid={'{{cookiecutter.name}}'}
      className={classNames['root']}
    >
    </div>
  )
}