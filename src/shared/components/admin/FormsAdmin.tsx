import React from 'react';

import { FormsAdminRow } from './FormsAdminRow';
import { Button } from '../common/Button';
import { getCreatePageUrl } from '../../urls';
import { useOauthCallbackTidyUrl } from '../../utils';
import { OverviewForm } from '../../formTypes';
import { Layout } from '../common/Layout';
import { Content } from '../common/Content';
import { QueryAlerts, useQueryAlert } from '../../queryAlert';

export interface FormsAdminProps {
  overviewForms: OverviewForm[];
}

export const FormsAdmin = (props: FormsAdminProps): JSX.Element => {
  const { overviewForms } = props;

  useOauthCallbackTidyUrl();

  const columnCount = 5;

  const alert = useQueryAlert(QueryAlerts.ALREADY_LOGGED_IN);

  return (
    <Layout heading="Mina formulär" alert={alert}>
      <Content padding={false}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rubrik
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deltagare
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skapad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Senast ändrad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overviewForms.map((overviewPage) => (
                <FormsAdminRow
                  key={overviewPage.id}
                  overviewPage={overviewPage}
                />
              ))}
              {overviewForms.length === 0 && (
                <tr>
                  <td colSpan={columnCount} className="text-sm text-gray-500 px-4 sm:px-6 py-6">
                    Du har inte skapat några sidor ännu. När du gjort det, kommer du se en översikt av dem här.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Content>
      <div className="pt-6 px-4 sm:px-0 text-right">
        <Button
          type="primary"
          size="lg"
          href={getCreatePageUrl()}
        >
          Skapa nytt
        </Button>
      </div>
    </Layout>
  );
};
