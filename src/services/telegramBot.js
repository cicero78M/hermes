const TelegramBot = require('node-telegram-bot-api');
const User = require('../models/user');

/**
 * Telegram Bot Service for User Data Updates
 * Allows users to link their Telegram account and update their data
 */
class TelegramBotService {
  constructor() {
    this.bot = null;
    this.token = process.env.TELEGRAM_BOT_TOKEN;
    this.isInitialized = false;
  }

  /**
   * Initialize the Telegram bot
   */
  async initialize() {
    if (!this.token) {
      console.log('⚠️  TELEGRAM_BOT_TOKEN not configured. Telegram bot will not start.');
      return;
    }

    try {
      this.bot = new TelegramBot(this.token, { polling: true });
      this.setupHandlers();
      this.isInitialized = true;
      console.log('✅ Telegram bot initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Telegram bot:', error.message);
    }
  }

  /**
   * Setup bot command handlers
   */
  setupHandlers() {
    // Command: /start
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

      await this.bot.sendMessage(chatId, 
        `Selamat datang, ${username}! 👋\n\n` +
        `Bot ini digunakan untuk menautkan akun Telegram Anda dengan data user Hermes.\n\n` +
        `*Cara Penggunaan:*\n` +
        `1️⃣ Gunakan command /link <UUID> untuk menautkan akun\n` +
        `   Contoh: /link 550e8400-e29b-41d4-a716-446655440001\n\n` +
        `2️⃣ Setelah tertaut, gunakan command berikut:\n` +
        `   • /update_nama <nama lengkap>\n` +
        `   • /update_pangkat <pangkat>\n` +
        `   • /update_telepon <nomor telepon>\n` +
        `   • /update_ig <username Instagram>\n` +
        `   • /update_fb <username Facebook>\n` +
        `   • /update_tt <username TikTok>\n` +
        `   • /update_x <username X/Twitter>\n` +
        `   • /update_yt <username YouTube>\n\n` +
        `3️⃣ /mydata - Lihat data Anda\n` +
        `4️⃣ /help - Bantuan`,
        { parse_mode: 'Markdown' }
      );
    });

    // Command: /help
    this.bot.onText(/\/help/, async (msg) => {
      const chatId = msg.chat.id;
      await this.bot.sendMessage(chatId,
        `*Daftar Command:*\n\n` +
        `📌 /start - Memulai bot\n` +
        `🔗 /link <UUID> - Menautkan akun Telegram dengan UUID Anda\n` +
        `📊 /mydata - Melihat data Anda\n` +
        `✏️ /update_nama <nama> - Update nama\n` +
        `🎖️ /update_pangkat <pangkat> - Update pangkat\n` +
        `📱 /update_telepon <telepon> - Update nomor telepon\n` +
        `📸 /update_ig <username> - Update Instagram username\n` +
        `👥 /update_fb <username> - Update Facebook username\n` +
        `🎵 /update_tt <username> - Update TikTok username\n` +
        `🐦 /update_x <username> - Update X/Twitter username\n` +
        `📺 /update_yt <username> - Update YouTube username\n` +
        `❓ /help - Menampilkan bantuan`,
        { parse_mode: 'Markdown' }
      );
    });

    // Command: /link <uuid>
    this.bot.onText(/\/link (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const telegramId = msg.from.id.toString();
      const uuid = match[1].trim();

      try {
        // Check if user exists with this UUID
        const user = await User.getByUuid(uuid);
        
        if (!user) {
          await this.bot.sendMessage(chatId, 
            `❌ UUID tidak ditemukan. Pastikan UUID Anda benar.\n\n` +
            `UUID adalah NRP Anda.`
          );
          return;
        }

        // Check if Telegram is already linked to another user
        const existingTelegramUser = await User.getByTelegramId(telegramId);
        if (existingTelegramUser && existingTelegramUser.uuid !== uuid) {
          await this.bot.sendMessage(chatId,
            `❌ Akun Telegram Anda sudah tertaut dengan user lain.\n\n` +
            `Jika ini adalah kesalahan, hubungi administrator.`
          );
          return;
        }

        // Link Telegram ID to user
        await User.updateByUuid(uuid, { telegram_id: telegramId });

        await this.bot.sendMessage(chatId,
          `✅ Berhasil menautkan akun!\n\n` +
          `*Data Anda:*\n` +
          `Nama: ${user.nama}\n` +
          `UUID: ${user.uuid}\n` +
          `Pangkat: ${user.pangkat || '-'}\n` +
          `Telepon: ${user.telepon || '-'}\n\n` +
          `Sekarang Anda dapat mengupdate data menggunakan command /update_*\n` +
          `Gunakan /help untuk melihat daftar command.`,
          { parse_mode: 'Markdown' }
        );
      } catch (error) {
        console.error('Error linking Telegram account:', error);
        await this.bot.sendMessage(chatId,
          `❌ Terjadi kesalahan saat menautkan akun. Silakan coba lagi.`
        );
      }
    });

    // Command: /mydata
    this.bot.onText(/\/mydata/, async (msg) => {
      const chatId = msg.chat.id;
      const telegramId = msg.from.id.toString();

      try {
        const user = await User.getByTelegramId(telegramId);

        if (!user) {
          await this.bot.sendMessage(chatId,
            `❌ Akun Telegram Anda belum tertaut.\n\n` +
            `Gunakan /link <UUID> untuk menautkan akun Anda.`
          );
          return;
        }

        await this.bot.sendMessage(chatId,
          `*Data Anda:*\n\n` +
          `👤 Nama: ${user.nama}\n` +
          `🆔 UUID: ${user.uuid}\n` +
          `🎖️ Pangkat: ${user.pangkat || '-'}\n` +
          `📱 Telepon: ${user.telepon || '-'}\n` +
          `📧 Email: ${user.email || '-'}\n` +
          `🏢 Unit Kerja: ${user.unit_kerja || '-'}\n` +
          `📊 Status: ${user.status || '-'}\n\n` +
          `*Social Media:*\n` +
          `📸 Instagram: ${user.ig_uname || '-'}\n` +
          `👥 Facebook: ${user.fb_uname || '-'}\n` +
          `🎵 TikTok: ${user.tt_uname || '-'}\n` +
          `🐦 X/Twitter: ${user.x_uname || '-'}\n` +
          `📺 YouTube: ${user.yt_uname || '-'}`,
          { parse_mode: 'Markdown' }
        );
      } catch (error) {
        console.error('Error fetching user data:', error);
        await this.bot.sendMessage(chatId,
          `❌ Terjadi kesalahan saat mengambil data. Silakan coba lagi.`
        );
      }
    });

    // Command: /update_nama
    this.bot.onText(/\/update_nama (.+)/, async (msg, match) => {
      await this.handleUpdate(msg, 'nama', match[1].trim(), 'Nama');
    });

    // Command: /update_pangkat
    this.bot.onText(/\/update_pangkat (.+)/, async (msg, match) => {
      await this.handleUpdate(msg, 'pangkat', match[1].trim(), 'Pangkat');
    });

    // Command: /update_telepon
    this.bot.onText(/\/update_telepon (.+)/, async (msg, match) => {
      await this.handleUpdate(msg, 'telepon', match[1].trim(), 'Telepon');
    });

    // Command: /update_ig
    this.bot.onText(/\/update_ig (.+)/, async (msg, match) => {
      await this.handleUpdate(msg, 'ig_uname', match[1].trim(), 'Instagram username');
    });

    // Command: /update_fb
    this.bot.onText(/\/update_fb (.+)/, async (msg, match) => {
      await this.handleUpdate(msg, 'fb_uname', match[1].trim(), 'Facebook username');
    });

    // Command: /update_tt
    this.bot.onText(/\/update_tt (.+)/, async (msg, match) => {
      await this.handleUpdate(msg, 'tt_uname', match[1].trim(), 'TikTok username');
    });

    // Command: /update_x
    this.bot.onText(/\/update_x (.+)/, async (msg, match) => {
      await this.handleUpdate(msg, 'x_uname', match[1].trim(), 'X/Twitter username');
    });

    // Command: /update_yt
    this.bot.onText(/\/update_yt (.+)/, async (msg, match) => {
      await this.handleUpdate(msg, 'yt_uname', match[1].trim(), 'YouTube username');
    });

    // Handle errors
    this.bot.on('polling_error', (error) => {
      console.error('Telegram bot polling error:', error);
    });
  }

  /**
   * Handle update commands
   * @param {Object} msg - Telegram message object
   * @param {string} field - Field to update
   * @param {string} value - New value
   * @param {string} displayName - Display name for the field
   */
  async handleUpdate(msg, field, value, displayName) {
    const chatId = msg.chat.id;
    const telegramId = msg.from.id.toString();

    try {
      // Check if user is linked
      const user = await User.getByTelegramId(telegramId);

      if (!user) {
        await this.bot.sendMessage(chatId,
          `❌ Akun Telegram Anda belum tertaut.\n\n` +
          `Gunakan /link <UUID> untuk menautkan akun Anda terlebih dahulu.`
        );
        return;
      }

      // Update the field
      const updateData = {};
      updateData[field] = value;
      await User.updateByUuid(user.uuid, updateData);

      await this.bot.sendMessage(chatId,
        `✅ ${displayName} berhasil diupdate!\n\n` +
        `${displayName}: ${value}\n\n` +
        `Gunakan /mydata untuk melihat semua data Anda.`
      );
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      await this.bot.sendMessage(chatId,
        `❌ Terjadi kesalahan saat mengupdate ${displayName}. Silakan coba lagi.`
      );
    }
  }

  /**
   * Stop the bot
   */
  async stop() {
    if (this.bot && this.isInitialized) {
      await this.bot.stopPolling();
      console.log('🛑 Telegram bot stopped');
    }
  }
}

module.exports = TelegramBotService;
