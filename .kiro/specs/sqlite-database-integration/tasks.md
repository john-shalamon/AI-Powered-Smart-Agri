# Implementation Plan: SQLite Database Integration

## Overview

This implementation plan converts the SQLite database integration design into discrete coding tasks. The approach follows a layered architecture: Database Manager → Migration System → Service Layers → Controllers → API Routes → Server Integration. Each task builds incrementally, with checkpoints to validate functionality before proceeding.

The implementation uses JavaScript with better-sqlite3 for synchronous SQLite operations, integrates with the existing Express.js backend, and replaces in-memory storage with persistent database storage across seven service layers (User, Crop, Order, Transport, Contract, Job, Analytics).

## Tasks

- [x] 1. Install dependencies and configure environment
  - Install better-sqlite3 and fast-check using pnpm
  - Add DB_PATH environment variable to .env and .env.example
  - Create backend/data directory for database file
  - _Requirements: 14.1, 14.2, 14.3_

- [ ] 2. Implement Database Manager
  - [-] 2.1 Create backend/db/database.js with DatabaseManager class
    - Implement constructor, initialize(), close() methods
    - Implement run(), get(), all(), prepare() query methods
    - Implement transaction() method with BEGIN/COMMIT/ROLLBACK
    - Implement checkIntegrity() using PRAGMA integrity_check
    - Enable foreign key constraints with PRAGMA foreign_keys = ON
    - Export singleton instance with DB_PATH from environment
    - _Requirements: 1.1, 1.2, 1.5, 12.3, 12.4, 15.1_

  - [~] 2.2 Write property test for Database Manager
    - **Property 46: Transaction Commit On Success**
    - **Validates: Requirements 12.4**

- [ ] 3. Implement Migration System
  - [~] 3.1 Create migration infrastructure in backend/db/database.js
    - Add runMigrations() method to DatabaseManager
    - Read migration files from backend/db/migrations/ directory
    - Parse version numbers from filenames (e.g., 001_initial_schema.sql)
    - Query migrations table for executed versions
    - Execute pending migrations in sequential order within transactions
    - Record successful migrations in migrations table
    - Throw error and prevent startup if migration fails
    - _Requirements: 1.3, 1.4, 9.1, 9.2, 9.3, 9.4, 9.5_

  - [~] 3.2 Write property tests for Migration System
    - **Property 1: Migration Sequential Execution**
    - **Validates: Requirements 1.3, 9.3**
    - **Property 2: Migration Idempotence**
    - **Validates: Requirements 9.4**
    - **Property 3: Migration Recording**
    - **Validates: Requirements 9.1, 9.2**

- [ ] 4. Create initial database schema migration
  - [~] 4.1 Create backend/db/migrations/001_initial_schema.sql
    - Create migrations table
    - Create users table with indexes
    - Create crop_listings table with indexes
    - Create orders table with indexes
    - Create transport_jobs table with indexes
    - Create contracts table with indexes
    - Create disease_detection_jobs table with indexes
    - _Requirements: 2.1, 3.1, 4.1, 5.1, 6.1, 7.1_

- [ ] 5. Checkpoint - Verify database initialization
  - Ensure database file is created and migrations execute successfully
  - Ensure all tests pass, ask the user if questions arise

- [ ] 6. Implement User Service
  - [~] 6.1 Create backend/services/user.service.js with UserService class
    - Implement register() method with password hashing (bcrypt or similar)
    - Implement login() method with password verification
    - Implement getUserById() and getUserByEmail() methods
    - Implement updateProfile() method
    - Implement getAllUsers() and getUsersByRole() with pagination
    - Implement validation methods: validateEmail(), validatePassword()
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 11.1, 13.2_

  - [~] 6.2 Write unit tests for User Service
    - Test registration with valid and invalid data
    - Test login with correct and incorrect credentials
    - Test profile retrieval and updates
    - Test email and password validation
    - _Requirements: 2.2, 2.3, 2.5_

  - [~] 6.3 Write property tests for User Service
    - **Property 4: User Registration Uniqueness**
    - **Validates: Requirements 2.2**
    - **Property 5: User Credential Verification**
    - **Validates: Requirements 2.3**
    - **Property 6: User Profile Round-Trip**
    - **Validates: Requirements 2.1, 2.6**
    - **Property 7: User Profile Update Persistence**
    - **Validates: Requirements 2.5**
    - **Property 39: User Validation Rejects Invalid Email**
    - **Validates: Requirements 11.1, 11.6**

