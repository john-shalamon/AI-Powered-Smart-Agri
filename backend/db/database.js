const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

/**
 * DatabaseManager - Singleton class for SQLite database management
 * Provides connection management, query execution, and transaction support
 */
class DatabaseManager {
  constructor(dbPath) {
    this.dbPath = dbPath || process.env.DB_PATH || './data/agri-ai.db';
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * Initialize database connection and run migrations
   * Creates database file if it doesn't exist
   * Enables foreign key constraints
   * Runs pending migrations
   * Verifies database integrity
   */
  initialize() {
    try {
      // Ensure database directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Create or connect to database
      this.db = new Database(this.dbPath);
      
      // Enable foreign key constraints
      this.db.pragma('foreign_keys = ON');
      
      // Run migrations
      this._runMigrations();
      
      // Verify database integrity
      this.checkIntegrity();
      
      this.isInitialized = true;
      console.log(`Database initialized successfully at ${this.dbPath}`);
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
      console.log('Database connection closed');
    }
  }

  /**
   * Execute INSERT/UPDATE/DELETE query
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Object} - Result with changes and lastInsertRowid
   */
  run(sql, params = []) {
    this._ensureInitialized();
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.run(...params);
      return result;
    } catch (error) {
      this._logError('run', sql, params, error);
      throw error;
    }
  }

  /**
   * Execute SELECT query returning single row
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Object|undefined} - Single row or undefined
   */
  get(sql, params = []) {
    this._ensureInitialized();
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.get(...params);
      return result;
    } catch (error) {
      this._logError('get', sql, params, error);
      throw error;
    }
  }

  /**
   * Execute SELECT query returning all rows
   * @param {string} sql - SQL query
   * @param {Array} params - Query parameters
   * @returns {Array} - Array of rows
   */
  all(sql, params = []) {
    this._ensureInitialized();
    try {
      const stmt = this.db.prepare(sql);
      const result = stmt.all(...params);
      return result;
    } catch (error) {
      this._logError('all', sql, params, error);
      throw error;
    }
  }

  /**
   * Prepare statement for reuse
   * @param {string} sql - SQL query
   * @returns {Statement} - Prepared statement
   */
  prepare(sql) {
    this._ensureInitialized();
    try {
      return this.db.prepare(sql);
    } catch (error) {
      this._logError('prepare', sql, [], error);
      throw error;
    }
  }

  /**
   * Execute function within transaction
   * Automatically handles BEGIN/COMMIT/ROLLBACK
   * @param {Function} fn - Function to execute in transaction
   * @returns {*} - Return value of fn
   */
  transaction(fn) {
    this._ensureInitialized();
    try {
      const txn = this.db.transaction(fn);
      return txn();
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  /**
   * Check database integrity using PRAGMA integrity_check
   * @returns {boolean} - True if integrity check passes
   * @throws {Error} - If integrity check fails
   */
  checkIntegrity() {
    this._ensureInitialized();
    try {
      const result = this.db.pragma('integrity_check');
      if (result.length === 1 && result[0].integrity_check === 'ok') {
        return true;
      }
      throw new Error(`Database integrity check failed: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error('Database integrity check failed:', error);
      throw error;
    }
  }

  /**
   * Run pending migrations
   * @private
   */
  _runMigrations() {
    // Create migrations table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER UNIQUE NOT NULL,
        name TEXT NOT NULL,
        executed_at TEXT NOT NULL
      )
    `);

    // Get executed migrations
    const executedMigrations = this.db
      .prepare('SELECT version FROM migrations ORDER BY version')
      .all()
      .map(row => row.version);

    // Get migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('No migrations directory found, skipping migrations');
      return;
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    // Execute pending migrations
    for (const file of migrationFiles) {
      const match = file.match(/^(\d+)_(.+)\.sql$/);
      if (!match) {
        console.warn(`Skipping invalid migration file: ${file}`);
        continue;
      }

      const version = parseInt(match[1], 10);
      const name = match[2];

      if (executedMigrations.includes(version)) {
        continue; // Skip already executed migration
      }

      console.log(`Running migration ${version}: ${name}`);
      
      try {
        const migrationPath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(migrationPath, 'utf8');
        
        // Execute migration in transaction
        this.db.transaction(() => {
          this.db.exec(sql);
          this.db
            .prepare('INSERT INTO migrations (version, name, executed_at) VALUES (?, ?, ?)')
            .run(version, name, new Date().toISOString());
        })();
        
        console.log(`Migration ${version} completed successfully`);
      } catch (error) {
        console.error(`Migration ${version} failed:`, error);
        throw new Error(`Migration ${version} (${name}) failed: ${error.message}`);
      }
    }
  }

  /**
   * Ensure database is initialized
   * @private
   */
  _ensureInitialized() {
    if (!this.isInitialized || !this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
  }

  /**
   * Log database error with context
   * @private
   */
  _logError(operation, sql, params, error) {
    console.error({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      component: 'DatabaseManager',
      operation,
      message: 'Query execution failed',
      sql,
      params,
      error: {
        code: error.code,
        message: error.message
      }
    });
  }
}

// Export singleton instance
const dbPath = process.env.DB_PATH || './data/agri-ai.db';
const instance = new DatabaseManager(dbPath);

module.exports = instance;
module.exports.DatabaseManager = DatabaseManager; // Export class for testing
