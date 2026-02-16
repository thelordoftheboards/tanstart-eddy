import { createFormHook } from '@tanstack/react-form';
import { lazy } from 'react';
import { fieldContext, formContext } from './form-context';

const FormFieldCheckbox = lazy(() => import('~/base-user-interface/components/form-field-checkbox'));
const FormFieldDate = lazy(() => import('~/base-user-interface/components/form-field-date'));
const FormFieldDateTime = lazy(() => import('~/base-user-interface/components/form-field-date-time'));
const FormFieldHidden = lazy(() => import('~/base-user-interface/components/form-field-hidden'));
const FormFieldIsoDate = lazy(() => import('~/base-user-interface/components/form-field-iso-date'));
const FormFieldIsoDateTime = lazy(() => import('~/base-user-interface/components/form-field-iso-date-time'));
const FormFieldNumber = lazy(() => import('~/base-user-interface/components/form-field-number'));
const FormFieldPhoneNumber = lazy(() => import('~/base-user-interface/components/form-field-phone-number'));
const FormFieldTabListBoolean = lazy(() => import('~/base-user-interface/components/form-field-tab-list-boolean'));
const FormFieldTabListNumber = lazy(() => import('~/base-user-interface/components/form-field-tab-list-number'));
const FormFieldText = lazy(() => import('~/base-user-interface/components/form-field-text'));

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    FormFieldCheckbox,
    FormFieldDate,
    FormFieldDateTime,
    FormFieldHidden,
    FormFieldIsoDate,
    FormFieldIsoDateTime,
    FormFieldNumber,
    FormFieldTabListBoolean,
    FormFieldPhoneNumber,
    FormFieldTabListNumber,
    FormFieldText,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
