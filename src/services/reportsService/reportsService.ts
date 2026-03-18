import api from '../api';
import { AxiosResponse } from 'axios';

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

// Helper function to handle blob response for PDF downloads
const handlePdfResponse = (response: AxiosResponse<Blob>) => {
  const contentDisposition = response.headers['content-disposition'];
  let filename = 'report.pdf';
  
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
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

export const reportsAPI = {
  // Orders Reports
  generateOrdersReport: async (params?: ReportParams) => {
    const response = await api.get('/reports/orders', {
      params,
      responseType: 'blob',
    });
    return handlePdfResponse(response);
  },
  
  getOrdersStatusSummary: async (params?: { start_date?: string; end_date?: string }) => {
    const response = await api.get<OrderStatusSummary>('/reports/orders/status-summary', {
      params,
    });
    return response.data;
  },
  
  // Users Reports
  generateUsersReport: async (params?: ReportParams) => {
    const response = await api.get('/reports/users', {
      params,
      responseType: 'blob',
    });
    return handlePdfResponse(response);
  },
  
  // Products Reports
  generateProductsReport: async (params?: ReportParams) => {
    const response = await api.get('/reports/products', {
      params,
      responseType: 'blob',
    });
    return handlePdfResponse(response);
  },
  
  // Stock Reports
  generateStockReport: async (params?: ReportParams) => {
    const response = await api.get('/reports/stock', {
      params,
      responseType: 'blob',
    });
    return handlePdfResponse(response);
  },
};

export default reportsAPI;

