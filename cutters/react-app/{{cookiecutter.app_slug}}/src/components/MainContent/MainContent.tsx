import React from 'react';
import _classNames from './MainContent.scss';

export enum ContainerStyle {
  transparent = 'container-style--transparent',
  panel = 'container-style--panel',
}

export interface IMainContent {
  children: React.ReactElement<any>,
  className?: string,
  containerStyle?: ContainerStyle,
}

/**
 * Styles wrapper for the content of a <main> element of a page.
 * This element ensures that main content has a maximum width
 * and resizes with the screen accordingly. It will also deal
 * with any enter/exit animations etc.
 */
export function MainContent(props: IMainContent): React.ReactElement<any> {
  const {
    children = null,
    className = null,
    containerStyle = ContainerStyle.panel,
  } = props;

  const classNames = { ..._classNames };
  classNames.root = `${classNames.root} ${containerStyle}`;

  if (props.className) {
    classNames.root = `${classNames.root} ${className}`;
  }

  return (
    <div
      data-testid="MainContent"
      className={classNames.root}
    >
      {children}
    </div>
  );
}
