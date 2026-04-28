import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Snackbar,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import { documentService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import DocumentInfoForm from './DocumentInfoForm';
import {
  DEFAULT_DOCUMENT_INFO_FORM,
  type DocumentInfoFormData,
  parseApiResponseToFormData,
  isFormDataEmpty,
  formDataToApiPayload,
} from '../../types/documentInfo';

interface InfoTabProps {
  documentId: string;
}

const InfoTab: React.FC<InfoTabProps> = ({ documentId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const hasChanges = useRef(false);

  const [formData, setFormData] = useState<DocumentInfoFormData>(DEFAULT_DOCUMENT_INFO_FORM);

  const fetchDocumentInfo = useCallback(async () => {
    if (!documentId) return;
    try {
      const response = await documentService.getInfo(documentId);
      console.log('Fetched document info:', response.data);
      const parsedData = parseApiResponseToFormData(response.data as unknown as Record<string, unknown>);
      console.log('Parsed document info form data:', parsedData);
      setFormData(parsedData);
      console.log('formData:', formData);
      hasChanges.current = false;
      setError(null);
    } catch (err) {
      setError('无法加载文档信息。');
      console.error('Failed to load document info:', err);
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    setLoading(true);
    fetchDocumentInfo();
  }, [fetchDocumentInfo]);

  const handleFieldChange = (field: keyof DocumentInfoFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }> | { target: { value: unknown } }
  ) => {
    const value = event.target.value;
    hasChanges.current = true;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!documentId) return;

    setIsSaving(true);
    try {
      await documentService.updateInfo(documentId, formDataToApiPayload(formData));
      hasChanges.current = false;
      setSnackbar({
        open: true,
        message: '保存成功！',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: '保存失败，请重试。',
        severity: 'error',
      });
      console.error('Failed to save document info:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {user && (
        <>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">文档信息</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {hasChanges.current && (
                <Chip label="有未保存的更改" color="warning" size="small" />
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={isSaving || !hasChanges.current}
              >
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <DocumentInfoForm formData={formData} onChange={handleFieldChange} />
          </Grid>
        </>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InfoTab;