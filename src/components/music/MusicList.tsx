import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Search,
  Eye,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  Plus,
  Music2,
  Users,
  CalendarDays,
  Tags,
  LayoutGrid,
  List,
} from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredSongs = useMemo(
    () =>
      songs.filter(
        (song) =>
          song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.choir.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [songs, searchTerm]
  );

  const sortedSongs = useMemo(
    () =>
      [...filteredSongs].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (sortOrder === 'asc') return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }),
    [filteredSongs, sortBy, sortOrder]
  );

  const stats = useMemo(() => {
    const choirs = new Set(songs.map((song) => song.choir.trim()).filter(Boolean));
    const genres = new Set(songs.map((song) => song.genre.trim()).filter(Boolean));
    const latestRelease = songs.reduce<string | null>((latest, song) => {
      if (!song.release_date) return latest;
      if (!latest) return song.release_date;
      return new Date(song.release_date) > new Date(latest) ? song.release_date : latest;
    }, null);

    return {
      totalSongs: songs.length,
      choirs: choirs.size,
      genres: genres.size,
      latestRelease,
    };
  }, [songs]);

  const toggleSort = (field: 'release_date' | 'genre') => {
    onSortChange(field);
  };

  const formatReleaseDate = (dateValue: string) => {
    if (!dateValue) return '-';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Songs</p>
            <Music2 className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.totalSongs}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Choirs</p>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.choirs}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Genres</p>
            <Tags className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.genres}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Latest Release</p>
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-sm font-semibold">{stats.latestRelease ? formatReleaseDate(stats.latestRelease) : '-'}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Music Collection</h2>
            <p className="text-sm text-muted-foreground">Advanced library view with quick management tools</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4 mr-1" />
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Cards
            </Button>
            <Button onClick={onAddSong}>
              <Plus className="h-4 w-4 mr-2" />
              Add Music
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by song name or choir..."
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('release_date')}
              className="w-full"
            >
              Date
              {sortBy === 'release_date' ? (
                sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
              ) : null}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSort('genre')}
              className="w-full"
            >
              Genre
              {sortBy === 'genre' ? (
                sortOrder === 'asc' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
              ) : null}
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Choir</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : sortedSongs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No songs found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedSongs.map((song) => (
                  <TableRow key={song.id}>
                    <TableCell>{song.id}</TableCell>
                    <TableCell className="font-medium">{song.name}</TableCell>
                    <TableCell>{song.choir}</TableCell>
                    <TableCell>{formatReleaseDate(song.release_date)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{song.genre}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{song.description}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => onViewSong(song)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onEditSong(song)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDeleteSong(song)}>
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            <div className="md:col-span-2 xl:col-span-3 rounded-xl border bg-card p-10 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground">Loading songs...</p>
            </div>
          ) : sortedSongs.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3 rounded-xl border bg-card p-10 text-center text-muted-foreground">
              No songs found.
            </div>
          ) : (
            sortedSongs.map((song) => (
              <div key={song.id} className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{song.name}</p>
                    <p className="text-sm text-muted-foreground">{song.choir}</p>
                  </div>
                  <Badge variant="secondary">{song.genre}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{song.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Released: {formatReleaseDate(song.release_date)}</span>
                  <span>#{song.id}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onViewSong(song)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onEditSong(song)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onDeleteSong(song)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
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
