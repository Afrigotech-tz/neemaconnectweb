import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import MusicForm from '@/components/music/MusicForm';
import MusicList from '@/components/music/MusicList';
import MusicView from '@/components/music/MusicView';
import { musicService } from '@/services/musicService/musicService';
import { CreateMusicData, Song, UpdateMusicData } from '@/types/musicTypes';
import { usePermissions } from '@/hooks/usePermissions';

const MusicPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [choirFilter, setChoirFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedChoir, setDebouncedChoir] = useState('');
  const [debouncedGenre, setDebouncedGenre] = useState('');
  const [sortBy, setSortBy] = useState<'release_date' | 'genre'>('release_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const { canCreate, canEdit, canDelete } = usePermissions();

  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchTerm.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedChoir(choirFilter.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [choirFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedGenre(genreFilter.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [genreFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, debouncedChoir, debouncedGenre, perPage]);

  const { data: songsResponse, isLoading } = useQuery({
    queryKey: ['songs', currentPage, perPage, debouncedSearch, debouncedChoir, debouncedGenre],
    queryFn: () =>
      musicService.getSongs({
        page: currentPage,
        per_page: perPage,
        search: debouncedSearch || undefined,
        choir: debouncedChoir || undefined,
        genre: debouncedGenre || undefined,
      }),
    placeholderData: (previousData) => previousData,
  });

  const songs = songsResponse?.data?.data || [];
  const totalPages = songsResponse?.data?.last_page || 1;
  const totalItems = songsResponse?.data?.total || 0;

  const createSongMutation = useMutation({
    mutationFn: (data: CreateMusicData) => musicService.createSong(data),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      setShowFormModal(false);
      setEditingSong(null);
    },
    onError: () => {
      toast.error('Failed to upload music');
    },
  });

  const updateSongMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMusicData }) => musicService.updateSong(id, data),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      setShowFormModal(false);
      setEditingSong(null);
    },
    onError: () => {
      toast.error('Failed to update music');
    },
  });

  const deleteSongMutation = useMutation({
    mutationFn: (id: number) => musicService.deleteSong(id),
    onSuccess: (response) => {
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      setShowDeleteDialog(false);
      setSongToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete music');
    },
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortChange = (field: 'release_date' | 'genre') => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortBy(field);
    setSortOrder('asc');
  };

  const handleViewSong = async (song: Song) => {
    const response = await musicService.getSong(song.id);
    if (response.success && response.data) {
      setSelectedSong(response.data);
    } else {
      setSelectedSong(song);
      toast.error(response.message || 'Failed to load full music details');
    }
    setShowViewModal(true);
  };

  const handleEditSong = (song: Song) => {
    if (!canEdit('music')) {
      toast.error('You do not have permission to edit music.');
      return;
    }
    setEditingSong(song);
    setShowFormModal(true);
  };

  const handleDeleteSong = (song: Song) => {
    if (!canDelete('music')) {
      toast.error('You do not have permission to delete music.');
      return;
    }
    setSongToDelete(song);
    setShowDeleteDialog(true);
  };

  const handleAddSong = () => {
    if (!canCreate('music')) {
      toast.error('You do not have permission to create music.');
      return;
    }
    setEditingSong(null);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (data: CreateMusicData | UpdateMusicData) => {
    if (editingSong) {
      await updateSongMutation.mutateAsync({ id: editingSong.id, data: data as UpdateMusicData });
      return;
    }
    await createSongMutation.mutateAsync(data as CreateMusicData);
  };

  const handleConfirmDelete = async () => {
    if (!songToDelete) return;
    await deleteSongMutation.mutateAsync(songToDelete.id);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-primary via-primary to-primary-glow px-6 py-8 text-primary-foreground shadow-lg">
        <h1 className="text-3xl font-bold">Music Library</h1>
        <p className="mt-2 text-primary-foreground/85">
          Manage songs using the official Music API: listing, filters, upload, details, update, and delete.
        </p>
      </div>

      <MusicList
        songs={songs}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        searchTerm={searchTerm}
        choirFilter={choirFilter}
        genreFilter={genreFilter}
        perPage={perPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSearchChange={setSearchTerm}
        onChoirFilterChange={setChoirFilter}
        onGenreFilterChange={setGenreFilter}
        onPerPageChange={setPerPage}
        onSortChange={handleSortChange}
        onPageChange={handlePageChange}
        onViewSong={handleViewSong}
        onEditSong={handleEditSong}
        onDeleteSong={handleDeleteSong}
        onAddSong={handleAddSong}
        canCreate={canCreate('music')}
        canEdit={canEdit('music')}
        canDelete={canDelete('music')}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Music</AlertDialogTitle>
            <AlertDialogDescription>
              {songToDelete
                ? `Are you sure you want to delete "${songToDelete.name}"? This action cannot be undone.`
                : 'Are you sure you want to delete this music item?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmDelete();
              }}
              disabled={deleteSongMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSongMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MusicPage;
