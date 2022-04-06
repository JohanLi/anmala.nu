import React from 'react';

import { FieldWithValue } from '../../../orderTypes';

interface Props {
  fieldsWithValues: FieldWithValue[];
}

export const FormAdminParticipantRowFieldsWithValues = (props: Props): JSX.Element => {
  const { fieldsWithValues } = props;

  return (
    <div className="space-y-4">
      {fieldsWithValues
        .filter(({ name }) => !['Namn', 'E-post'].includes(name))
        .map(({ name, value }, i) => {
          const valueString = Array.isArray(value) ? value.join(', ') : value;

          return (
            <div key={i}>
              <div className="text-sm font-medium text-gray-900">
                {name}
              </div>
              <div className="text-sm text-gray-500">
                {valueString}
              </div>
            </div>
          );
        })}
    </div>
  );
};
