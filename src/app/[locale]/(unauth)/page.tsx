/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */
import { getTranslations } from 'next-intl/server';

import ChartLine from '@/components/ChartLine';
import { DashboardHeadingCustom } from '@/components/DashboardHeadingCustom';
import DashboardTableCard from '@/components/DashboardTableCard';
import { VWDWReportingViewColumns } from '@/models/vw_dw_reportingview';
import { VWDWReportingViewOffensesColumns } from '@/models/vw_dw_reportingview_offenses';
import vw_dw_reportingview from '@/public/assets/data/vw_dw_reportingview.json';
import vw_dw_reportingview_offenses from '@/public/assets/data/vw_dw_reportingview_offenses.json';
import { EDataSortMethod } from '@/types/EDataSortMethod.enum';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function Index() {
  return (
    <div>
      <h1 className="text-2xl">Dataset Summary</h1>
      <div className="flex flex-row">
        <div className="grow">
          <DashboardTableCard
            title="By Gender"
            dataFull={vw_dw_reportingview}
            dataColNames={['Gender', 'Count', 'Percent']}
            dataFullColumn={VWDWReportingViewColumns.gender_name}
            orderByMethod={EDataSortMethod.sortValueDesc}
            pct
            val
          />
          <ChartLine />
        </div>
        <div className="grow">
          <DashboardHeadingCustom
            title="By Inmate Age (Avg?)"
            replacementValue=" 10"
          />
          <DashboardTableCard
            noTitle
            title=""
            dataFull={vw_dw_reportingview}
            dataColNames={['Age Range', 'Count', 'Percent']}
            dataFullColumn={VWDWReportingViewColumns.age_group_name}
            orderByMethod={EDataSortMethod.sortColumnAsc}
            orderByColumn={VWDWReportingViewColumns.age_group_seq}
            pct
            val
          />
        </div>
      </div>
      <div className="flex flex-row">
        <DashboardTableCard
          title="By State"
          dataFull={vw_dw_reportingview}
          dataColNames={['State', 'Count']}
          dataFullColumn={VWDWReportingViewColumns.location_state}
          orderByMethod={EDataSortMethod.sortValueDesc}
          returnLimit={11}
        />
        <DashboardTableCard
          title="By Residency"
          dataFull={vw_dw_reportingview}
          dataColNames={['Residency', 'Count']}
          dataFullColumn={VWDWReportingViewColumns.location_city}
          orderByMethod={EDataSortMethod.sortValueDesc}
          returnLimit={11}
        />
      </div>
      <div className="flex flex-row">
        <DashboardTableCard
          title="By Day of Week"
          dataFull={vw_dw_reportingview}
          dataColNames={['Day', 'Count', 'Percent']}
          dataFullColumn={VWDWReportingViewColumns.arrest_day_of_week_name}
          orderByColumn={VWDWReportingViewColumns.arrest_day_of_week}
          orderByMethod={EDataSortMethod.sortColumnAsc}
          pct
          val
        />
        <DashboardTableCard
          title="By Hour (AM)"
          dataFull={vw_dw_reportingview}
          dataColNames={['Hour', 'Count', 'Percent']}
          dataFullColumn={VWDWReportingViewColumns.arrest_date_hour}
          orderByColumn={VWDWReportingViewColumns.arrest_date_hour_index}
          orderByMethod={EDataSortMethod.sortColumnAsc}
          filterByColumn={VWDWReportingViewColumns.arrest_date_hour_index}
          filterByRange={{ min: 0, max: 11 }}
          val
          pct
        />

        <DashboardTableCard
          title="By Hour (PM)"
          dataFull={vw_dw_reportingview}
          dataColNames={['Hour', 'Count', 'Percent']}
          dataFullColumn={VWDWReportingViewColumns.arrest_date_hour}
          orderByColumn={VWDWReportingViewColumns.arrest_date_hour_index}
          orderByMethod={EDataSortMethod.sortColumnAsc}
          filterByColumn={VWDWReportingViewColumns.arrest_date_hour_index}
          filterByRange={{ min: 12, max: 23 }}
          val
          pct
        />
      </div>
      <div className="flex flex-row">
        <DashboardTableCard
          title="By Court"
          dataColNames={['Court', 'Count']}
          dataFullColumn={VWDWReportingViewOffensesColumns.court_name}
          dataFull={vw_dw_reportingview_offenses}
          orderByMethod={EDataSortMethod.sortValueDesc}
        />
        <DashboardTableCard
          title="By Offense"
          dataColNames={['Offense', 'Count']}
          dataFull={vw_dw_reportingview_offenses}
          dataFullColumn={
            VWDWReportingViewOffensesColumns.offense_category_name
          }
          orderByMethod={EDataSortMethod.sortValueDesc}
          returnLimit={20}
        />
        <DashboardTableCard
          title="Inmate Duration"
          dataFull={vw_dw_reportingview}
          dataColNames={['Days', 'Count']}
          dataFullColumn={VWDWReportingViewColumns.days_in}
          orderByMethod={EDataSortMethod.sortValueDesc}
          returnLimit={20}
        />
      </div>
      <div className="flex-row">
        <DashboardTableCard
          title="Most Recent 25 Arrests"
          dataFull={vw_dw_reportingview}
          dataColNames={['Arrest Date', 'Name']}
          dataFullColumn={VWDWReportingViewColumns.name_full}
          orderByMethod={EDataSortMethod.sortColumnDesc}
          orderByColumn={VWDWReportingViewColumns.arrest_datetime}
          returnLimit={25}
        />
      </div>
    </div>
  );
}
