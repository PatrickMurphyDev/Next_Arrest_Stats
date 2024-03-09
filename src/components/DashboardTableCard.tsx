/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */
// Global Types
import { undefined } from 'zod';

// Data Model & Data
import { VWDWReportingViewColumns } from '@/models/vw_dw_reportingview';
import type { VWDWReportingViewOffensesColumns } from '@/models/vw_dw_reportingview_offenses';
// Enumerated values
import { EDashboardTableCardMeasureType } from '@/types/EDashboardTableCardMeasureType.enum';
import { EDataSortMethod } from '@/types/EDataSortMethod.enum';
import type {
  IDisplayKeyValuePairList,
  ISortableTableRow,
} from '@/types/global';

export type IDashboardTableCardProps = {
  title: String;
  dataFull: Array<any>;
  dataFullColumn?: VWDWReportingViewColumns | VWDWReportingViewOffensesColumns;
  dataColNames?: Array<String>;
  orderByMethod?: EDataSortMethod;
  orderByColumn?: VWDWReportingViewColumns | VWDWReportingViewOffensesColumns;
  filterByColumn?: VWDWReportingViewColumns | VWDWReportingViewOffensesColumns;
  filterByRange?: { min: number; max: number };
  returnLimit?: number;
  measureType?: EDashboardTableCardMeasureType;
  pct?: boolean;
  val?: boolean;
  noTitle?: boolean;
};

function fnSortRows(
  intDataTbl: Array<ISortableTableRow>,
  intOrderByMethod?: EDataSortMethod,
) {
  intDataTbl.sort((a, b) => {
    if (intOrderByMethod === EDataSortMethod.default) {
      return 0;
    }
    if (intOrderByMethod === EDataSortMethod.sortValueAsc) {
      if (
        parseInt(a.values[1] ? a.values[1] : '0', 10) >
        parseInt(b.values[1] ? b.values[1] : '0', 10)
      ) {
        return 1;
      }
      if (
        parseInt(a.values[1] ? a.values[1] : '0', 10) <
        parseInt(b.values[1] ? b.values[1] : '0', 10)
      ) {
        return -1;
      }
    } else if (intOrderByMethod === EDataSortMethod.sortValueDesc) {
      if (
        parseInt(a.values[1] ? a.values[1] : '0', 10) <
        parseInt(b.values[1] ? b.values[1] : '0', 10)
      ) {
        return 1;
      }
      if (
        parseInt(a.values[1] ? a.values[1] : '0', 10) >
        parseInt(b.values[1] ? b.values[1] : '0', 10)
      ) {
        return -1;
      }
    }
    if (
      intOrderByMethod === EDataSortMethod.sortValueDesc ||
      intOrderByMethod === EDataSortMethod.sortValueAsc
    ) {
      if (a.values[1] === b.values[1]) {
        return 0;
      }
    }
    if (intOrderByMethod === EDataSortMethod.sortColumnAsc) {
      if (
        (a.sortNumeric ? a.sortNumeric : 0) >
        (b.sortNumeric ? b.sortNumeric : 0)
      ) {
        return 1;
      }
      if (
        (a.sortNumeric ? a.sortNumeric : 0) <
        (b.sortNumeric ? b.sortNumeric : 0)
      ) {
        return -1;
      }
    }
    if (intOrderByMethod === EDataSortMethod.sortColumnDesc) {
      if (
        (a.sortNumeric ? a.sortNumeric : 0) <
        (b.sortNumeric ? b.sortNumeric : 0)
      ) {
        return 1;
      }
      if (
        (a.sortNumeric ? a.sortNumeric : 0) >
        (b.sortNumeric ? b.sortNumeric : 0)
      ) {
        return -1;
      }
    }
    return -1;
  });

  return intDataTbl;
}

