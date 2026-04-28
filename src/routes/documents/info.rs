use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{delete, get, put},
    Json, Router,
};
use chrono::{DateTime, NaiveDate, NaiveTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::Row;
use std::sync::Arc;
use tracing::{error, info};

use crate::auth::AuthUser;
use crate::AppState;

use super::crud::DocumentError;

fn naive_date_to_datetime(d: NaiveDate) -> DateTime<Utc> {
    DateTime::<Utc>::from_naive_utc_and_offset(d.and_hms_opt(0, 0, 0).unwrap(), Utc)
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/{id}/info", get(get_document_info))
        .route("/{id}/info", put(update_document_info))
        .route("/{id}/info", delete(delete_document_info))
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DocumentInfoResponse {
    pub id: Option<String>,
    pub document_id: String,
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
    pub cleaning_time: Option<NaiveTime>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cleaning_volume: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unit_price: Option<String>,
    pub settlement_method: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Deserialize, Debug)]
pub struct UpdateDocumentInfoRequest {
    pub document_id: Option<uuid::Uuid>,
    pub document_name: Option<String>,
    pub document_number: Option<String>,
    pub party_a: Option<String>,
    pub party_b: Option<String>,
    pub contract_amount: Option<f64>,
    pub currency: Option<String>,
    pub is_signed: Option<bool>,
    pub signing_date: Option<String>,
    pub contract_status: Option<String>,
    pub contact_person: Option<String>,
    pub contact_phone: Option<String>,
    pub service_type: Option<String>,
    pub service_location: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub street: Option<String>,
    pub address: Option<String>,
    pub cleaning_time: Option<String>,
    pub cleaning_volume: Option<f64>,
    pub unit_price: Option<f64>,
    pub settlement_method: Option<String>,
}

pub async fn get_document_info(
    State(state): State<Arc<AppState>>,
    auth_user: AuthUser,
    Path(document_id): Path<uuid::Uuid>,
) -> Result<Json<DocumentInfoResponse>, DocumentError> {
    let _document = state
        .db
        .get_document_by_id(document_id, auth_user.user.id, auth_user.user.role)
        .await
        .map_err(|e| {
            error!("Database error getting document {}: {}", document_id, e);
            DocumentError::NotFound
        })?
        .ok_or(DocumentError::NotFound)?;

    let result = sqlx::query(
        "SELECT id, document_id, document_name, document_number, party_a, party_b,
            contract_amount, currency, is_signed, signing_date, contract_status,
            contact_person, contact_phone, service_type, service_location,
            start_date, end_date, street, address, cleaning_time,
            cleaning_volume, unit_price, settlement_method, created_at, updated_at
        FROM document_info WHERE document_id = $1"
    )
    .bind(document_id)
    .fetch_optional(state.db.get_pool())
    .await
    .map_err(|e| {
        error!("Database error getting Document info: {}", e);
        DocumentError::Internal(format!("Failed to get Document info: {}", e))
    })?;

    match result {
        Some(row) => {
            let id: Option<String> = row.try_get("id").ok().map(|v: uuid::Uuid| v.to_string());
            let document_id: String = row.try_get("document_id").ok().map(|v: uuid::Uuid| v.to_string()).unwrap_or_default();
            let document_name: Option<String> = row.try_get("document_name").ok();
            let document_number: Option<String> = row.try_get("document_number").ok();
            let party_a: Option<String> = row.try_get("party_a").ok();
            let party_b: Option<String> = row.try_get("party_b").ok();
            let contract_amount: Option<String> = row.try_get("contract_amount").ok().map(|v: rust_decimal::Decimal| v.to_string());
            let currency: Option<String> = row.try_get("currency").ok();
            let is_signed: Option<bool> = row.try_get("is_signed").ok();
            let signing_date: Option<DateTime<Utc>> = row.try_get::<Option<NaiveDate>, _>("signing_date")
                .ok()
                .and_then(|d| d.map(naive_date_to_datetime));
            let contract_status: Option<String> = row.try_get("contract_status").ok();
            let contact_person: Option<String> = row.try_get("contact_person").ok();
            let contact_phone: Option<String> = row.try_get("contact_phone").ok();
            let service_type: Option<String> = row.try_get("service_type").ok();
            let service_location: Option<String> = row.try_get("service_location").ok();
            let start_date: Option<DateTime<Utc>> = row.try_get::<Option<NaiveDate>, _>("start_date")
                .ok()
                .and_then(|d| d.map(naive_date_to_datetime));
            let end_date: Option<DateTime<Utc>> = row.try_get::<Option<NaiveDate>, _>("end_date")
                .ok()
                .and_then(|d| d.map(naive_date_to_datetime));
            let street: Option<String> = row.try_get("street").ok();
            let address: Option<String> = row.try_get("address").ok();
            let cleaning_time: Option<NaiveTime> = row.try_get("cleaning_time").ok();
            let cleaning_volume: Option<String> = row.try_get("cleaning_volume").ok().map(|v: rust_decimal::Decimal| v.to_string());
            let unit_price: Option<String> = row.try_get("unit_price").ok().map(|v: rust_decimal::Decimal| v.to_string());
            let settlement_method: Option<String> = row.try_get("settlement_method").ok();
            let created_at: Option<DateTime<Utc>> = row.try_get("created_at").ok();
            let updated_at: Option<DateTime<Utc>> = row.try_get("updated_at").ok();

            Ok(Json(DocumentInfoResponse {
                id,
                document_id,
                document_name,
                document_number,
                party_a,
                party_b,
                contract_amount,
                currency,
                is_signed,
                signing_date,
                contract_status,
                contact_person,
                contact_phone,
                service_type,
                service_location,
                start_date,
                end_date,
                street,
                address,
                cleaning_time,
                cleaning_volume,
                unit_price,
                settlement_method,
                created_at,
                updated_at,
            }))
        },
        None => Err(DocumentError::NotFound),
    }
}

pub async fn update_document_info(
    State(state): State<Arc<AppState>>,
    auth_user: AuthUser,
    Path(document_id): Path<uuid::Uuid>,
    Json(req): Json<UpdateDocumentInfoRequest>,
) -> Result<Json<DocumentInfoResponse>, DocumentError> {
    let _document = state
        .db
        .get_document_by_id(document_id, auth_user.user.id, auth_user.user.role)
        .await
        .map_err(|e| {
            error!("Database error getting document {}: {}", document_id, e);
            DocumentError::NotFound
        })?
        .ok_or(DocumentError::NotFound)?;

    let result = sqlx::query(
        r#"INSERT INTO document_info (
            document_id, document_name, document_number, party_a, party_b,
            contract_amount, currency, is_signed, signing_date, contract_status,
            contact_person, contact_phone, service_type, service_location,
            start_date, end_date, street, address, cleaning_time,
            cleaning_volume, unit_price, settlement_method
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::date, $10, $11, $12, $13, $14, $15::date, $16::date, $17, $18, $19::time, $20, $21, $22)
        ON CONFLICT (document_id) DO UPDATE SET
            document_name = COALESCE(EXCLUDED.document_name, document_info.document_name),
            document_number = COALESCE(EXCLUDED.document_number, document_info.document_number),
            party_a = COALESCE(EXCLUDED.party_a, document_info.party_a),
            party_b = COALESCE(EXCLUDED.party_b, document_info.party_b),
            contract_amount = COALESCE(EXCLUDED.contract_amount, document_info.contract_amount),
            currency = COALESCE(EXCLUDED.currency, document_info.currency),
            is_signed = COALESCE(EXCLUDED.is_signed, document_info.is_signed),
            signing_date = COALESCE(EXCLUDED.signing_date, document_info.signing_date),
            contract_status = COALESCE(EXCLUDED.contract_status, document_info.contract_status),
            contact_person = COALESCE(EXCLUDED.contact_person, document_info.contact_person),
            contact_phone = COALESCE(EXCLUDED.contact_phone, document_info.contact_phone),
            service_type = COALESCE(EXCLUDED.service_type, document_info.service_type),
            service_location = COALESCE(EXCLUDED.service_location, document_info.service_location),
            start_date = COALESCE(EXCLUDED.start_date, document_info.start_date),
            end_date = COALESCE(EXCLUDED.end_date, document_info.end_date),
            street = COALESCE(EXCLUDED.street, document_info.street),
            address = COALESCE(EXCLUDED.address, document_info.address),
            cleaning_time = COALESCE(EXCLUDED.cleaning_time, document_info.cleaning_time),
            cleaning_volume = COALESCE(EXCLUDED.cleaning_volume, document_info.cleaning_volume),
            unit_price = COALESCE(EXCLUDED.unit_price, document_info.unit_price),
            settlement_method = COALESCE(EXCLUDED.settlement_method, document_info.settlement_method)
        RETURNING id, document_id, document_name, document_number, party_a, party_b,
            contract_amount, currency, is_signed, signing_date, contract_status,
            contact_person, contact_phone, service_type, service_location,
            start_date, end_date, street, address, cleaning_time,
            cleaning_volume, unit_price, settlement_method, created_at, updated_at"#
    )
    .bind(document_id)
    .bind(req.document_name)
    .bind(req.document_number)
    .bind(req.party_a)
    .bind(req.party_b)
    .bind(req.contract_amount)
    .bind(req.currency)
    .bind(req.is_signed)
    .bind(req.signing_date)
    .bind(req.contract_status)
    .bind(req.contact_person)
    .bind(req.contact_phone)
    .bind(req.service_type)
    .bind(req.service_location)
    .bind(req.start_date)
    .bind(req.end_date)
    .bind(req.street)
    .bind(req.address)
    .bind(req.cleaning_time)
    .bind(req.cleaning_volume)
    .bind(req.unit_price)
    .bind(req.settlement_method)
    .fetch_one(state.db.get_pool())
    .await
    .map_err(|e| {
        error!("Database error updating Document info: {}", e);
        DocumentError::Internal(format!("Failed to update Document info: {}", e))
    })?;

    let id: Option<String> = result.try_get("id").ok().map(|v: uuid::Uuid| v.to_string());
    let document_id: String = result.try_get("document_id").ok().map(|v: uuid::Uuid| v.to_string()).unwrap_or_default();
    let document_name: Option<String> = result.try_get("document_name").ok();
    let document_number: Option<String> = result.try_get("document_number").ok();
    let party_a: Option<String> = result.try_get("party_a").ok();
    let party_b: Option<String> = result.try_get("party_b").ok();
    let contract_amount: Option<String> = result.try_get("contract_amount").ok().map(|v: rust_decimal::Decimal| v.to_string());
    let currency: Option<String> = result.try_get("currency").ok();
    let is_signed: Option<bool> = result.try_get("is_signed").ok();
    let signing_date: Option<DateTime<Utc>> = result.try_get::<Option<NaiveDate>, _>("signing_date").ok().and_then(|d| d.map(naive_date_to_datetime));
    let contract_status: Option<String> = result.try_get("contract_status").ok();
    let contact_person: Option<String> = result.try_get("contact_person").ok();
    let contact_phone: Option<String> = result.try_get("contact_phone").ok();
    let service_type: Option<String> = result.try_get("service_type").ok();
    let service_location: Option<String> = result.try_get("service_location").ok();
    let start_date: Option<DateTime<Utc>> = result.try_get::<Option<NaiveDate>, _>("start_date").ok().and_then(|d| d.map(naive_date_to_datetime));
    let end_date: Option<DateTime<Utc>> = result.try_get::<Option<NaiveDate>, _>("end_date").ok().and_then(|d| d.map(naive_date_to_datetime));
    let street: Option<String> = result.try_get("street").ok();
    let address: Option<String> = result.try_get("address").ok();
    let cleaning_time: Option<NaiveTime> = result.try_get("cleaning_time").ok();
    let cleaning_volume: Option<String> = result.try_get("cleaning_volume").ok().map(|v: rust_decimal::Decimal| v.to_string());
    let unit_price: Option<String> = result.try_get("unit_price").ok().map(|v: rust_decimal::Decimal| v.to_string());
    let settlement_method: Option<String> = result.try_get("settlement_method").ok();
    let created_at: Option<DateTime<Utc>> = result.try_get("created_at").ok();
    let updated_at: Option<DateTime<Utc>> = result.try_get("updated_at").ok();

    info!("Document info updated for document: {}", document_id);

    Ok(Json(DocumentInfoResponse {
        id,
        document_id,
        document_name,
        document_number,
        party_a,
        party_b,
        contract_amount,
        currency,
        is_signed,
        signing_date,
        contract_status,
        contact_person,
        contact_phone,
        service_type,
        service_location,
        start_date,
        end_date,
        street,
        address,
        cleaning_time,
        cleaning_volume,
        unit_price,
        settlement_method,
        created_at,
        updated_at,
    }))
}

pub async fn delete_document_info(
    State(state): State<Arc<AppState>>,
    auth_user: AuthUser,
    Path(document_id): Path<uuid::Uuid>,
) -> Result<StatusCode, DocumentError> {
    let _document = state
        .db
        .get_document_by_id(document_id, auth_user.user.id, auth_user.user.role)
        .await
        .map_err(|e| {
            error!("Database error getting document {}: {}", document_id, e);
            DocumentError::NotFound
        })?
        .ok_or(DocumentError::NotFound)?;

    let result = sqlx::query("DELETE FROM document_info WHERE document_id = $1")
        .bind(document_id)
        .execute(state.db.get_pool())
        .await
        .map_err(|e| {
            error!("Database error deleting Document info: {}", e);
            DocumentError::Internal(format!("Failed to delete Document info: {}", e))
        })?;

    if result.rows_affected() == 0 {
        return Err(DocumentError::NotFound);
    }

    info!("Document info deleted for document: {}", document_id);
    Ok(StatusCode::NO_CONTENT)
}