- [ ] 7. Implement Crop Service
  - [~] 7.1 Create backend/services/crop.service.js with CropService class
    - Implement createListing() method
    - Implement getListing() method
    - Implement updateListing() method with timestamp update
    - Implement deleteListing() method (soft delete - mark inactive)
    - Implement getActiveListings() with filters and pagination
    - Implement getListingsByFarmer() with pagination
    - Implement searchListings() with query and filters
    - Implement updateQuantity() and checkAvailability() methods
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 11.2, 13.2_

  - [~] 7.2 Write unit tests for Crop Service
    - Test listing creation, retrieval, update, and soft delete
    - Test active listings filter
    - Test filtering by crop type, location, price range
    - Test quantity updates and availability checks
    - _Requirements: 3.1, 3.3, 3.4, 3.5_

  - [~] 7.3 Write property tests for Crop Service
    - **Property 8: Crop Listing Round-Trip**
    - **Validates: Requirements 3.1, 3.2**
    - **Property 9: Crop Listing Active Filter**
    - **Validates: Requirements 3.3**
    - **Property 10: Crop Listing Soft Delete**
    - **Validates: Requirements 3.5**
    - **Property 11: Crop Listing Update Timestamp**
    - **Validates: Requirements 3.4**
    - **Property 12: Crop Listing Filtering**
    - **Validates: Requirements 3.6**
    - **Property 40: Crop Validation Rejects Invalid Data**
    - **Validates: Requirements 11.2, 11.6**

- [ ] 8. Implement Order Service
  - [~] 8.1 Create backend/services/order.service.js with OrderService class
    - Implement createOrder() method with transaction (create order + update listing quantity)
    - Implement getOrder() method with listing and user details
    - Implement updateOrderStatus() method with timestamp update
    - Implement getOrdersByBuyer(), getOrdersByFarmer(), getOrdersByStatus() with pagination
    - Implement calculateTotal() method
    - Implement validateOrder() method (check listing exists and has sufficient quantity)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 11.3, 12.1, 13.3_

  - [~] 8.2 Write unit tests for Order Service
    - Test order creation with valid and invalid data
    - Test order status updates
    - Test order retrieval by buyer, farmer, and status
    - Test total calculation
    - Test validation for non-existent listings and insufficient quantity
    - _Requirements: 4.2, 4.3, 4.5, 4.6_

  - [~] 8.3 Write property tests for Order Service
    - **Property 13: Order Creation Initial Status**
    - **Validates: Requirements 4.2**
    - **Property 14: Order Status Update Timestamp**
    - **Validates: Requirements 4.3**
    - **Property 15: Order Round-Trip**
    - **Validates: Requirements 4.1, 4.4**
    - **Property 16: Order Total Calculation**
    - **Validates: Requirements 4.5**
    - **Property 17: Order Completion Inventory Update**
    - **Validates: Requirements 4.6**
    - **Property 41: Order Validation Checks Inventory**
    - **Validates: Requirements 11.3, 11.6**
    - **Property 44: Transaction Atomicity For Order Creation**
    - **Validates: Requirements 12.1, 12.3**

