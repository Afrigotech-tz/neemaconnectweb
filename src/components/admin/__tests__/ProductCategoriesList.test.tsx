import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCategoriesList from '../ProductCategoriesList';

// Mock the productService
jest.mock('@/services/productService/productService', () => ({
  productService: {
    getCategories: jest.fn().mockResolvedValue({
      success: true,
      data: [
        {
          id: 1,
          name: 'Music Albums',
          slug: 'music-albums',
          description: 'Christian music albums and worship songs',
          image_url: null,
          is_active: true,
          sort_order: 0,
          parent_id: null,
          created_at: '2025-07-28T20:08:04.000000Z',
          updated_at: '2025-07-28T20:08:04.000000Z'
        },
        {
          id: 2,
          name: 'T-Shirts',
          slug: 't-shirts',
          description: 'Christian themed T-shirts',
          image_url: null,
          is_active: true,
          sort_order: 0,
          parent_id: null,
          created_at: '2025-07-28T20:10:04.000000Z',
          updated_at: '2025-07-28T20:10:04.000000Z'
        }
      ]
    })
  }
}));

// Mock toast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('ProductCategoriesList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with categories', async () => {
    render(
      <BrowserRouter>
        <ProductCategoriesList />
      </BrowserRouter>
    );

    // Wait for categories to load and check if title is rendered
    await waitFor(() => {
      expect(screen.getByText('Product Categories')).toBeInTheDocument();
      expect(screen.getByText('Music Albums')).toBeInTheDocument();
      expect(screen.getByText('Christian music albums and worship songs')).toBeInTheDocument();
      expect(screen.getByText('T-Shirts')).toBeInTheDocument();
      expect(screen.getByText('Christian themed T-shirts')).toBeInTheDocument();
    });

    // Check if the "Add Category" button is present
    expect(screen.getByText('Add Category')).toBeInTheDocument();
  });

  it('displays loading state initially', async () => {
    render(
      <BrowserRouter>
        <ProductCategoriesList />
      </BrowserRouter>
    );

    // Loading spinner should be present initially
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  it('displays search functionality', async () => {
    render(
      <BrowserRouter>
        <ProductCategoriesList />
      </BrowserRouter>
    );

    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search categories...')).toBeInTheDocument();
    });
  });
});
