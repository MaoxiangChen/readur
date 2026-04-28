import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Grid from '@mui/material/GridLegacy';
import type { DocumentInfoFormData } from '../../types/documentInfo';
import {
  CURRENCY_OPTIONS,
  CONTRACT_STATUS_OPTIONS,
  SETTLEMENT_METHOD_OPTIONS,
} from '../../types/documentInfo';

interface DocumentInfoFormProps {
  formData: DocumentInfoFormData;
  onChange: (field: keyof DocumentInfoFormData) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }> | { target: { value: unknown } }) => void;
  readOnly?: boolean;
}

export const DocumentInfoForm: React.FC<DocumentInfoFormProps> = ({
  formData,
  onChange,
  readOnly = false,
}) => {
  const handleChange = (field: keyof DocumentInfoFormData) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }> | { target: { value: unknown } }
  ) => {
    onChange(field)(event);
  };

  const handleSelectChange = (field: keyof DocumentInfoFormData) => (
    event: { target: { value: unknown } }
  ) => {
    onChange(field)(event);
  };

  return (
    <Box>
      {/* 基本信息 */}
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          基本信息
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="合同名称"
            value={formData.documentName}
            onChange={handleChange('documentName')}
            disabled={readOnly}
            required
            sx={{
              '& .MuiInputLabel-asterisk': { color: 'error.main' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="合同编号"
            value={formData.documentNumber}
            onChange={handleChange('documentNumber')}
            disabled={readOnly}
            required
            sx={{
              '& .MuiInputLabel-asterisk': { color: 'error.main' },
            }}
          />
        </Grid>

        {/* 甲乙方 */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
            甲乙方
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="甲方"
            value={formData.partyA}
            onChange={handleChange('partyA')}
            disabled={readOnly}
            required
            sx={{
              '& .MuiInputLabel-asterisk': { color: 'error.main' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="乙方"
            value={formData.partyB}
            onChange={handleChange('partyB')}
            disabled={readOnly}
            required
            sx={{
              '& .MuiInputLabel-asterisk': { color: 'error.main' },
            }}
          />
        </Grid>

        {/* 合同金额 */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
            合同金额
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="合同金额"
            value={formData.contractAmount ?? ''}
            onChange={handleChange('contractAmount')}
            type="number"
            inputProps={{ step: '0.01' }}
            disabled={readOnly}
            required
            sx={{
              '& .MuiInputLabel-asterisk': { color: 'error.main' },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>币种</InputLabel>
            <Select
              value={formData.currency || 'CNY'}
              label="币种"
              onChange={handleSelectChange('currency')}
              disabled={readOnly}
            >
              {CURRENCY_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>是否签单</InputLabel>
            <Select
              value={formData.isSigned === undefined ? '' : formData.isSigned.toString()}
              label="是否签单"
              onChange={handleSelectChange('isSigned')}
              disabled={readOnly}
            >
              <MenuItem value="true">是</MenuItem>
              <MenuItem value="false">否</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="签订时间"
            value={formData.signingDate}
            onChange={handleChange('signingDate')}
            type="date"
            InputLabelProps={{ shrink: true }}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>合同状态</InputLabel>
            <Select
              value={formData.contractStatus || ''}
              label="合同状态"
              onChange={handleSelectChange('contractStatus')}
              disabled={readOnly}
            >
              {CONTRACT_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 联系方式 */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
            联系方式
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="联系人"
            value={formData.contactPerson}
            onChange={handleChange('contactPerson')}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="联系方式"
            value={formData.contactPhone}
            onChange={handleChange('contactPhone')}
            disabled={readOnly}
          />
        </Grid>

        {/* 服务信息 */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
            服务信息
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="服务种类"
            value={formData.serviceType}
            onChange={handleChange('serviceType')}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="服务地点"
            value={formData.serviceLocation}
            onChange={handleChange('serviceLocation')}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="开始时间"
            value={formData.startDate}
            onChange={handleChange('startDate')}
            type="date"
            InputLabelProps={{ shrink: true }}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="结束时间"
            value={formData.endDate}
            onChange={handleChange('endDate')}
            type="date"
            InputLabelProps={{ shrink: true }}
            disabled={readOnly}
          />
        </Grid>

        {/* 地址信息 */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
            地址信息
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="街道"
            value={formData.street}
            onChange={handleChange('street')}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="地址"
            value={formData.address}
            onChange={handleChange('address')}
            disabled={readOnly}
          />
        </Grid>

        {/* 清运信息 */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 2 }}>
            清运信息
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="清运时间"
            value={formData.cleaningTime}
            onChange={handleChange('cleaningTime')}
            type="time"
            InputLabelProps={{ shrink: true }}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="清运量"
            value={formData.cleaningVolume ?? ''}
            onChange={handleChange('cleaningVolume')}
            type="number"
            inputProps={{ step: '0.01' }}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="单价"
            value={formData.unitPrice ?? ''}
            onChange={handleChange('unitPrice')}
            type="number"
            inputProps={{ step: '0.01' }}
            disabled={readOnly}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>结算方式</InputLabel>
            <Select
              value={formData.settlementMethod || ''}
              label="结算方式"
              onChange={handleSelectChange('settlementMethod')}
              disabled={readOnly}
            >
              {SETTLEMENT_METHOD_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentInfoForm;