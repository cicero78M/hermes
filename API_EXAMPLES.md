# API Testing Examples

Berikut adalah contoh penggunaan API Personnel Database menggunakan curl.

## 1. Get All Personnel
```bash
curl http://localhost:3000/api/personnel
```

## 2. Get Personnel by ID
```bash
curl http://localhost:3000/api/personnel/1
```

## 3. Search Personnel by Name
```bash
curl "http://localhost:3000/api/personnel?query=Budi"
```

## 4. Filter Personnel by Status
```bash
curl "http://localhost:3000/api/personnel?status=aktif"
```

## 5. Create New Personnel
```bash
curl -X POST http://localhost:3000/api/personnel \
  -H "Content-Type: application/json" \
  -d '{
    "nip": "199505102020012004",
    "nama": "Dewi Lestari",
    "jabatan": "Staff",
    "unit_kerja": "Marketing Department",
    "email": "dewi.lestari@hermes.id",
    "telepon": "081234567894",
    "alamat": "Jakarta Selatan",
    "tanggal_lahir": "1995-05-10",
    "tanggal_masuk": "2020-01-20",
    "status": "aktif"
  }'
```

## 6. Update Personnel
```bash
curl -X PUT http://localhost:3000/api/personnel/4 \
  -H "Content-Type: application/json" \
  -d '{
    "nip": "199505102020012004",
    "nama": "Dewi Lestari",
    "jabatan": "Senior Staff",
    "unit_kerja": "Marketing Department",
    "email": "dewi.lestari@hermes.id",
    "telepon": "081234567894",
    "alamat": "Jakarta Selatan",
    "tanggal_lahir": "1995-05-10",
    "tanggal_masuk": "2020-01-20",
    "status": "aktif"
  }'
```

## 7. Delete Personnel
```bash
curl -X DELETE http://localhost:3000/api/personnel/4
```

## Response Examples

### Success Response (GET All)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nip": "198001012010011001",
      "nama": "Budi Santoso",
      "jabatan": "Kepala Bagian",
      "unit_kerja": "IT Department",
      "email": "budi.santoso@hermes.id",
      "telepon": "081234567890",
      "alamat": null,
      "tanggal_lahir": null,
      "tanggal_masuk": null,
      "status": "aktif",
      "created_at": "2026-02-02 10:16:14",
      "updated_at": "2026-02-02 10:16:14"
    }
  ],
  "count": 1
}
```

### Success Response (GET by ID)
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nip": "198001012010011001",
    "nama": "Budi Santoso",
    "jabatan": "Kepala Bagian",
    "unit_kerja": "IT Department",
    "email": "budi.santoso@hermes.id",
    "telepon": "081234567890",
    "alamat": null,
    "tanggal_lahir": null,
    "tanggal_masuk": null,
    "status": "aktif",
    "created_at": "2026-02-02 10:16:14",
    "updated_at": "2026-02-02 10:16:14"
  }
}
```

### Error Response (Not Found)
```json
{
  "success": false,
  "message": "Personnel not found"
}
```

### Error Response (Validation)
```json
{
  "success": false,
  "message": "NIP and nama are required"
}
```

### Error Response (Duplicate)
```json
{
  "success": false,
  "message": "Personnel with this NIP already exists"
}
```

## Testing with Postman

Anda juga dapat mengimport collection berikut ke Postman untuk testing yang lebih mudah:

1. Import URL: `http://localhost:3000/api/personnel`
2. Buat request untuk setiap endpoint
3. Atur Content-Type header ke `application/json` untuk POST dan PUT requests
4. Tambahkan body JSON sesuai dengan contoh di atas
