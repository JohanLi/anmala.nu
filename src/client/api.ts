import axios from 'axios';

import { Credentials, CredentialsResetToken, User, Username } from '../shared/userTypes';
import { CreateOrderRequest, OrderResponse, UpdateOrderRequest } from '../pages/api/order';
import { OrderStatusRequest, OrderStatusResponse } from '../pages/api/order/status';

export const api = {
  authRequestUrlGoogle: async (redirectUrl: string): Promise<string> => {
    const { data } = await axios.request<{ url: string }>({
      method: 'POST',
      url: `/api/auth/google/request-url`,
      data: {
        redirectUrl,
      },
    });

    return data.url;
  },
  authRequestUrlFacebook: async (redirectUrl: string): Promise<string> => {
    const { data } = await axios.request<{ url: string }>({
      method: 'POST',
      url: `/api/auth/facebook/request-url`,
      data: {
        redirectUrl,
      },
    });

    return data.url;
  },
  signUp: async (credentials: Credentials): Promise<string> => {
    const { data } = await axios.request<{ url: string }>({
      method: 'POST',
      url: `/api/user/sign-up`,
      data: credentials,
    });

    return data.url;
  },
  order: async (order: CreateOrderRequest): Promise<OrderResponse> => {
    const { data } = await axios.request<OrderResponse>({
      method: 'POST',
      url: `/api/order`,
      data: order,
    });

    return data;
  },
  updateOrder: async (order: UpdateOrderRequest): Promise<OrderResponse> => {
    const { data } = await axios.request<OrderResponse>({
      method: 'PUT',
      url: `/api/order`,
      data: order,
    });

    return data;
  },
  getOrderStatus: async (order: OrderStatusRequest): Promise<OrderStatusResponse> => {
    const { data } = await axios.request<OrderStatusResponse>({
      method: 'GET',
      url: `/api/order/status`,
      params: order,
    });

    return data;
  },
  getUserFromSession: async (): Promise<User> => {
    const { data } = await axios.request<User>({
      method: 'PUT',
      url: `/api/auth`,
    });

    return data;
  },
  signIn: async (credentials: Credentials): Promise<void> => {
    const { data } = await axios.request<void>({
      method: 'POST',
      url: `/api/auth`,
      data: credentials,
    });

    return data;
  },
  forgotPassword: async (data: Username): Promise<void> => {
    const response = await axios.request<void>({
      method: 'POST',
      url: `/api/auth/forgot-password`,
      data,
    });

    return response.data;
  },
  signInWithResetToken: async (data: CredentialsResetToken): Promise<void> => {
    const response = await axios.request<void>({
      method: 'POST',
      url: `/api/auth`,
      data,
    });

    return response.data;
  },
  signOut: async (): Promise<void> => {
    const { data } = await axios.request<void>({
      method: 'DELETE',
      url: `/api/auth`,
    });

    return data;
  },
}
