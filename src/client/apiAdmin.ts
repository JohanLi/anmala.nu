import axios from 'axios';

import { UpdateNoteRequest } from '../pages/api/order/note';
import { CreateForm, EditForm, Form } from '../shared/formTypes';
import { UpdateFormStatusRequest } from '../pages/api/form/status';
import { UpsertFormReceiptRequest } from '../pages/api/form/receipt';
import { SendMessageRequest } from '../pages/api/order/message';
import { DeleteFormRequest } from '../pages/api/form';
import { CancelOrderRequest } from '../pages/api/order/cancel';

export const apiAdmin = {
  createForm: async (page: CreateForm): Promise<Form> => {
    const { data } = await axios.request<Form>({
      method: 'POST',
      url: `/api/form`,
      data: page,
    });

    return data;
  },
  editForm: async (page: EditForm): Promise<Form> => {
    const { data } = await axios.request<Form>({
      method: 'PUT',
      url: `/api/form`,
      data: page,
    });

    return data;
  },
  updateFormStatus: async (data: UpdateFormStatusRequest): Promise<void> => {
    const response = await axios.request<void>({
      method: 'PUT',
      url: `/api/form/status`,
      data,
    });

    return response.data;
  },
  deleteForm: async (deleteFormRequest: DeleteFormRequest): Promise<void> => {
    const { data } = await axios.request<void>({
      method: 'DELETE',
      url: `/api/form`,
      data: deleteFormRequest,
    });

    return data;
  },
  cancelOrder: async (data: CancelOrderRequest): Promise<void> => {
    const response = await axios.request<void>({
      method: 'POST',
      url: `/api/order/cancel`,
      data,
    });

    return response.data;
  },
  updateNote: async (note: UpdateNoteRequest): Promise<void> => {
    const { data } = await axios.request<void>({
      method: 'PUT',
      url: `/api/order/note`,
      data: note,
    });

    return data;
  },
  exportOrders: (pageId: string): WindowProxy | null => window.open(`/api/order/export?pageId=${pageId}`, '_blank'),
  upsertReceipt: async (data: UpsertFormReceiptRequest): Promise<void> => {
    const response = await axios.request<void>({
      method: 'PUT',
      url: `/api/form/receipt`,
      data,
    });

    return response.data;
  },
  sendMessage: async (data: SendMessageRequest): Promise<void> => {
    const response = await axios.request<void>({
      method: 'POST',
      url: `/api/order/message`,
      data,
    });

    return response.data;
  },
};
