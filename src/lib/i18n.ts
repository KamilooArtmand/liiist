import { usePrefs } from './store'

const dict = {
  fa: {
    handle: 'نام‌کاربری', password: 'رمز', title: 'عنوان', add: 'افزودن…', ask: 'چه لیستی؟',
    search: 'جستجو', name: 'نام', bio: 'بیو', current: 'رمز فعلی', next: 'رمز جدید',
    copied: 'کپی شد', saved: 'ذخیره شد', taken: 'گرفته شده', invalid: 'نادرست', error: 'خطا',
    confirm: 'مطمئنی؟', empty: '—', ai: 'در دسترس نیست', note: 'یادداشت…',
  },
  en: {
    handle: 'handle', password: 'password', title: 'Title', add: 'Add…', ask: 'What list?',
    search: 'Search', name: 'Name', bio: 'Bio', current: 'Current', next: 'New',
    copied: 'Copied', saved: 'Saved', taken: 'Taken', invalid: 'Invalid', error: 'Error',
    confirm: 'Sure?', empty: '—', ai: 'Unavailable', note: 'Note…',
  },
} as const
export type Key = keyof (typeof dict)['en']
export const useT = () => {
  const lang = usePrefs((s) => s.lang)
  return (k: Key) => dict[lang][k]
}
export const tr = (k: Key) => dict[usePrefs.getState().lang][k]
export const errText = (e: any) => {
  const c = e?.code
  if (c === 'taken') return tr('taken')
  if (c === 'invalid' || c === 'handle' || c === 'password') return tr('invalid')
  if (c === 'ai') return tr('ai')
  return tr('error')
}
