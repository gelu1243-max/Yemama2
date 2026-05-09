'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import en from '@/locales/en/common.json'
import am from '@/locales/am/common.json'
import or_ from '@/locales/or/common.json'
import ti from '@/locales/ti/common.json'

export type Locale = 'en' | 'am' | 'or' | 'ti'

const LOCALES: Record<Locale, typeof en> = { en, am, or: or_, ti }

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  am: 'አማርኛ',
  or: 'Afaan Oromo',
  ti: 'ትግርኛ',
}

interface I18nContextType {
  locale: Locale
  setLocale: (l: Locale) => void
  t: typeof en
}

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: en,
})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('yemama-locale') as Locale | null
    if (saved && LOCALES[saved]) setLocaleState(saved)
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem('yemama-locale', l)
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: LOCALES[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
