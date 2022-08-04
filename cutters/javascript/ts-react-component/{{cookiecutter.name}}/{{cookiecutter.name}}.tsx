import React from 'react';
import { translate } from '@/src/i18n';
import classNames from './{{cookiecutter.name}}.scss';

export interface I{{cookiecutter.name}}Props {
  prop: String,
}

/**
 * {{cookiecutter.name}}
 */
export function {{cookiecutter.name}}(props: I{{cookiecutter.name}}Props): React.ReactElement<any> {
  return (
    <div
      data-testid="{{cookiecutter.name}}"
      className={classNames.root}
    >
    </div>
  );
}
