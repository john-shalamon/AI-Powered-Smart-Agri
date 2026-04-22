const fs = require('fs');
const path = require('path');
const { DatabaseManager } = require('../../db/database');

/**
 * Unit tests for DatabaseManager
 * Tests basic functionality: initialization, queries, transactions, integrity checks
 */

// Test database path
const TEST_DB_PATH = './data/test-database.db';

// Helper to create a fresh test database
function createTestDatabase() {
  // Clean up existing test database
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
  
  const db = new DatabaseManager(TEST_DB_PATH);
  db.initialize();
  return db;
}

// Helper to cleanup test database
function cleanupTestDatabase(db) {
  if (db) {
    db.close();
  }
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
}

// Test suite
function runTests() {
  console.log('Running DatabaseManager unit tests...\n');
  
  let passedTests = 0;
  let failedTests = 0;
  
  // Test 1: Database initialization creates file
  try {
    console.log('Test 1: Database initialization creates file');
    const db = createTestDatabase();
    
    if (!fs.existsSync(TEST_DB_PATH)) {
      throw new Error('Database file was not created');
    }
    
    cleanupTestDatabase(db);
    console.log('✓ PASSED\n');
    passedTests++;
  } catch (error) {
    console.error('✗ FAILED:', error.message, '\n');
    failedTests++;
  }
  
  // Test 2: Foreign key constraints are enabled
  try {
    console.log('Test 2: Foreign key constraints are enabled');
    const db = createTestDatabase();
    
    // Create test tables with foreign key
    db.run(`
      CREATE TABLE test_parent (
        id INTEGER PRIMARY KEY
      )
    `);
    
    db.run(`
      CREATE TABLE test_child (
        id INTEGER PRIMARY KEY,
        parent_id INTEGER NOT NULL,
        FOREIGN KEY (parent_id) REFERENCES test_parent(id)
      )
    `);
    
    // Try to insert child without parent (should fail)
    let foreignKeyWorking = false;
    try {
      db.run('INSERT INTO test_child (id, parent_id) VALUES (?, ?)', [1, 999]);
    } catch (error) {
      if (error.message.includes('FOREIGN KEY constraint failed')) {
        foreignKeyWorking = true;
      }
    }
    
    if (!foreignKeyWorking) {
      throw new Error('Foreign key constraints are not enforced');
    }
    
    cleanupTestDatabase(db);
    console.log('✓ PASSED\n');
    passedTests++;
  } catch (error) {
    console.error('✗ FAILED:', error.message, '\n');
    failedTests++;
  }
  
  // Test 3: run() method executes INSERT
  try {
    console.log('Test 3: run() method executes INSERT');
    const db = createTestDatabase();
    
    db.run('CREATE TABLE test_users (id INTEGER PRIMARY KEY, name TEXT)');
    const result = db.run('INSERT INTO test_users (name) VALUES (?)', ['John']);
    
    if (!result.changes || result.changes !== 1) {
      throw new Error('INSERT did not affect 1 row');
    }
    
    cleanupTestDatabase(db);
    console.log('✓ PASSED\n');
    passedTests++;
  } catch (error) {
    console.error('✗ FAILED:', error.message, '\n');
    failedTests++;
  }
  
  // Test 4: get() method returns single row
  try {
    console.log('Test 4: get() method returns single row');
    const db = createTestDatabase();
    
    db.run('CREATE TABLE test_users (id INTEGER PRIMARY KEY, name TEXT)');
    db.run('INSERT INTO test_users (name) VALUES (?)', ['Alice']);
    
    const row = db.get('SELECT * FROM test_users WHERE name = ?', ['Alice']);
    
    if (!row || row.name !== 'Alice') {
      throw new Error('get() did not return expected row');
    }
    
    cleanupTestDatabase(db);
    console.log('✓ PASSED\n');
    passedTests++;
  } catch (error) {
    console.error('✗ FAILED:', error.message, '\n');
    failedTests++;
  }
  
  // Test 5: all() method returns multiple rows
  try {
    console.log('Test 5: all() method returns multiple rows');
    const db = createTestDatabase();
    
    db.run('CREATE TABLE test_users (id INTEGER PRIMARY KEY, name TEXT)');
    db.run('INSERT INTO test_users (name) VALUES (?)', ['Alice']);
    db.run('INSERT INTO test_users (name) VALUES (?)', ['Bob']);
    db.run('INSERT INTO test_users (name) VALUES (?)', ['Charlie']);
    
    const rows = db.all('SELECT * FROM test_users');
    
    if (!rows || rows.length !== 3) {
      throw new Error(`all() returned ${rows?.length} rows, expected 3`);
    }
    
    cleanupTestDatabase(db);
    console.log('✓ PASSED\n');
    passedTests++;
  } catch (error) {
    console.error('✗ FAILED:', error.message, '\n');
    failedTests++;
  }
  
  // Test 6: transaction() commits on success
  try {
    console.log('Test 6: transaction() commits on success');
    const db = createTestDatabase();
    
    db.run('CREATE TABLE test_accounts (id INTEGER PRIMARY KEY, balance INTEGER)');
    
    db.transaction(() => {
      db.run('INSERT INTO test_accounts (id, balance) VALUES (?, ?)', [1, 100]);
      db.run('INSERT INTO test_accounts (id, balance) VALUES (?, ?)', [2, 200]);
    });
    
    const rows = db.all('SELECT * FROM test_accounts');
    
    if (rows.length !== 2) {
      throw new Error('Transaction did not commit both inserts');
    }
    
    cleanupTestDatabase(db);
    console.log('✓ PASSED\n');
    passedTests++;
  } catch (error) {
    console.error('✗ FAILED:', error.message, '\n');
    failedTests++;
  }
  
  // Test 7: transaction() rolls back on error
  try {
    console.log('Test 7: transaction() rolls back on error');
    const db = createTestDatabase();
    
    db.run('CREATE TABLE test_accounts (id INTEGER PRIMARY KEY, balance INTEGER)');
    
    try {
      db.transaction(() => {
        db.run('INSERT INTO test_accounts (id, balance) VALUES (?, ?)', [1, 100]);
        throw new Error('Simulated error');
      });
    } catch (error) {
      // Expected to throw
    }
    
    const rows = db.all('SELECT * FROM test_accounts');
    
    if (rows.length !== 0) {
      throw new Error('Transaction did not rollback on error');
    }
    
    cleanupTestDatabase(db);
    console.log('✓ PASSED\n');
    passedTests++;
  } catch (error) {
    console.error('✗ FAILED:', error.message, '\n');
    failedTests++;
  }
  
  // Test 8: checkIntegrity() passes for valid database
  try {
    console.log('Test 8: checkIntegrity() passes for valid database');
    const db = createTestDatabase();
    
    const result = db.checkIntegrity();
    
    if (result !== true) {
      throw new Error('checkIntegrity() did not return true');
    }
    
    cleanupTestDatabase(db);
    console.log('✓ PASSED\n');
    passedTests++;
  } catch (error) {
    console.error('✗ FAILED:', error.message, '\n');
    failedTests++;
  }
  
  // Test 9: prepare() returns reusable statement
  try {
    console.log('Test 9: prepare() returns reusable statement');
    const db = createTestDatabase();
    
    db.run('CREATE TABLE test_users (id INTEGER PRIMARY KEY, name TEXT)');
    
    const stmt = db.prepare('INSERT INTO test_users (name) VALUES (?)');
    stmt.run('Alice');
    stmt.run('Bob');
    stmt.run('Charlie');
    
    const rows = db.all('SELECT * FROM test_users');
    
    if (rows.length !== 3) {
      throw new Error('Prepared statement did not execute multiple times');
    }
    
    cleanupTestDatabase(db);
    console.log('✓ PASSED\n');
    passedTests++;
  } catch (error) {
    console.error('✗ FAILED:', error.message, '\n');
    failedTests++;
  }
  
  // Test 10: close() closes database connection
  try {
    console.log('Test 10: close() closes database connection');
    const db = createTestDatabase();
    
    db.close();
    
    // Try to run query after close (should fail)
    let closedProperly = false;
    try {
      db.run('CREATE TABLE test (id INTEGER)');
    } catch (error) {
      if (error.message.includes('not initialized')) {
        closedProperly = true;
      }
    }
    
    if (!closedProperly) {
      throw new Error('Database still accepts queries after close()');
    }
    
    cleanupTestDatabase(null);
    console.log('✓ PASSED\n');
    passedTests++;
  } catch (error) {
    console.error('✗ FAILED:', error.message, '\n');
    failedTests++;
  }
  
  // Summary
  console.log('='.repeat(50));
  console.log(`Tests completed: ${passedTests + failedTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log('='.repeat(50));
  
  return failedTests === 0;
}

// Run tests if executed directly
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runTests };
