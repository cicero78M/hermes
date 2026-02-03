# Telegram Bot Workflow & Logic

Dokumen ini menjelaskan workflow dan logic dari Telegram Bot untuk update data user.

## Arsitektur Sistem

```
┌─────────────────┐
│  Telegram User  │
└────────┬────────┘
         │
         │ Commands (/link, /update_*, /mydata)
         │
         ▼
┌─────────────────────────┐
│  Telegram Bot Service   │
│  (telegramBot.js)       │
└────────┬────────────────┘
         │
         │ Validate & Process
         │
         ▼
┌─────────────────────────┐
│  User Model             │
│  (user.js)              │
└────────┬────────────────┘
         │
         │ SQL Queries
         │
         ▼
┌─────────────────────────┐
│  PostgreSQL Database    │
│  (users table)          │
└─────────────────────────┘
```

## Data Flow

### 1. Link Account Flow (/link UUID)

```
User sends: /link 550e8400-e29b-41d4-a716-446655440001
    │
    ├─► Bot extracts UUID from command
    │
    ├─► Query database untuk cek UUID exists
    │   │
    │   ├─► UUID tidak ditemukan?
    │   │   └─► Return error: "UUID tidak ditemukan"
    │   │
    │   └─► UUID ditemukan? Continue ──►
    │
    ├─► Check if Telegram ID already linked
    │   │
    │   ├─► Telegram ID linked to different user?
    │   │   └─► Return error: "Telegram sudah tertaut"
    │   │
    │   └─► Telegram ID belum linked or linked to same user? Continue ──►
    │
    ├─► Update users table: SET telegram_id = <telegram_id> WHERE uuid = <uuid>
    │
    └─► Return success message with user data
```

### 2. Update Data Flow (/update_* <value>)

```
User sends: /update_nama John Doe
    │
    ├─► Bot extracts field (nama) dan value (John Doe)
    │
    ├─► Get telegram_id dari message sender
    │
    ├─► Query: SELECT * FROM users WHERE telegram_id = <telegram_id>
    │   │
    │   ├─► User tidak ditemukan?
    │   │   └─► Return error: "Akun belum tertaut"
    │   │
    │   └─► User ditemukan? Continue ──►
    │
    ├─► Build dynamic UPDATE query dengan field yang ingin diupdate
    │   Example: UPDATE users SET nama = 'John Doe' WHERE uuid = <uuid>
    │
    ├─► Execute update query
    │
    └─► Return success message
```

### 3. View Data Flow (/mydata)

```
User sends: /mydata
    │
    ├─► Get telegram_id dari message sender
    │
    ├─► Query: SELECT * FROM users WHERE telegram_id = <telegram_id>
    │   │
    │   ├─► User tidak ditemukan?
    │   │   └─► Return error: "Akun belum tertaut"
    │   │
    │   └─► User ditemukan? Continue ──►
    │
    └─► Return formatted user data
```

## Database Schema Logic

### Tabel: users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(50) UNIQUE NOT NULL,          -- NRP (User identifier)
  nama VARCHAR(255) NOT NULL,
  pangkat VARCHAR(255),
  telepon VARCHAR(50),
  telegram_id VARCHAR(50) UNIQUE,            -- Telegram user ID
  ig_uname VARCHAR(255),
  fb_uname VARCHAR(255),
  tt_uname VARCHAR(255),
  x_uname VARCHAR(255),
  yt_uname VARCHAR(255),
  -- ... other fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Key Constraints

1. **uuid**: UNIQUE, NOT NULL
   - Primary identifier untuk user
   - Ini adalah NRP user
   - Tidak bisa duplicate

2. **telegram_id**: UNIQUE, NULLABLE
   - Telegram user ID (numeric string)
   - UNIQUE memastikan satu Telegram account hanya bisa link ke satu user
   - NULLABLE karena user belum tentu link Telegram

3. **Index**: telegram_id
   - Untuk query performance saat cek user by telegram_id

## Logic Components

### 1. Bot Initialization (TelegramBotService.initialize())

