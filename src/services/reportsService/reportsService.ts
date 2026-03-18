import api from '../api';
import { AxiosError, AxiosResponse } from 'axios';

export interface ReportParams {
  start_date?: string;
  end_date?: string;
  status?: string;
  category_id?: number;
  is_active?: boolean;
  low_stock_only?: boolean;
  out_of_stock_only?: boolean;
}

export interface OrderStatusSummary {
  success: boolean;
  data: {
    pending?: number;
    processing?: number;
    completed?: number;
    cancelled?: number;
    refunded?: number;
    [key: string]: number | undefined;
  };
}

interface ErrorResponse {
  message?: string;
  errors?: Record<string, string[] | string>;
}

const REPORT_TIMEOUT_MS = 120000;

const handlePdfResponse = (response: AxiosResponse<Blob>) => {
  const contentDisposition = response.headers['content-disposition'];
  let filename = 'report.pdf';

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch?.[1]) {
      filename = filenameMatch[1].replace(/['"]/g, '');
    }
  }

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return response;
};

const flattenValidationErrors = (errors: Record<string, string[] | string> | undefined): string => {
  if (!errors || typeof errors !== 'object') return '';
  return Object.entries(errors)
    .map(([field, value]) => {
      if (Array.isArray(value)) return `${field}: ${value.join(', ')}`;
      if (typeof value === 'string') return `${field}: ${value}`;
      return '';
    })
    .filter(Boolean)
    .join(' | ');
};

const extractErrorMessage = async (error: unknown, fallback: string): Promise<string> => {
  const axiosError = error as AxiosError<ErrorResponse | Blob>;
  const responseData = axiosError.response?.data;

  if (responseData instanceof Blob) {
    try {
      const text = await responseData.text();
      const parsed = JSON.parse(text) as ErrorResponse;
      const validationText = flattenValidationErrors(parsed.errors);
      if (validationText) {
        return `${parsed.message || fallback}. ${validationText}`;
      }
      return parsed.message || fallback;
    } catch {
      return fallback;
    }
  }

  if (responseData && typeof responseData === 'object') {
    const payload = responseData as ErrorResponse;
    const validationText = flattenValidationErrors(payload.errors);
    if (validationText) {
      return `${payload.message || fallback}. ${validationText}`;
    }
    return payload.message || fallback;
  }

  return axiosError.message || fallback;
};

const removeEmptyParams = (params?: Record<string, unknown>) => {
  if (!params) return {};
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
  );
};

const downloadPdfReport = async (
  path: string,
  params?: Record<string, unknown>
): Promise<AxiosResponse<Blob>> => {
  try {
    const response = await api.get(path, {
      params: removeEmptyParams(params),
      responseType: 'blob',
      timeout: REPORT_TIMEOUT_MS,
      headers: {
        Accept: 'application/pdf',
      },
    });
    return handlePdfResponse(response);
  } catch (error) {
    const message = await extractErrorMessage(error, 'Failed to generate report');
    throw new Error(message);
  }
};

export const reportsAPI = {
  generateOrdersReport: async (params?: Pick<ReportParams, 'status' | 'start_date' | 'end_date'>) => {
    return downloadPdfReport('/reports/orders', params);
  },

  getOrdersStatusSummary: async (params?: { start_date?: string; end_date?: string }) => {
    try {
      const response = await api.get<OrderStatusSummary>('/reports/orders/status-summary', {
        params: removeEmptyParams(params),
        timeout: REPORT_TIMEOUT_MS,
      });
      return response.data;
    } catch (error) {
      const message = await extractErrorMessage(error, 'Failed to fetch orders status summary');
      throw new Error(message);
    }
  },

  generateUsersReport: async (params?: Pick<ReportParams, 'status' | 'start_date' | 'end_date'>) => {
    return downloadPdfReport('/reports/users', params);
  },

  generateProductsReport: async (params?: Pick<ReportParams, 'category_id' | 'is_active'>) => {
    return downloadPdfReport('/reports/products', params);
  },

  generateStockReport: async (params?: Pick<ReportParams, 'low_stock_only' | 'out_of_stock_only'>) => {
    return downloadPdfReport('/reports/stock', params);
  },
};

export default reportsAPI;