- [ ] 9. Checkpoint - Verify core services
  - Ensure User, Crop, and Order services work correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 10. Implement Transport Service
  - [~] 10.1 Create backend/services/transport.service.js with TransportService class
    - Implement createJob() method
    - Implement getJob() method
    - Implement acceptJob() method with transaction (update job + update order status)
    - Implement completeJob() method with timestamp update
    - Implement getAvailableJobs() with filters and pagination
    - Implement getJobsByTransporter() and getJobsByStatus() with pagination
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 11.4, 12.2, 13.4_

  - [~] 10.2 Write unit tests for Transport Service
    - Test job creation, acceptance, and completion
    - Test available jobs filter
    - Test job retrieval by transporter and status
    - Test validation for accepting non-available jobs
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [~] 10.3 Write property tests for Transport Service
    - **Property 18: Transport Job Creation Initial Status**
    - **Validates: Requirements 5.2**
    - **Property 19: Transport Job Acceptance State Update**
    - **Validates: Requirements 5.3**
    - **Property 20: Transport Job Completion Timestamp**
    - **Validates: Requirements 5.4**
    - **Property 21: Transport Job Available Filter**
    - **Validates: Requirements 5.5**
    - **Property 22: Transport Job Transporter Query**
    - **Validates: Requirements 5.6**
    - **Property 42: Transport Job Validation Checks Availability**
    - **Validates: Requirements 11.4, 11.6**
    - **Property 45: Transaction Atomicity For Job Acceptance**
    - **Validates: Requirements 12.2, 12.3**

- [ ] 11. Implement Contract Service
  - [~] 11.1 Create backend/services/contract.service.js with ContractService class
    - Implement createContract() method with status "active" and start_date
    - Implement getContract() method
    - Implement updateContract() method
    - Implement terminateContract() method with termination_date and reason
    - Implement getContractsByBuyer() and getContractsByFarmer() with pagination
    - Implement getActiveContracts() with filters and pagination
    - Implement renewContract() method (creates new contract record)
    - Implement checkExpiration() method (updates expired contracts)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 11.5_

  - [~] 11.2 Write unit tests for Contract Service
    - Test contract creation, retrieval, update, and termination
    - Test contract renewal creates new record
    - Test expiration check updates status
    - Test validation for invalid date ranges and numeric values
    - _Requirements: 6.2, 6.3, 6.5, 6.6_

  - [~] 11.3 Write property tests for Contract Service
    - **Property 23: Contract Creation Initial Status**
    - **Validates: Requirements 6.2**
    - **Property 24: Contract Expiration Status Update**
    - **Validates: Requirements 6.3**
    - **Property 25: Contract Round-Trip**
    - **Validates: Requirements 6.1, 6.4**
    - **Property 26: Contract Renewal Creates New Record**
    - **Validates: Requirements 6.5**
    - **Property 27: Contract Early Termination**
    - **Validates: Requirements 6.6**
    - **Property 43: Contract Validation Rejects Invalid Data**
    - **Validates: Requirements 11.5, 11.6**

- [ ] 12. Implement Job Service (Disease Detection)
  - [~] 12.1 Create backend/services/job.service.js with JobService class
    - Implement createJob() method with status "pending"
    - Implement getJob() method
    - Implement updateJob() method (for status and result updates)
    - Implement getJobsByFarmer() with pagination
    - Implement getJobsByStatus() with pagination
    - Implement getJobHistory() with reverse chronological ordering
    - Implement getJobStats() method
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [~] 12.2 Write unit tests for Job Service
    - Test job creation, retrieval, and updates
    - Test job history ordering
    - Test job statistics calculation
    - _Requirements: 7.2, 7.3, 7.6_

  - [~] 12.3 Write property tests for Job Service
    - **Property 28: Disease Detection Job Creation Initial Status**
    - **Validates: Requirements 7.2**
    - **Property 29: Disease Detection Job Processing Result Storage**
    - **Validates: Requirements 7.3**
    - **Property 30: Disease Detection Job Round-Trip**
    - **Validates: Requirements 7.1, 7.5**
    - **Property 31: Disease Detection Job History Ordering**
    - **Validates: Requirements 7.6**

