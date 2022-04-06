import React from 'react';

import { formatDate, formatTime } from '../../utils';
import { getFormAdminUrl, getParticipantsAdminUrl } from '../../urls';
import { OverviewForm } from '../../formTypes';
import { Badge } from '../common/Badge';
import { Link } from '../common/Link';

interface Props {
  overviewPage: OverviewForm;
}

export const FormsAdminRow = (props: Props): JSX.Element => {
  const { overviewPage } = props;

  const pageAdminUrl = getFormAdminUrl(overviewPage.id, overviewPage.slug);
  const participantUrl = getParticipantsAdminUrl(overviewPage.id, overviewPage.slug);

  return (
    <tr>
      <td className="px-6 py-4 text-sm font-medium">
        <Link href={pageAdminUrl}>
          {overviewPage.title}
        </Link>
      </td>
      <td className="px-6 py-4 text-sm font-medium">
        <Link href={participantUrl}>
          {overviewPage.participantCount}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(overviewPage.created)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatTime(overviewPage.lastUpdated)}
      </td>
      <td className="px-6 py-4 text-sm font-medium">
        {overviewPage.status === 'open' && <Badge color="green" size="sm" text="Öppen" />}
        {overviewPage.status === 'closed' && <Badge color="red" size="sm" text="Stängd" />}
      </td>
    </tr>
  );
};
