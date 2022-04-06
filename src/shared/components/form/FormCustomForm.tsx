import React from 'react';

import { classNames } from './utils';
import { FieldWithValue } from '../../orderTypes';
import { BASE_FIELDS, Form } from '../../formTypes';
import { Button } from '../common/Button';
import { Step } from './Step';
import { inputClass } from '../common/classes';

interface FormCustomFormProps {
  form: Form;
  fieldsWithValues: FieldWithValue[];
  setFieldsWithValues: (customFieldsWithValues: FieldWithValue[]) => void;
  isCurrent: boolean;
  complete: boolean;
  onClick: () => void;
  onNext: () => void;
}

// to help users autocomplete these fields
const getAdditionalProperties = (name: string) => {
  if (name === 'Namn') {
    return {
      id: 'name',
      name: 'name',
    };
  }

  if (name === 'E-post') {
    return {
      id: 'email',
      name: 'email',
    };
  }

  return {};
}

export const FormCustomForm = (props: FormCustomFormProps): JSX.Element => {
  const { form, fieldsWithValues, setFieldsWithValues, isCurrent, complete, onClick, onNext } = props;

  const setValue = (value: string, i: number, isCheckbox = false) => {
    const newCustomFieldsWithValues = [...fieldsWithValues];

    if (!isCheckbox) {
      newCustomFieldsWithValues[i].value = value;
    } else {
      const originalValue = newCustomFieldsWithValues[i].value;

      if (!Array.isArray(originalValue)) {
        newCustomFieldsWithValues[i].value = [value];
      } else {
        newCustomFieldsWithValues[i].value = originalValue.concat(value);
      }
    }

    setFieldsWithValues(newCustomFieldsWithValues);
  }

  const removeValue = (value: string, i: number) => {
    const newCustomFieldsWithValues = [...fieldsWithValues];

    const originalValue = newCustomFieldsWithValues[i].value;

    if (!Array.isArray(originalValue)) {
      return;
    }

    newCustomFieldsWithValues[i].value = originalValue.filter((v) => v !== value);
    setFieldsWithValues(newCustomFieldsWithValues);
  }

  const fields = BASE_FIELDS.concat(form.customFields);

  return (
    <Step
      isCurrent={isCurrent}
      complete={complete}
      onClick={onClick}
      title="2. Kunduppgifter"
    >
      <div className="divide-y divide-gray-100 -my-4">
        {fields.map((field, i) => {
          if (field.type === 'text') {
            return (
              <label className="block py-4" key={i}>
                <div className="text-sm font-medium text-gray-700 pb-2">
                  {field.name} {field.required && <span className="text-red-500">*</span>}
                </div>
                <div>
                  <input
                    type="text"
                    className={inputClass}
                    value={fieldsWithValues[i].value}
                    onChange={(e) => setValue(e.target.value, i)}
                    {...getAdditionalProperties(field.name)}
                  />
                </div>
              </label>
            );
          }

          if (field.type === 'textarea') {
            return (
              <label className="block py-4" key={i}>
                <div className="text-sm font-medium text-gray-700 pb-2">
                  {field.name} {field.required && <span className="text-red-500">*</span>}
                </div>
                <textarea
                  rows={2}
                  className={inputClass}
                  value={fieldsWithValues[i].value}
                  onChange={(e) => setValue(e.target.value, i)}
                />
              </label>
            );
          }

          if (['radio', 'checkbox'].includes(field.type) && field.options) {
            return (
              <div className="py-4" key={i}>
                <div className="text-sm font-medium text-gray-700 pb-2">
                  {field.name} {field.required && <span className="text-red-500">*</span>}
                </div>
                <div className="relative bg-white rounded-md -space-y-px">
                  {field.options.map((option, optionIndex) => {
                    const isSelected = option === fieldsWithValues[i].value || fieldsWithValues[i].value.includes(option);

                    return (
                      <label
                        key={optionIndex}
                        className={classNames(
                          optionIndex === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                          optionIndex === field.options!.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                          isSelected ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200',
                          'border p-4 flex items-center cursor-pointer md:pl-4 md:pr-6 focus:outline-none'
                        )}
                      >
                        <input
                          type={field.type}
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setValue(option, i, field.type === 'checkbox');
                            } else {
                              removeValue(option, i);
                            }
                          }}
                          className="h-4 w-4 text-indigo-600 cursor-pointer border-gray-300 focus:ring-0 focus:ring-offset-0"
                        />
                        <div className={classNames(isSelected ? 'text-indigo-900' : 'text-gray-900', 'ml-3 font-medium text-sm')}>
                          {option}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          }
        })}
      </div>
      <Button
        type="primary"
        size="lg"
        onClick={onNext}
        disabled={!complete}
        className="w-full mt-6"
      >
        Gå vidare till betalning
      </Button>
    </Step>
  );
}
