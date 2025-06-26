import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  TextField, Select, MenuItem, Button, Pagination, InputLabel, FormControl,
  IconButton, CircularProgress
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { addBook, deleteBook, getBooks, updateBook } from './api';
import BookDialog from './components/BookDialog';

const genres = ["Fiction", "Non-fiction", "Fantasy", "Sci-fi"];
const statuses = ["Available", "Issued"];

const Book = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBook, setCurrentBook] = useState({
    id: null, title: '', author: '', genre: '', year: '', status: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    const cleanBook = {
      title: data.title.trim(),
      author: data.author.trim(),
      genre: data.genre,
      year: Number(data.year),
      status: data.status
    };

    try {
      if (editMode) {
        await updateBook(currentBook._id, cleanBook);
      } else {
        await addBook(cleanBook);
      }
      await fetchBooks();
      handleClose();
    } catch (err) {
      console.error("Failed to save book:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      await fetchBooks();
    } catch (err) {
      console.error("Failed to delete book:", err.response?.data || err.message);
    }
  };

  const handleOpen = (book = null) => {
    setCurrentBook(book || { id: null, title: '', author: '', genre: '', year: '', status: '' });
    setEditMode(!!book);
    setOpenModal(true);
  };

  const handleClose = () => setOpenModal(false);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter ? book.genre === genreFilter : true;
    const matchesStatus = statusFilter ? book.status === statusFilter : true;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const rowsPerPage = 10;
  const paginatedBooks = filteredBooks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, genreFilter, statusFilter]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-7xl mx-auto">
      <h2 className='text-3xl font-bold text-gray-800 mb-6'>📚 Book Management Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <TextField
          label="Search by Title or Author"
          fullWidth
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <FormControl fullWidth>
          <InputLabel>Genre</InputLabel>
          <Select value={genreFilter} label="Genre" onChange={e => setGenreFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {genres.map(genre => <MenuItem key={genre} value={genre}>{genre}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            {statuses.map(status => <MenuItem key={status} value={status}>{status}</MenuItem>)}
          </Select>
        </FormControl>
        <Button fullWidth variant="contained" onClick={() => handleOpen()} className="font-bold">
          + Add Book
        </Button>
      </div>

      <div className="bg-white rounded-md shadow-md overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <CircularProgress />
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBooks.length > 0 ? paginatedBooks.map(book => (
                <TableRow key={book._id} className="hover:bg-gray-50">
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.year}</TableCell>
                  <TableCell>{book.status}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(book)}><Edit color="primary" /></IconButton>
                    <IconButton onClick={() => handleDelete(book._id)}><Delete color="error" /></IconButton>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">No books found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <Pagination
          count={Math.ceil(filteredBooks.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </div>

      <BookDialog
        open={openModal}
        onClose={handleClose}
        onSubmit={handleSave}
        initialData={currentBook}
        editMode={editMode}
        genres={genres}
        statuses={statuses}
      />
    </div>
  );
};

export default Book;
