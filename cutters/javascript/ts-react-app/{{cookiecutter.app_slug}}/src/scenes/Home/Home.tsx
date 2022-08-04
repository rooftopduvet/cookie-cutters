import React from 'react';
import { MainContent } from '@/src/components/MainContent';
import { translate } from '@/src/i18n';

/**
 * Home-Page/Dashboard area.
 * Nothing on this page at the moment as we just show an expanded header.
 */
export function Home(): React.ReactElement<any> {
  return (
    <MainContent>
      <div data-testid="Scene-Home">
        <h1>{translate('pages.home.pageTitle')}</h1>
      </div>
    </MainContent>
  );
}
