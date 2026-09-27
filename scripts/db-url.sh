#!/usr/bin/env bash
# Dipakai lewat `source`, bukan dieksekusi. Jalankan dari root repo:
#   source scripts/db-url.sh
#   psql "$PGURL" -v ON_ERROR_STOP=1 -f database/verify_schema.sql
#
# URL dibangun dari .env, bukan ditulis manual. Password di-URL-encode
# karena karakter seperti #, @, /, dan % merusak URL kalau mentah: '#'
# membuat sisanya dibaca sebagai fragment sehingga password terpotong dan
# koneksi gagal dengan pesan yang menyesatkan. Karena itu password hanya
# ada di satu tempat, jadi rotasi cukup mengubah .env.
#
# Wajib session pooler port 5432. DDL (CREATE TABLE, ALTER TABLE,
# CREATE POLICY) tidak bisa jalan di transaction pooler port 6543.

set -a
. ./.env
set +a

: "${SUPABASE_DB_PASSWORD:?SUPABASE_DB_PASSWORD belum diisi di .env}"
: "${SUPABASE_PROJECT_ID:?SUPABASE_PROJECT_ID belum diisi di .env}"

# Region proyek. Override dengan SUPABASE_DB_REGION di .env kalau dipindah.
: "${SUPABASE_DB_REGION:=aws-1-ap-southeast-1}"

urlencode() {
  printf '%s' "$1" | jq -sRr @uri
}

export PGURL="postgresql://postgres.${SUPABASE_PROJECT_ID}:$(urlencode "$SUPABASE_DB_PASSWORD")@${SUPABASE_DB_REGION}.pooler.supabase.com:5432/postgres"

unset -f urlencode
