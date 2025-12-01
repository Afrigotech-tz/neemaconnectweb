import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { musicService } from '../../services/musicService';
import { Song, CreateMusicData, UpdateMusicData } from '../../types/musicTypes';
import MusicList from '../../components/music/MusicList';
import MusicForm from '../../components/music/MusicForm';
import MusicView from '../../components/music/MusicView';

const MusicPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'release_date' | 'genre'>('release_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  const queryClient = useQueryClient();

  // Fetch songs with React Query
  const { data: songsResponse, isLoading } = useQuery({
    queryKey: ['songs', currentPage],
    queryFn: () => musicService.getSongs(currentPage),
    placeholderData: (previousData) => previousData,
  });

  const songs = songsResponse?.data?.data || [];
  const totalPages = songsResponse?.data?.last_page || 1;

  // Create song mutation
  const createSongMutation = useMutation({
    mutationFn: (data: CreateMusicData) => musicService.createSong(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ['songs'] });
        setShowFormModal(false);
        setEditingSong(null);
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error('Failed to create song');
    },
  });

  // Update song mutation
  const updateSongMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMusicData }) =>
      musicService.updateSong(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ['songs'] });
        setShowFormModal(false);
        setEditingSong(null);
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error('Failed to update song');
    },
  });

  // Delete song mutation
  const deleteSongMutation = useMutation({
    mutationFn: (id: number) => musicService.deleteSong(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ['songs'] });
        setShowDeleteDialog(false);
        setSongToDelete(null);
      } else {
        toast.error(response.message);
      }
    },
    onError: () => {
      toast.error('Failed to delete song');
    },
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSortChange = (field: 'release_date' | 'genre') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleViewSong = (song: Song) => {
    setSelectedSong(song);
    setShowViewModal(true);
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setShowFormModal(true);
  };

  const handleDeleteSong = (song: Song) => {
    setSongToDelete(song);
    setShowDeleteDialog(true);
  };

  const handleAddSong = () => {
    setEditingSong(null);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (data: CreateMusicData | UpdateMusicData) => {
    if (editingSong) {
      await updateSongMutation.mutateAsync({ id: editingSong.id, data: data as UpdateMusicData });
    } else {
      await createSongMutation.mutateAsync(data as CreateMusicData);
    }
  };

  const handleConfirmDelete = async () => {
    if (songToDelete) {
      await deleteSongMutation.mutateAsync(songToDelete.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Music Library</h1>
          <p className="text-gray-600 mt-2">
            Browse and manage your music collection
          </p>
        </div>
      </div>

      <MusicList
        songs={songs}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        searchTerm={searchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
        onViewSong={handleViewSong}
        onEditSong={handleEditSong}
        onDeleteSong={handleDeleteSong}
        onAddSong={handleAddSong}
      />

      <MusicView
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        song={selectedSong}
      />

      <MusicForm
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        song={editingSong}
        loading={createSongMutation.isPending || updateSongMutation.isPending}
      />

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && songToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Song</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{songToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteSongMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleteSongMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPage;
