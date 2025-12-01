import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Eye, Trash2, Edit, ChevronLeft, ChevronRight, SortAsc, SortDesc, Plus } from 'lucide-react';
import { Song } from '../../types/musicTypes';

interface MusicListProps {
  songs: Song[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  searchTerm: string;
  sortBy: 'release_date' | 'genre';
  sortOrder: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onSortChange: (field: 'release_date' | 'genre') => void;
  onPageChange: (page: number) => void;
  onViewSong: (song: Song) => void;
  onEditSong: (song: Song) => void;
  onDeleteSong: (song: Song) => void;
  onAddSong: () => void;
}

const MusicList: React.FC<MusicListProps> = ({
  songs,
  loading,
  currentPage,
  totalPages,
  searchTerm,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortChange,
  onPageChange,
  onViewSong,
  onEditSong,
  onDeleteSong,
  onAddSong,
}) => {
  const filteredSongs = songs.filter(song =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.choir.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSongs = [...filteredSongs].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const toggleSort = (field: 'release_date' | 'genre') => {
    onSortChange(field);
  };

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Music Collection</h2>
        <Button onClick={onAddSong}>
          <Plus className="h-4 w-4 mr-2" />
          Add Music
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or choir..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Choir</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('release_date')}
                  className="h-auto p-0 font-medium"
                >
                  Release Date
                  {sortBy === 'release_date' && (
                    sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSort('genre')}
                  className="h-auto p-0 font-medium"
                >
                  Genre
                  {sortBy === 'genre' && (
                    sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : sortedSongs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No songs found
                </TableCell>
              </TableRow>
            ) : (
              sortedSongs.map((song) => (
                <TableRow key={song.id}>
                  <TableCell>{song.id}</TableCell>
                  <TableCell className="font-medium">{song.name}</TableCell>
                  <TableCell>{song.choir}</TableCell>
                  <TableCell>{new Date(song.release_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{song.genre}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{song.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewSong(song)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditSong(song)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteSong(song)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicList;