export default async function DashboardTableCard(
  props: IDashboardTableCardProps,
) {
  const defaultProps = {
    returnLimit: 100,
    dataFullColumn: VWDWReportingViewColumns.gender_name, // todo update to read first element first col
    dataColNames: ['Title', 'Value', 'Pct', 'Col4', 'Col5', 'Col6'], // extra cols not used do not effect render
    orderByMethod: EDataSortMethod.default,
  };

  // ========================== //
  // ===== Internal Vars ====== //
  // ========================== //
  const intDataCol = props?.dataFullColumn || defaultProps.dataFullColumn; // default row cols gender_name

  const intDataList: IDisplayKeyValuePairList = {
    keys: Array<String>(),
    values: Array<number>(),
    sortAttribute: Array<string>(),
    sortValue: Array<number>(),
  };

  let intDataTbl = Array<ISortableTableRow>(); // return format
  let intTotalCount = 0;

  // replace with props
  let intMeasureType: EDashboardTableCardMeasureType =
    props.measureType || EDashboardTableCardMeasureType.cnt;

  if (!!props?.pct || !!props?.val) {
    if (!!props?.pct && !!props?.val) {
      // both pct & cnt
      intMeasureType = EDashboardTableCardMeasureType.countPercent;
    } else if (props?.pct) {
      // pct if set
      intMeasureType = EDashboardTableCardMeasureType.percent;
    } else {
      // default cnt
      intMeasureType = EDashboardTableCardMeasureType.cnt;
    }
  }

  // ========================== //
  // ===== Count By Var ======= //
  // ========================== //
  Array.from(props.dataFull).map((elt) => {
    const groupVarKey = intDataList.keys.indexOf(elt[intDataCol]);
    if (groupVarKey >= 0) {
      // exists, increment
      intDataList.values[groupVarKey]++;
    } else {
      // does not exist, insert
      intDataList.keys.push(elt[intDataCol]);
      intDataList.values.push(1);
      intDataList.sortValue?.push(elt[props?.orderByColumn || intDataCol]);
    }
    return undefined;
  });

  // count total - for each data item, if has values > 0, add to total (entire table)
  Array.from(intDataList.keys).map((_e, i) => {
    if (Object.prototype.hasOwnProperty.call(Object(intDataList), 'values'))
      if (Object(intDataList).values[i] > 0) {
        intTotalCount += Object(intDataList).values[i] || 1;
      }
    return undefined;
  });

  // ================================= //
  // ===== Create Sortable Rows ====== //
  // ================================= //
  Array.from(intDataList.keys).map((e, i) => {
    const tmpArr = Array<string>();
    tmpArr.push(`${e}`); // data name
    if (
      intMeasureType === EDashboardTableCardMeasureType.cnt ||
      intMeasureType === EDashboardTableCardMeasureType.countPercent
    ) {
      tmpArr.push(`${intDataList.values[i]}`); // convert to string
    }

    if (
      intMeasureType === EDashboardTableCardMeasureType.percent ||
      intMeasureType === EDashboardTableCardMeasureType.countPercent
    ) {
      tmpArr.push(
        `${((Object(intDataList).values[i] / intTotalCount) * 100).toFixed(2)}%`,
      ); // convert to string
    }

    if (Object.prototype.hasOwnProperty.call(Object(intDataList), 'values'))
      if (intDataList.values.length - 1 >= i)
        if (Object(intDataList).values[i] > 0) {
          const tempSortableRow: ISortableTableRow = {
            values: tmpArr,
            sortAttribute: '',
            sortNumeric: intDataList.sortValue[i],
          };

          intDataTbl.push(tempSortableRow);
        }
    return undefined;
  });

  // ========================== //
  // ======= Sort Data ======== //
  // ========================== //
  intDataTbl = fnSortRows(
    intDataTbl,
    props?.orderByMethod || defaultProps.orderByMethod,
  );

  if (props.filterByColumn && props.filterByRange) {
    intDataTbl = intDataTbl.filter((value: ISortableTableRow) => {
      if (
        typeof value.sortNumeric !== 'undefined' &&
        props.filterByRange &&
        value.sortNumeric >= props.filterByRange.min &&
        value.sortNumeric <= props.filterByRange.max
      )
        return true;
      return false;
    });
  }

  // ============================= //
  // ===== print tbl & rows ====== //
  // ============================= //
  let cardStyleProps = { marginTop: '.375em' };
  if (props.noTitle) {
    cardStyleProps = { marginTop: '0' };
  }
  return (
    <div
      className="mx-1.5 mb-1.5 grow rounded border border-gray-400 pt-0 shadow"
      style={cardStyleProps}
    >
      {!props?.noTitle ? (
        <h2 className="mx-1.5 border-b-2 border-black">{props.title}</h2>
      ) : (
        <span />
      )}
      <table className="w-full text-center">
        <tr>
          {Array.from(props.dataColNames || defaultProps.dataColNames)
            .slice(
              0,
              (intDataTbl[0] ? intDataTbl[0] : { values: [] }).values.length,
            )
            .map((elt, Idx) => {
              return <th key={`${Idx}key`}>{elt}</th>;
            })}
        </tr>
        {Array.from(intDataTbl)
          .slice(0, props?.returnLimit || defaultProps.returnLimit)
          .map((elt, Idx) => {
            return (
              <tr key={Idx + 1}>
                {Array.from(elt.values).map((elt2, Idx2) => {
                  return <td key={Idx2 + 1}>{elt2}</td>;
                })}
              </tr>
            );
          })}
      </table>
    </div>
  );
}
