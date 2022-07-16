import { AppStrings } from './types'

export const enUS: AppStrings = {
  pages: {
    home: {
      pageTitle: 'Home',
    },
    notFound: {
      pageTitle: 'Page Not Found',
    },
  },
  header: {
    images: {
      logo: '{{cookiecutter.app_name}} logo',
    },
    navigation: 'Main navigation',
  },
  footer: {
    message: `© {{cookiecutter.app_name}} ${(new Date()).getFullYear()}`
  }
}