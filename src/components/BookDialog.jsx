import React, { useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  FormHelperText
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

const BookDialog = ({ open, onClose, onSubmit, initialData, editMode, genres, statuses }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: initialData
  });

  useEffect(() => {
    if (open) reset(initialData);
  }, [open, initialData, reset]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="text-xl font-semibold text-gray-800">
        {editMode ? 'Edit Book' : 'Add New Book'}
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
          {/* Title - full width row */}
          <div className="w-full">
            <TextField
              label="Title"
              fullWidth
              {...register("title", { required: "Title is required" })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </div>

          {/* 2-column grid responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Author */}
            <TextField
              label="Author"
              fullWidth
              {...register("author", { required: "Author is required" })}
              error={!!errors.author}
              helperText={errors.author?.message}
            />

            {/* Genre */}
            <FormControl fullWidth error={!!errors.genre}>
              <InputLabel>Genre</InputLabel>
              <Controller
                name="genre"
                control={control}
                rules={{ required: "Genre is required" }}
                render={({ field }) => (
                  <Select {...field} label="Genre">
                    {genres.map(g => (
                      <MenuItem key={g} value={g}>{g}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.genre?.message}</FormHelperText>
            </FormControl>

            {/* Year */}
            <TextField
              label="Year"
              type="number"
              fullWidth
              {...register("year", {
                required: "Year is required",
                min: { value: 1500, message: "Minimum year is 1500" },
                max: { value: new Date().getFullYear(), message: "Future year not allowed" }
              })}
              error={!!errors.year}
              helperText={errors.year?.message}
            />

            {/* Status */}
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select {...field} label="Status">
                    {statuses.map(s => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.status?.message}</FormHelperText>
            </FormControl>
          </div>

          {/* Buttons */}
          <DialogActions className="mt-4 px-0">
            <Button onClick={onClose} className="font-semibold">Cancel</Button>
            <Button type="submit" variant="contained" className="bg-blue-600 text-white hover:bg-blue-700 font-semibold">
              {editMode ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookDialog;