- [ ] 13. Implement Analytics Service
  - [~] 13.1 Create backend/services/analytics.service.js with AnalyticsService class
    - Implement getUserCountByRole() method
    - Implement getNewUsersCount() method with date range filter
    - Implement getTotalOrders() and getTotalRevenue() with date range filter
    - Implement getOrdersByStatus() method
    - Implement getActiveListingsCount() and getListingsByCropType() methods
    - Implement getCompletedJobsCount() with date range filter
    - Implement getJobsByTransporter() method with limit
    - Implement getJobStatsByStatus() method
    - Implement getJobTrends() method with date range filter
    - Implement getTopFarmers() and getTopBuyers() methods with limit
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 13.5_

  - [~] 13.2 Write unit tests for Analytics Service
    - Test user count by role
    - Test order and revenue calculations
    - Test active listings count
    - Test completed jobs count
    - Test top farmers and buyers ordering
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6_

  - [~] 13.3 Write property tests for Analytics Service
    - **Property 32: Analytics User Count By Role**
    - **Validates: Requirements 8.1**
    - **Property 33: Analytics Order Revenue Calculation**
    - **Validates: Requirements 8.2**
    - **Property 34: Analytics Active Listings By Crop Type**
    - **Validates: Requirements 8.3**
    - **Property 35: Analytics Completed Jobs By Transporter**
    - **Validates: Requirements 8.4**
    - **Property 36: Analytics Job Statistics By Status**
    - **Validates: Requirements 8.5**
    - **Property 37: Analytics Top Farmers Ordering**
    - **Validates: Requirements 8.6**

- [ ] 14. Checkpoint - Verify all services
  - Ensure all seven service layers work correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 15. Implement User Controller and Routes
  - [~] 15.1 Create backend/controllers/user.controller.js
    - Implement register handler (POST /api/users/register)
    - Implement login handler (POST /api/users/login)
    - Implement getProfile handler (GET /api/users/:id)
    - Implement updateProfile handler (PUT /api/users/:id)
    - Implement getAllUsers handler (GET /api/users) with pagination
    - Add error handling with appropriate HTTP status codes
    - _Requirements: 10.1, 10.7, 15.1_

  - [~] 15.2 Create backend/routes/user.routes.js
    - Define routes for user registration, login, profile management
    - Wire routes to user controller handlers
    - _Requirements: 10.1_

  - [~] 15.3 Write API integration tests for user endpoints
    - Test POST /api/users/register with valid and invalid data
    - Test POST /api/users/login with correct and incorrect credentials
    - Test GET /api/users/:id
    - Test PUT /api/users/:id
    - Test error response format
    - _Requirements: 10.1, 10.7_

  - [~] 15.4 Write property test for API error responses
    - **Property 38: API Error Response Format**
    - **Validates: Requirements 10.7**

- [ ] 16. Implement Crop Controller and Routes
  - [~] 16.1 Create backend/controllers/crop.controller.js
    - Implement createListing handler (POST /api/crops)
    - Implement getListing handler (GET /api/crops/:id)
    - Implement updateListing handler (PUT /api/crops/:id)
    - Implement deleteListing handler (DELETE /api/crops/:id)
    - Implement getActiveListings handler (GET /api/crops) with filters and pagination
    - Implement getListingsByFarmer handler (GET /api/crops/farmer/:farmerId)
    - Add error handling with appropriate HTTP status codes
    - _Requirements: 10.2, 10.7_

  - [~] 16.2 Create backend/routes/crop.routes.js
    - Define routes for crop listing management
    - Wire routes to crop controller handlers
    - _Requirements: 10.2_

  - [~] 16.3 Write API integration tests for crop endpoints
    - Test POST /api/crops with valid and invalid data
    - Test GET /api/crops with filters
    - Test PUT /api/crops/:id
    - Test DELETE /api/crops/:id (soft delete)
    - _Requirements: 10.2_

