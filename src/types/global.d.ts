/* eslint-disable @typescript-eslint/consistent-type-imports */
// Use type safe message keys with `next-intl`
type Messages = typeof import('../locales/en.json');
declare interface IntlMessages extends Messages {}

type TInmateRecord =
  typeof import('@/public/assets/data/vw_dw_reportingview_row.json');
type TInmateOffensesRecord =
  typeof import('@/public/assets/data/vw_dw_reportingview_offenses_row.json');

/*
export interface IStringArray {
  [index: number]: string;
}
*/
export interface IDisplayKeyValuePairList {
  keys: Array<String>;
  values: Array<number>;
  sortValue: Array<number>;
  sortAttribute: Array<string>;
}
export interface ISortableTableRow {
  values: Array<string>;
  sortNumeric: number | undefined;
  sortAttribute: string;
}
