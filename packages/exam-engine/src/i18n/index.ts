import i18n from 'i18next'
import * as _ from 'lodash-es'
import { initReactI18next } from 'react-i18next'
import { A_E } from './A_E'
import { BA } from './BA'
import { CA } from './CA'
import { EA } from './EA'
import { FA } from './FA'
import { fi_FI } from './fi-FI'
import { GC } from './GC'
import { M } from './M'
import { O_E } from './O_E'
import { PA } from './PA'
import { SA } from './SA'
import { sv_FI } from './sv-FI'
import { TC } from './TC'
import { VA } from './VA'
import { Z } from './Z'

const examSpecificTranslations = {
  A_E,
  BA,
  BB: BA,
  CA,
  CB: CA,
  EA,
  EC: EA,
  DC: Z,
  FA,
  FC: FA,
  GC,
  M,
  N: M,
  O_E,
  SA,
  SC: SA,
  PA,
  PC: PA,
  TC,
  VA,
  VC: VA,
  Z
}

const resources = {
  'fi-FI': {
    translation: fi_FI,
    ...examSpecificTranslations
  },
  'sv-FI': {
    translation: sv_FI,
    ...examSpecificTranslations
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'fi-FI',
  fallbackLng: 'fi-FI',
  debug: false,
  defaultNS: 'translation',
  fallbackNS: 'translation',
  interpolation: {
    escapeValue: false,
    format: (value, format) => {
      switch (format) {
        case 'range': {
          const [start, end] = value
          return start == null ? end : end == null ? start : start === end ? start : start + '–' + end
        }
        case 'first':
          return _.first(value)
        case 'last':
          return _.last(value)
        default:
          return value
      }
    }
  }
})

export function initI18n(language: string, examCode: string | null, dayCode: string | null) {
  const examNamespace = examCode && examCode + (dayCode ? `_${dayCode}` : '')
  i18n.setDefaultNamespace(examNamespace || 'translation')
  i18n.changeLanguage(language)
}

export default i18n
