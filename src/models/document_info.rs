use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow, ToSchema)]
pub struct DocumentInfo {
    pub id: Uuid,
    pub document_id: Uuid,
    pub document_name: Option<String>,
    pub document_number: Option<String>,
    pub party_a: Option<String>,
    pub party_b: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub contract_amount: Option<String>,
    pub currency: Option<String>,
    pub is_signed: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub signing_date: Option<DateTime<Utc>>,
    pub contract_status: Option<String>,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub service_type: Option<String>,
    pub service_location: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start_date: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end_date: Option<DateTime<Utc>>,
    pub street: Option<String>,
    pub address: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cleaning_time: Option<DateTime<Utc>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cleaning_volume: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unit_price: Option<String>,
    pub settlement_method: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}