- [ ] 17. Implement Order Controller and Routes
  - [~] 17.1 Create backend/controllers/order.controller.js
    - Implement createOrder handler (POST /api/orders)
    - Implement getOrder handler (GET /api/orders/:id)
    - Implement updateOrderStatus handler (PUT /api/orders/:id/status)
    - Implement getOrdersByBuyer handler (GET /api/orders/buyer/:buyerId)
    - Implement getOrdersByFarmer handler (GET /api/orders/farmer/:farmerId)
    - Add error handling with appropriate HTTP status codes
    - _Requirements: 10.3, 10.7_

  - [~] 17.2 Create backend/routes/order.routes.js
    - Define routes for order management
    - Wire routes to order controller handlers
    - _Requirements: 10.3_

  - [~] 17.3 Write API integration tests for order endpoints
    - Test POST /api/orders with valid and invalid data
    - Test GET /api/orders/:id
    - Test PUT /api/orders/:id/status
    - Test transaction atomicity for order creation
    - _Requirements: 10.3_

- [ ] 18. Implement Transport Controller and Routes
  - [~] 18.1 Create backend/controllers/transport.controller.js
    - Implement createJob handler (POST /api/transport/jobs)
    - Implement getJob handler (GET /api/transport/jobs/:id)
    - Implement acceptJob handler (PUT /api/transport/jobs/:id/accept)
    - Implement completeJob handler (PUT /api/transport/jobs/:id/complete)
    - Implement getAvailableJobs handler (GET /api/transport/jobs/available)
    - Implement getJobsByTransporter handler (GET /api/transport/jobs/transporter/:transporterId)
    - Add error handling with appropriate HTTP status codes
    - _Requirements: 10.4, 10.7_

  - [~] 18.2 Create backend/routes/transport.routes.js
    - Define routes for transport job management
    - Wire routes to transport controller handlers
    - _Requirements: 10.4_

  - [~] 18.3 Write API integration tests for transport endpoints
    - Test POST /api/transport/jobs
    - Test PUT /api/transport/jobs/:id/accept
    - Test PUT /api/transport/jobs/:id/complete
    - Test GET /api/transport/jobs/available
    - _Requirements: 10.4_

- [ ] 19. Implement Contract Controller and Routes
  - [~] 19.1 Create backend/controllers/contract.controller.js
    - Implement createContract handler (POST /api/contracts)
    - Implement getContract handler (GET /api/contracts/:id)
    - Implement updateContract handler (PUT /api/contracts/:id)
    - Implement terminateContract handler (PUT /api/contracts/:id/terminate)
    - Implement getContractsByBuyer handler (GET /api/contracts/buyer/:buyerId)
    - Implement getContractsByFarmer handler (GET /api/contracts/farmer/:farmerId)
    - Implement renewContract handler (POST /api/contracts/:id/renew)
    - Add error handling with appropriate HTTP status codes
    - _Requirements: 10.5, 10.7_

  - [~] 19.2 Create backend/routes/contract.routes.js
    - Define routes for contract management
    - Wire routes to contract controller handlers
    - _Requirements: 10.5_

  - [~] 19.3 Write API integration tests for contract endpoints
    - Test POST /api/contracts
    - Test PUT /api/contracts/:id/terminate
    - Test POST /api/contracts/:id/renew
    - Test contract expiration check
    - _Requirements: 10.5_

- [ ] 20. Update AI Controller to use Job Service
  - [~] 20.1 Modify backend/controllers/ai.controller.js
    - Replace jobStore imports with JobService
    - Update createJob calls to use JobService.createJob()
    - Update getJob calls to use JobService.getJob()
    - Update updateJob calls to use JobService.updateJob()
    - Add farmerId parameter to job creation
    - _Requirements: 7.1, 7.2, 7.3_

  - [~] 20.2 Write API integration tests for updated AI endpoints
    - Test POST /api/ai/disease-detection creates job in database
    - Test GET /api/ai/jobs/:id retrieves job from database
    - Test job status updates persist to database
    - _Requirements: 7.1, 7.5_

