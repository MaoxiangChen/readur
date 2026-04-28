export interface DocumentInfo {
  id: string
  documentId: string
  documentName: string
  documentNumber: string
  partyA: string
  partyB: string
  contractAmount: number
  currency: string
  isSigned: boolean
  signingDate: string
  contractStatus: string
  contactPerson: string
  contactPhone: string
  serviceType: string
  serviceLocation: string
  startDate: string
  endDate: string
  street: string
  address: string
  cleaningTime: string
  cleaningVolume: number
  unitPrice: number
  settlementMethod: string
  createdAt?: string
  updatedAt?: string
}

export interface DocumentInfoFormData {
  documentName: string
  documentNumber: string
  partyA: string
  partyB: string
  contractAmount: number | undefined
  currency: string
  isSigned: boolean | undefined
  signingDate: string
  contractStatus: string
  contactPerson: string
  contactPhone: string
  serviceType: string
  serviceLocation: string
  startDate: string
  endDate: string
  street: string
  address: string
  cleaningTime: string
  cleaningVolume: number | undefined
  unitPrice: number | undefined
  settlementMethod: string
}

export const CURRENCY_OPTIONS = [
  { value: 'CNY', label: '¥ 人民币' },
  { value: 'USD', label: '$ 美元' },
  { value: 'EUR', label: '€ 欧元' },
  { value: 'HKD', label: 'HK$ 港币' },
] as const

export const CONTRACT_STATUS_OPTIONS = [
  { value: 'draft', label: '草稿' },
  { value: 'active', label: '执行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
  { value: 'expired', label: '已过期' },
] as const

export const SETTLEMENT_METHOD_OPTIONS = [
  { value: 'monthly', label: '月结' },
  { value: 'seasonal', label: '季结' },
  { value: 'yearly', label: '年结' },
  { value: 'times', label: '次结' },
  { value: 'realtime', label: '实时结算' },
] as const

export const DEFAULT_DOCUMENT_INFO_FORM: DocumentInfoFormData = {
  documentName: '',
  documentNumber: '',
  partyA: '',
  partyB: '',
  contractAmount: undefined,
  currency: 'CNY',
  isSigned: false,
  signingDate: '',
  contractStatus: '',
  contactPerson: '',
  contactPhone: '',
  serviceType: '',
  serviceLocation: '',
  startDate: '',
  endDate: '',
  street: '',
  address: '',
  cleaningTime: '',
  cleaningVolume: undefined,
  unitPrice: undefined,
  settlementMethod: '',
}

export function parseApiResponseToFormData(data: Record<string, unknown>): DocumentInfoFormData {
  return {
    documentName: (data as any).document_name || '',
    documentNumber: (data as any).document_number || '',
    partyA: (data as any).party_a || '',
    partyB: (data as any).party_b || '',
    contractAmount: (data as any).contract_amount ? parseFloat((data as any).contract_amount) : undefined,
    currency: (data as any).currency || 'CNY',
    isSigned: (data as any).is_signed,
    signingDate: (data as any).signing_date ? formatDateForInput(new Date((data as any).signing_date)) : '',
    contractStatus: (data as any).contract_status || '',
    contactPerson: (data as any).contact_person || '',
    contactPhone: (data as any).contact_phone || '',
    serviceType: (data as any).service_type || '',
    serviceLocation: (data as any).service_location || '',
    startDate: (data as any).start_date ? formatDateForInput(new Date((data as any).start_date)) : '',
    endDate: (data as any).end_date ? formatDateForInput(new Date((data as any).end_date)) : '',
    street: (data as any).street || '',
    address: (data as any).address || '',
    cleaningTime: (data as any).cleaning_time ? formatTimeForInput((data as any).cleaning_time) : '',
    cleaningVolume: (data as any).cleaning_volume ? parseFloat((data as any).cleaning_volume) : undefined,
    unitPrice: (data as any).unit_price ? parseFloat((data as any).unit_price) : undefined,
    settlementMethod: (data as any).settlement_method || '',
  }
}

export function formatDateForInput(date: Date | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

export function formatTimeForInput(time: string | undefined): string {
  if (!time) return ''
  // time format is HH:MM:SS or HH:MM:SS.ffffff
  return time.substring(0, 5) // Return HH:MM
}

export function isFormDataEmpty(formData: DocumentInfoFormData): boolean {
  return Object.values(formData).every(
    value => value === '' || value === undefined || value === false
  )
}

export function formDataToApiPayload(formData: DocumentInfoFormData): Record<string, unknown> {
  return {
    document_name: formData.documentName || null,
    document_number: formData.documentNumber || null,
    party_a: formData.partyA || null,
    party_b: formData.partyB || null,
    contract_amount: formData.contractAmount ?? null,
    currency: formData.currency || null,
    is_signed: formData.isSigned ?? null,
    signing_date: formData.signingDate || null,
    contract_status: formData.contractStatus || null,
    contact_person: formData.contactPerson || null,
    contact_phone: formData.contactPhone || null,
    service_type: formData.serviceType || null,
    service_location: formData.serviceLocation || null,
    start_date: formData.startDate || null,
    end_date: formData.endDate || null,
    street: formData.street || null,
    address: formData.address || null,
    cleaning_time: formData.cleaningTime || null,
    cleaning_volume: formData.cleaningVolume ?? null,
    unit_price: formData.unitPrice ?? null,
    settlement_method: formData.settlementMethod || null,
  }
}