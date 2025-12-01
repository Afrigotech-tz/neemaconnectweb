import { AxiosError } from 'axios';
import { Song, PaginatedResponse, ApiResponse, CreateMusicData, UpdateMusicData } from '../types/musicTypes';
import api from './api';

interface ErrorResponse {
  message: string;
}

export const musicService = {
  // Get all songs with pagination
  async getSongs(page: number = 1): Promise<ApiResponse<PaginatedResponse<Song>>> {
    try {
      const response = await api.get(`/music?page=${page}`);
      return {
        success: true,
        message: 'Songs fetched successfully',
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch songs',
      };
    }
  },

  // Get song by ID
  async getSong(id: number): Promise<ApiResponse<Song>> {
    try {
      const response = await api.get(`/music/${id}`);
      return {
        success: true,
        message: 'Song fetched successfully',
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to fetch song',
      };
    }
  },

  // Delete song by ID
  async deleteSong(id: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/music/${id}`);
      return {
        success: true,
        message: 'Song deleted successfully',
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to delete song',
      };
    }
  },

  // Create new song
  async createSong(data: CreateMusicData): Promise<ApiResponse<Song>> {
    try {
      const response = await api.post('/music', data);
      return {
        success: true,
        message: 'Song created successfully',
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to create song',
      };
    }
  },

  // Update song by ID
  async updateSong(id: number, data: UpdateMusicData): Promise<ApiResponse<Song>> {
    try {
      const response = await api.put(`/music/${id}`, data);
      return {
        success: true,
        message: 'Song updated successfully',
        data: response.data,
      };
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Failed to update song',
      };
    }
  },
};