- [ ] 21. Implement Analytics Controller and Routes
  - [~] 21.1 Create backend/controllers/analytics.controller.js
    - Implement getUserStats handler (GET /api/analytics/users)
    - Implement getOrderStats handler (GET /api/analytics/orders)
    - Implement getCropStats handler (GET /api/analytics/crops)
    - Implement getTransportStats handler (GET /api/analytics/transport)
    - Implement getJobStats handler (GET /api/analytics/jobs)
    - Implement getTopPerformers handler (GET /api/analytics/top-performers)
    - Add error handling with appropriate HTTP status codes
    - _Requirements: 10.6, 10.7_

  - [~] 21.2 Create backend/routes/analytics.routes.js
    - Define routes for analytics and reporting
    - Wire routes to analytics controller handlers
    - _Requirements: 10.6_

  - [~] 21.3 Write API integration tests for analytics endpoints
    - Test GET /api/analytics/users
    - Test GET /api/analytics/orders with date range
    - Test GET /api/analytics/top-performers
    - _Requirements: 10.6_

- [ ] 22. Checkpoint - Verify all API endpoints
  - Ensure all controllers and routes work correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 23. Update server.js for database initialization
  - [~] 23.1 Modify backend/server.js
    - Import DatabaseManager singleton
    - Call db.initialize() before starting Express server
    - Add error handling for database initialization failures
    - Add graceful shutdown handler to close database connection
    - Log successful database initialization
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [~] 23.2 Wire all new routes into server.js
    - Import and mount user routes at /api/users
    - Import and mount crop routes at /api/crops
    - Import and mount order routes at /api/orders
    - Import and mount transport routes at /api/transport
    - Import and mount contract routes at /api/contracts
    - Import and mount analytics routes at /api/analytics
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [ ] 24. Create test fixtures and utilities
  - [~] 24.1 Create backend/tests/fixtures/test-database.js
    - Implement createTestDatabase() function (uses :memory: database)
    - Implement cleanupTestDatabase() function
    - _Requirements: Testing infrastructure_

  - [~] 24.2 Create backend/tests/fixtures/generators.js
    - Implement fast-check generators for user, cropListing, order, transportJob, contract, job
    - Export all generators for use in property tests
    - _Requirements: Testing infrastructure_

- [ ] 25. Implement error handling and logging
  - [~] 25.1 Add error handling to DatabaseManager
    - Implement error classification (recoverable vs non-recoverable)
    - Implement error logging with SQL query and parameters
    - Implement retry logic for deadlock and connection pool errors
    - Add performance logging for slow queries (> 1 second)
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 13.6_

  - [~] 25.2 Write property tests for error handling
    - **Property 48: Database Error Logging**
    - **Validates: Requirements 15.1**
    - **Property 49: Error Classification**
    - **Validates: Requirements 15.4**

- [ ] 26. Implement pagination utility
  - [~] 26.1 Add pagination helper to DatabaseManager or create utility module
    - Implement pagination logic (LIMIT and OFFSET calculation)
    - Ensure consistent pagination across all services
    - _Requirements: 13.2, 13.3, 13.4_

  - [~] 26.2 Write property test for pagination
    - **Property 47: Pagination Consistency**
    - **Validates: Requirements 13.2, 13.3, 13.4**

- [ ] 27. Create database schema reference
  - [~] 27.1 Create backend/db/schema.sql
    - Document complete database schema with all tables and indexes
    - Include comments explaining relationships and constraints
    - _Requirements: Documentation_

- [ ] 28. Remove deprecated in-memory storage
  - [~] 28.1 Delete backend/store/jobStore.js
    - Remove file as it's replaced by Job Service
    - _Requirements: 7.1_

- [ ] 29. Final checkpoint - End-to-end verification
  - Run all unit tests and property tests
  - Verify database initialization on server startup
  - Verify all API endpoints work with database
  - Verify migrations execute correctly
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All services use the DatabaseManager singleton for consistent database access
- Transaction support is critical for Order and Transport services to maintain data consistency
- The implementation uses JavaScript with better-sqlite3 for synchronous SQLite operations
- Password hashing should use bcrypt or a similar secure hashing library
- All timestamps use ISO 8601 format for consistency
- Foreign key constraints are enabled at the database level for referential integrity