```javascript
async initialize() {
  // Check if token configured
  if (!this.token) {
    console.log('TELEGRAM_BOT_TOKEN not configured');
    return; // Bot won't start
  }
  
  // Initialize bot with polling
  this.bot = new TelegramBot(this.token, { polling: true });
  
  // Setup all command handlers
  this.setupHandlers();
  
  this.isInitialized = true;
}
```

**Logic**:
- Bot optional: hanya start jika token tersedia
- Polling mode: bot actively check untuk messages baru
- Graceful handling: tidak error jika token tidak ada

### 2. Link Account Logic (/link command)

```javascript
async handleLinkCommand(msg, uuid) {
  const telegramId = msg.from.id.toString();
  
  // Step 1: Validate UUID exists
  const user = await User.getByUuid(uuid);
  if (!user) return error('UUID tidak ditemukan');
  
  // Step 2: Check if Telegram already linked
  const existingUser = await User.getByTelegramId(telegramId);
  if (existingUser && existingUser.uuid !== uuid) {
    return error('Telegram sudah tertaut dengan user lain');
  }
  
  // Step 3: Link Telegram to user
  await User.updateByUuid(uuid, { telegram_id: telegramId });
  
  return success('Berhasil menautkan akun');
}
```

**Security Checks**:
1. UUID must exist in database
2. Telegram ID tidak boleh sudah tertaut ke user lain
3. Exception: Allow re-linking if UUID sama (idempotent)

### 3. Update Data Logic (User.updateByUuid())

```javascript
static async updateByUuid(uuid, data) {
  // Build dynamic query
  const updates = [];
  const params = [];
  let paramIndex = 1;
  
  // Only include fields that are provided
  if (data.telegram_id !== undefined) {
    updates.push(`telegram_id = $${paramIndex++}`);
    params.push(data.telegram_id);
  }
  if (data.nama !== undefined) {
    updates.push(`nama = $${paramIndex++}`);
    params.push(data.nama);
  }
  // ... other fields
  
  // Build and execute query
  const sql = `UPDATE users SET ${updates.join(', ')} WHERE uuid = $${paramIndex}`;
  params.push(uuid);
  
  await db.query(sql, params);
}
```

**Logic**:
- **Partial Update**: Hanya update fields yang provided
- **Dynamic Query**: Build query based on data object
- **Parameterized**: Menggunakan parameterized queries untuk security (prevent SQL injection)
- **Flexible**: Bisa update 1 field atau multiple fields

### 4. Authentication Logic

```javascript
async handleUpdate(msg, field, value, displayName) {
  const telegramId = msg.from.id.toString();
  
  // Authenticate: Get user by Telegram ID
  const user = await User.getByTelegramId(telegramId);
  
  if (!user) {
    return error('Akun belum tertaut');
  }
  
  // User authenticated, perform update
  await User.updateByUuid(user.uuid, { [field]: value });
  
  return success(`${displayName} berhasil diupdate`);
}
```

**Authentication Flow**:
1. Get Telegram ID from message sender
2. Query database for user with this Telegram ID
3. If user found → authenticated, allow update
4. If user not found → not authenticated, return error

**Security**: User hanya bisa update data mereka sendiri karena link Telegram ID → UUID

## Error Handling

### 1. Bot Initialization Errors

```javascript
try {
  this.bot = new TelegramBot(this.token, { polling: true });
  this.setupHandlers();
} catch (error) {
  console.error('Error initializing Telegram bot:', error.message);
  // Bot won't crash the app, just log error
}
```

### 2. Command Errors

```javascript
try {
  // Execute command logic
  await User.updateByUuid(uuid, data);
  await this.bot.sendMessage(chatId, 'Success');
} catch (error) {
  console.error('Error:', error);
  await this.bot.sendMessage(chatId, 'Terjadi kesalahan');
}
```

### 3. Polling Errors

```javascript
this.bot.on('polling_error', (error) => {
  console.error('Telegram bot polling error:', error);
  // Bot will automatically retry
});
```

