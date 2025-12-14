import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { getToken, removeToken } from './auth/auth-helper';

const AccountSettings = () => {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    newEmail: '',
    confirmNewEmail: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [apiError, setApiError] = useState('');
  const isDirty = useRef(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (authUser && authUser.email) {
      setFormData(f => ({ ...f, email: authUser.email }));
    }
    setLoading(false);
  }, [authUser]);

  const validate = (data) => {
    const newErrors = {};
    if (editMode) {
      if (data.newEmail || data.confirmNewEmail) {
        if (!data.newEmail) newErrors.newEmail = 'New email required';
        if (!data.confirmNewEmail) newErrors.confirmNewEmail = 'Please confirm new email';
        if (data.newEmail && data.confirmNewEmail && data.newEmail !== data.confirmNewEmail) {
          newErrors.confirmNewEmail = 'Emails do not match';
        }
        // Simple email regex
        if (data.newEmail && !/^\S+@\S+\.\S+$/.test(data.newEmail)) {
          newErrors.newEmail = 'Invalid email format';
        }
      }
      if (data.newPassword || data.confirmNewPassword) {
        if (!data.newPassword) newErrors.newPassword = 'New password required';
        if (!data.confirmNewPassword) newErrors.confirmNewPassword = 'Please confirm new password';
        if (data.newPassword && data.confirmNewPassword && data.newPassword !== data.confirmNewPassword) {
          newErrors.confirmNewPassword = 'Passwords do not match';
        }
        if (data.newPassword && data.newPassword.length < 6) {
          newErrors.newPassword = 'Password must be at least 6 characters';
        }
      }
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => {
      const updated = { ...f, [name]: value };
      setErrors(validate(updated));
      isDirty.current = true;
      return updated;
    });
  };

  const handleEdit = () => {
    setEditMode(true);
    isDirty.current = false;
    setErrors({});
    setSuccessMsg('');
    setApiError('');
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(f => ({ ...f, newEmail: '', confirmNewEmail: '', newPassword: '', confirmNewPassword: '' }));
    setErrors({});
    setApiError('');
    isDirty.current = false;
  };

  const handleSave = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setApiError('');
    if (Object.keys(validationErrors).length > 0) return;
    if (!formData.newEmail && !formData.newPassword) {
      setErrors({ form: 'No changes to save.' });
      return;
    }
    setShowPasswordDialog(true);
  };

  const handleDialogClose = () => {
    setShowPasswordDialog(false);
    setCurrentPassword('');
  };

  const handleDialogSubmit = async () => {
    setApiError('');
    try {
      const payload = {
        currentPassword,
      };
      if (formData.newEmail) {
        payload.newEmail = formData.newEmail;
        payload.confirmNewEmail = formData.confirmNewEmail;
      }
      if (formData.newPassword) {
        payload.newPassword = formData.newPassword;
        payload.confirmNewPassword = formData.confirmNewPassword;
      }
      const token = getToken();
      const res = await axios.patch('/api/users/settings', payload, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setEditMode(false);
        setFormData(f => ({ ...f, email: formData.newEmail || f.email, newEmail: '', confirmNewEmail: '', newPassword: '', confirmNewPassword: '' }));
        isDirty.current = false;
      } else {
        setApiError(res.data.message || 'Update failed.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('An error occurred.');
      }
    } finally {
      setShowPasswordDialog(false);
      setCurrentPassword('');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, mt: 0 }}>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1, mt: 0 }}>
              Account Settings
            </Typography>
          </Box>
          {successMsg && (
            <Box sx={{ mb: 2 }}>
              <Typography color="success.main">{successMsg}</Typography>
            </Box>
          )}
          {apiError && (
            <Box sx={{ mb: 2 }}>
              <Typography color="error.main">{apiError}</Typography>
            </Box>
          )}
          <form onSubmit={handleSave}>
            <Stack spacing={3}>
              {/* Email */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="email">
                  Email
                </Typography>
                {!editMode ? (
                  <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                    {formData.email}
                  </Typography>
                ) : (
                  <>
                    <TextField
                      fullWidth
                      id="newEmail"
                      name="newEmail"
                      label="New Email"
                      placeholder="Enter new email"
                      value={formData.newEmail}
                      onChange={handleChange}
                      error={!!errors.newEmail}
                      helperText={errors.newEmail}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      id="confirmNewEmail"
                      name="confirmNewEmail"
                      label="Confirm New Email"
                      placeholder="Re-enter new email"
                      value={formData.confirmNewEmail}
                      onChange={handleChange}
                      error={!!errors.confirmNewEmail}
                      helperText={errors.confirmNewEmail}
                    />
                  </>
                )}
              </Box>
              {/* Password */}
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }} component="label" htmlFor="password">
                  Password
                </Typography>
                {!editMode ? (
                  <Typography sx={{ pl: 1, py: 1 }} color="text.secondary">
                    ********
                  </Typography>
                ) : (
                  <>
                    <TextField
                      fullWidth
                      id="newPassword"
                      name="newPassword"
                      label="New Password"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowNewPassword((show) => !show)}
                              onMouseDown={e => e.preventDefault()}
                              edge="end"
                            >
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                    <TextField
                      fullWidth
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      label="Confirm New Password"
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={formData.confirmNewPassword}
                      onChange={handleChange}
                      error={!!errors.confirmNewPassword}
                      helperText={errors.confirmNewPassword}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowConfirmNewPassword((show) => !show)}
                              onMouseDown={e => e.preventDefault()}
                              edge="end"
                            >
                              {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                {!editMode ? (
                  <>
                    <Button variant="contained" color="primary" onClick={handleEdit} sx={{ flex: 1 }}>
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ flex: 1 }}
                      onClick={() => { setShowDeleteDialog(true); setDeleteError(''); setDeletePassword(''); }}
                    >
                      Delete Account
                    </Button>
                  </>
                ) : (
                  <>
                    <Button fullWidth variant="contained" color="primary" type="submit">
                      Save Changes
                    </Button>
                    <Button fullWidth variant="outlined" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
                  {/* Delete Account Dialog */}
                  <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                    <DialogTitle sx={{ color: 'error.main' }}>Delete Account</DialogTitle>
                    <DialogContent>
                      <Typography color="error" sx={{ mb: 2, fontWeight: 600 }}>
                        Warning: This action is <b>permanent</b> and cannot be undone.<br />
                        All your data will be deleted and cannot be recovered.<br />
                        You will be immediately logged out.
                      </Typography>
                      <Typography sx={{ mb: 2 }}>
                        Please enter your current password to confirm account deletion.
                      </Typography>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="deletePassword"
                        label="Current Password"
                        type={showDeletePassword ? 'text' : 'password'}
                        fullWidth
                        value={deletePassword}
                        onChange={e => setDeletePassword(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label={showDeletePassword ? 'Hide password' : 'Show password'}
                                onClick={() => setShowDeletePassword((show) => !show)}
                                onMouseDown={e => e.preventDefault()}
                                edge="end"
                              >
                                {showDeletePassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                        error={!!deleteError}
                        helperText={deleteError}
                        disabled={deleting}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setShowDeleteDialog(false)} disabled={deleting}>Cancel</Button>
                      <Button
                        onClick={async () => {
                          setDeleteError('');
                          setDeleting(true);
                          try {
                            const token = getToken();
                            const res = await axios.delete(`/api/users/${authUser?.uid}`, {
                              headers: token ? { Authorization: `Bearer ${token}` } : {},
                              data: { currentPassword: deletePassword },
                              withCredentials: true
                            });
                            if (res.data.success) {
                              removeToken();
                              window.location.href = '/';
                            } else {
                              setDeleteError(res.data.message || 'Delete failed.');
                            }
                          } catch (err) {
                            if (err.response && err.response.data && err.response.data.message) {
                              setDeleteError(err.response.data.message);
                            } else {
                              setDeleteError('An error occurred.');
                            }
                          } finally {
                            setDeleting(false);
                          }
                        }}
                        color="error"
                        variant="contained"
                        disabled={!deletePassword || deleting}
                      >
                        Confirm Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
            </Stack>
          </form>
        </CardContent>
      </Card>
      {/* Current Password Dialog */}
      <Dialog open={showPasswordDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="currentPassword"
            label="Current Password"
            type={showCurrentPassword ? 'text' : 'password'}
            fullWidth
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowCurrentPassword((show) => !show)}
                    onMouseDown={e => e.preventDefault()}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleDialogSubmit} variant="contained" color="primary" disabled={!currentPassword}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AccountSettings;
