# API Testing Examples

Berikut adalah contoh penggunaan API User Database menggunakan curl.

## 1. Get All Users
```bash
curl http://localhost:3000/api/users
```

## 2. Get User by ID
```bash
curl http://localhost:3000/api/users/1
```

## 3. Search Users by Name
```bash
curl "http://localhost:3000/api/users?query=Budi"
```

## 4. Filter Users by Status
```bash
curl "http://localhost:3000/api/users?status=aktif"
```

## 5. Create New User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "550e8400-e29b-41d4-a716-446655440004",
    "nama": "Dewi Lestari",
    "jabatan": "Staff",
    "unit_kerja": "Marketing Department",
    "email": "dewi.lestari@hermes.id",
    "telepon": "081234567894",
    "alamat": "Jakarta Selatan",
    "tanggal_lahir": "1995-05-10",
    "tanggal_masuk": "2020-01-20",
    "status": "aktif",
    "additional_data": {
      "badge_number": "B005",
      "department_code": "MKT01",
      "access_level": 2,
      "skills": ["Digital Marketing", "Content Writing"],
      "certifications": ["Google Ads", "Facebook Blueprint"]
    }
  }'
```

## 6. Update User
```bash
curl -X PUT http://localhost:3000/api/users/4 \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "550e8400-e29b-41d4-a716-446655440004",
    "nama": "Dewi Lestari",
    "jabatan": "Senior Staff",
    "unit_kerja": "Marketing Department",
    "email": "dewi.lestari@hermes.id",
    "telepon": "081234567894",
    "alamat": "Jakarta Selatan",
    "tanggal_lahir": "1995-05-10",
    "tanggal_masuk": "2020-01-20",
    "status": "aktif",
    "additional_data": {
      "badge_number": "B005",
      "department_code": "MKT01",
      "access_level": 3,
      "skills": ["Digital Marketing", "Content Writing", "SEO"],
      "certifications": ["Google Ads", "Facebook Blueprint", "HubSpot"]
    }
  }'
```

## 7. Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/4
```

## Response Examples

### Success Response (GET All)
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "uuid": "550e8400-e29b-41d4-a716-446655440001",
      "nama": "Budi Santoso",
      "jabatan": "Kepala Bagian",
      "unit_kerja": "IT Department",
      "email": "budi.santoso@hermes.id",
      "telepon": "081234567890",
      "alamat": null,
      "tanggal_lahir": null,
      "tanggal_masuk": null,
      "status": "aktif",
      "additional_data": {
        "badge_number": "B001",
        "department_code": "IT01",
        "access_level": 3
      },
      "created_at": "2026-02-02T10:38:17.539Z",
      "updated_at": "2026-02-02T10:38:17.539Z"
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
    "uuid": "550e8400-e29b-41d4-a716-446655440001",
    "nama": "Budi Santoso",
    "jabatan": "Kepala Bagian",
    "unit_kerja": "IT Department",
    "email": "budi.santoso@hermes.id",
    "telepon": "081234567890",
    "alamat": null,
    "tanggal_lahir": null,
    "tanggal_masuk": null,
    "status": "aktif",
    "additional_data": {
      "badge_number": "B001",
      "department_code": "IT01",
      "access_level": 3
    },
    "created_at": "2026-02-02T10:38:17.539Z",
    "updated_at": "2026-02-02T10:38:17.539Z"
  }
}
```

### Error Response (Not Found)
```json
{
  "success": false,
  "message": "User not found"
}
```

### Error Response (Validation)
```json
{
  "success": false,
  "message": "UUID and nama are required"
}
```

### Error Response (Duplicate)
```json
{
  "success": false,
  "message": "User with this UUID already exists"
}
```

## Testing with Postman

Anda juga dapat mengimport collection berikut ke Postman untuk testing yang lebih mudah:

1. Import URL: `http://localhost:3000/api/users`
2. Buat request untuk setiap endpoint
3. Atur Content-Type header ke `application/json` untuk POST dan PUT requests
4. Tambahkan body JSON sesuai dengan contoh di atas