## Validation Rules

### UUID Validation
- Must exist in database
- Format: any string (UUID atau NRP)

### Telegram ID Validation
- Obtained from Telegram API (trusted source)
- Must be unique across all users
- Cannot be manually set by user

### Data Update Validation
- Field must be one of allowed fields
- Value is trimmed of whitespace
- Empty values allowed (set to empty string)

## State Management

Bot adalah **stateless**:
- Tidak menyimpan session data
- Setiap command independent
- Authentication via database lookup setiap request
- No in-memory cache

**Advantages**:
- Simple implementation
- Scalable (no memory concerns)
- Reliable (no state corruption)
- Can restart bot without losing state

## Command Reference

| Command | Params | Auth Required | Description |
|---------|--------|---------------|-------------|
| `/start` | None | No | Welcome message & instructions |
| `/help` | None | No | List all commands |
| `/link` | UUID | No | Link Telegram to user account |
| `/mydata` | None | Yes | View user data |
| `/update_nama` | nama | Yes | Update nama field |
| `/update_pangkat` | pangkat | Yes | Update pangkat field |
| `/update_telepon` | telepon | Yes | Update telepon field |
| `/update_ig` | username | Yes | Update Instagram username |
| `/update_fb` | username | Yes | Update Facebook username |
| `/update_tt` | username | Yes | Update TikTok username |
| `/update_x` | username | Yes | Update X/Twitter username |
| `/update_yt` | username | Yes | Update YouTube username |

## Integration Points

### Main Application (src/index.js)

```javascript
// Initialize bot on app startup
const telegramBot = new TelegramBotService();
telegramBot.initialize();

// Stop bot on app shutdown
process.on('SIGINT', () => {
  server.close(() => {
    telegramBot.stop();
    db.close();
    process.exit(0);
  });
});
```

### User Model (src/models/user.js)

New methods:
- `getByTelegramId(telegramId)`: Get user by Telegram ID
- `updateByUuid(uuid, data)`: Partial update by UUID

## Future Enhancements

### 1. Webhook Mode
```javascript
// Instead of polling
this.bot = new TelegramBot(this.token);
app.post('/webhook/telegram', (req, res) => {
  this.bot.processUpdate(req.body);
  res.sendStatus(200);
});
```

### 2. Command Middleware
```javascript
// Rate limiting, logging, analytics
async function commandMiddleware(msg, next) {
  console.log(`Command from ${msg.from.id}: ${msg.text}`);
  await next();
}
```

### 3. Inline Keyboards
```javascript
const opts = {
  reply_markup: {
    inline_keyboard: [[
      { text: 'Update Nama', callback_data: 'update_nama' },
      { text: 'Update Pangkat', callback_data: 'update_pangkat' }
    ]]
  }
};
await bot.sendMessage(chatId, 'Pilih action:', opts);
```

### 4. Multi-step Conversations
```javascript
// State machine for complex updates
const userStates = new Map();
userStates.set(telegramId, 'awaiting_nama');
```

## Testing Strategy

### Manual Testing
1. Start bot with valid token
2. Test `/start` command
3. Test `/link` with valid UUID
4. Test all `/update_*` commands
5. Test `/mydata` command
6. Test error cases (invalid UUID, not linked, etc.)

### Database Verification
```sql
-- Check linked users
SELECT uuid, nama, telegram_id FROM users WHERE telegram_id IS NOT NULL;

-- Check updates
SELECT * FROM users WHERE uuid = '<test-uuid>';
```

### Integration Testing
1. Link account via bot
2. Update data via bot
3. Verify via API GET /api/users/:id
4. Update via API PUT /api/users/:id
5. Verify via bot /mydata

## Summary

Telegram Bot integration:
- ✅ Allows UUID-based account linking
- ✅ Secure: one Telegram per user
- ✅ Flexible: partial updates
- ✅ Stateless: no session management
- ✅ Optional: doesn't break if not configured
- ✅ Documented: comprehensive guides
- ✅ Error handled: graceful failures
