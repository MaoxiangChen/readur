-- 文档信息表
CREATE TABLE IF NOT EXISTS document_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE UNIQUE,
    document_name VARCHAR(255),
    document_number VARCHAR(100),
    party_a VARCHAR(255),
    party_b VARCHAR(255),
    contract_amount DECIMAL(18,4),
    currency VARCHAR(10) DEFAULT 'CNY',
    is_signed BOOLEAN DEFAULT FALSE,
    signing_date DATE,
    contract_status VARCHAR(20),
    contact_person VARCHAR(100),
    contact_phone VARCHAR(50),
    service_type VARCHAR(100),
    service_location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    street VARCHAR(255),
    address VARCHAR(500),
    cleaning_time DATE,
    cleaning_volume DECIMAL(18,2),
    unit_price DECIMAL(18,4),
    settlement_method VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_document_info_doc_id ON document_info(document_id);
CREATE INDEX idx_document_info_number ON document_info(document_number);