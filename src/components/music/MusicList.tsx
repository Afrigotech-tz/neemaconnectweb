import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  Edit,
  Eye,
  LayoutGrid,
  List,
  Loader2,
  Music2,
  Plus,
  Search,
  SortAsc,
  SortDesc,
  Tags,
  Trash2,
  Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RadioPagination from '@/components/ui/radio-pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Song } from '@/types/musicTypes';

interface MusicListProps {
  songs: Song[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  searchTerm: string;
  choirFilter: string;
  genreFilter: string;
  perPage: number;
  sortBy: 'release_date' | 'genre';
  sortOrder: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onChoirFilterChange: (value: string) => void;
  onGenreFilterChange: (value: string) => void;
  onPerPageChange: (value: number) => void;
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
  totalItems,
  searchTerm,
  choirFilter,
  genreFilter,
  perPage,
  sortBy,
  sortOrder,
  onSearchChange,
  onChoirFilterChange,
  onGenreFilterChange,
  onPerPageChange,
  onSortChange,
  onPageChange,
  onViewSong,
  onEditSong,
  onDeleteSong,
  onAddSong,
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const sortedSongs = useMemo(
    () =>
      [...songs].sort((a, b) => {
        const aValue = (a[sortBy] || '').toString();
        const bValue = (b[sortBy] || '').toString();
        if (sortOrder === 'asc') return aValue.localeCompare(bValue);
        return bValue.localeCompare(aValue);
      }),
    [songs, sortBy, sortOrder]
  );

  const stats = useMemo(() => {
    const choirs = new Set(songs.map((song) => song.choir.trim()).filter(Boolean));
    const genres = new Set(songs.map((song) => (song.genre || '').trim()).filter(Boolean));
    const latestRelease = songs.reduce<string | null>((latest, song) => {
      if (!song.release_date) return latest;
      if (!latest) return song.release_date;
      return new Date(song.release_date) > new Date(latest) ? song.release_date : latest;
    }, null);

    return {
      itemsOnPage: songs.length,
      totalItems,
      choirs: choirs.size,
      genres: genres.size,
      latestRelease,
    };
  }, [songs, totalItems]);

  const formatReleaseDate = (dateValue: string) => {
    if (!dateValue) return '-';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return dateValue;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Total Music</p>
            <Music2 className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.totalItems}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">On Current Page</p>
            <List className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold">{stats.itemsOnPage}</p>
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
            <p className="text-sm text-muted-foreground">Latest Release</p>
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 text-sm font-semibold">{stats.latestRelease ? formatReleaseDate(stats.latestRelease) : '-'}</p>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Music Library</h2>
            <p className="text-sm text-muted-foreground">Filter and manage music using live API endpoints</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <List className="mr-1 h-4 w-4" />
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
            >
              <LayoutGrid className="mr-1 h-4 w-4" />
              Cards
            </Button>
            <Button onClick={onAddSong}>
              <Plus className="mr-2 h-4 w-4" />
              Add Music
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="relative xl:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by music name..."
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="pl-9"
            />
          </div>
          <Input
            placeholder="Filter by choir"
            value={choirFilter}
            onChange={(event) => onChoirFilterChange(event.target.value)}
          />
          <Input
            placeholder="Filter by genre"
            value={genreFilter}
            onChange={(event) => onGenreFilterChange(event.target.value)}
          />
          <select
            value={String(perPage)}
            onChange={(event) => onPerPageChange(Number(event.target.value))}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            {[10, 20, 30, 50].map((value) => (
              <option key={value} value={value}>
                {value} per page
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSortChange('release_date')}
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
              onClick={() => onSortChange('genre')}
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
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cover</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Choir</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Audio</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : sortedSongs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                    No music found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedSongs.map((song) => (
                  <TableRow key={song.id}>
                    <TableCell>{song.id}</TableCell>
                    <TableCell>
                      {song.picture ? (
                        <img
                          src={song.picture}
                          alt={song.name}
                          className="h-10 w-10 rounded-md object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <Music2 className="h-4 w-4" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{song.name}</TableCell>
                    <TableCell>{song.choir}</TableCell>
                    <TableCell>{formatReleaseDate(song.release_date)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{song.genre || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      {song.audio_file ? (
                        <Badge variant="outline">Available</Badge>
                      ) : (
                        <Badge variant="secondary">None</Badge>
                      )}
                    </TableCell>
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="md:col-span-2 xl:col-span-3 rounded-xl border bg-card p-10 text-center">
              <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin" />
              <p className="text-muted-foreground">Loading music...</p>
            </div>
          ) : sortedSongs.length === 0 ? (
            <div className="md:col-span-2 xl:col-span-3 rounded-xl border bg-card p-10 text-center text-muted-foreground">
              No music found.
            </div>
          ) : (
            sortedSongs.map((song) => (
              <div key={song.id} className="space-y-3 rounded-xl border bg-card p-4">
                <div className="overflow-hidden rounded-lg border bg-muted/20">
                  {song.picture ? (
                    <img
                      src={song.picture}
                      alt={song.name}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center text-muted-foreground">
                      <Music2 className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{song.name}</p>
                    <p className="text-sm text-muted-foreground">{song.choir}</p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Tags className="h-3 w-3" />
                    {song.genre || 'N/A'}
                  </Badge>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">{song.description || '-'}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Released: {formatReleaseDate(song.release_date)}</span>
                  <span>#{song.id}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onViewSong(song)}>
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onEditSong(song)}>
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => onDeleteSong(song)}>
                    <Trash2 className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <RadioPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MusicList;
