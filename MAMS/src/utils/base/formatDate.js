/* eslint import/prefer-default-export: 0 */

import padStart from './padStart';

export default function format(time, formatStr = 'YYYY-MM-DD') {
  const d = new Date(time);

  return formatStr
    .replace('YYYY', d.getFullYear())
    .replace('MM', padStart(d.getMonth() + 1))
    .replace('DD', padStart(d.getDate()))
    .replace('HH', padStart(d.getHours()))
    .replace('mm', padStart(d.getMinutes()));
}
