import {
  Image,
  ImageFit,
} from '@/src/components/Image'
import { translate } from '@/src/i18n'
import classNames from './Logo.scss'

import logo1x from '@/assets/images/logos/logo-348.png'

const SOURCES = {
  regular: {
    '1x': {
      width: 348,
      src: logo1x,
    },
  }
}

export interface ILogo {
  className?: string,
}

export function Logo(props: ILogo) {
  let rootClassName = classNames['root']
  if (props.className) {
    rootClassName = `${rootClassName} ${props.className}`
  }

  const sources = SOURCES.regular

  return (
    <div
      data-testid={'Logo'}
      className={rootClassName}
    >
      <Image
        className={classNames['logo']}
        src={sources['1x'].src}
        srcSet={
          Object.values(sources)
            .map(source => `${source.src} ${source.width}w`)
            .join(', ')
        }
        sizes={'80vw'}
        imageFit={ImageFit.contain}
        alt={translate('header.images.logo')}
      />
    </div>
  )
}