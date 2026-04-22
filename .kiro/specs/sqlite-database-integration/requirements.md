# Requirements Document

## Introduction

This document specifies the requirements for integrating SQLite database into the agricultural AI platform. The platform currently uses in-memory storage for disease detection jobs and needs persistent storage for users, crop listings, orders, transport jobs, contracts, and analytics across four user roles: farmers, buyers, transporters, and admins.

## Glossary

- **Database_Manager**: The SQLite database connection and initialization module
- **User_Service**: Service layer managing user authentication and profiles
- **Crop_Service**: Service layer managing crop listings and inventory
- **Order_Service**: Service layer managing orders between buyers and farmers
- **Transport_Service**: Service layer managing transport jobs and deliveries
- **Contract_Service**: Service layer managing contracts between buyers and farmers
- **Job_Service**: Service layer managing disease detection jobs
- **Analytics_Service**: Service layer providing reports and analytics
- **Migration_System**: Database schema versioning and migration system
- **API_Layer**: Express.js REST API endpoints
- **Farmer**: User role that creates crop listings and uses disease detection
- **Buyer**: User role that browses crops and creates orders
- **Transporter**: User role that accepts and completes delivery jobs
- **Admin**: User role with system-wide access and analytics

## Requirements

### Requirement 1: Database Initialization

**User Story:** As a developer, I want the SQLite database to initialize automatically on server startup, so that the application has persistent storage available.

#### Acceptance Criteria

1. WHEN the backend server starts, THE Database_Manager SHALL create a SQLite database file if it does not exist
2. WHEN the database file exists, THE Database_Manager SHALL establish a connection to it
3. THE Database_Manager SHALL execute all pending migrations in sequential order
4. IF a migration fails, THEN THE Database_Manager SHALL log the error and prevent server startup
5. THE Database_Manager SHALL verify database integrity before allowing queries

### Requirement 2: User Management

**User Story:** As a system administrator, I want to store user accounts with role-based access, so that farmers, buyers, transporters, and admins can authenticate and access appropriate features.

#### Acceptance Criteria

1. THE User_Service SHALL store user records with email, password hash, role, and profile data
2. WHEN a user registers, THE User_Service SHALL create a new user record with a unique identifier
3. WHEN a user logs in, THE User_Service SHALL verify credentials against stored password hashes
4. THE User_Service SHALL support four distinct roles: farmer, buyer, transporter, and admin
5. WHEN a user profile is updated, THE User_Service SHALL persist changes to the database
6. THE User_Service SHALL retrieve user profiles by unique identifier or email

### Requirement 3: Crop Listing Management

**User Story:** As a farmer, I want my crop listings stored persistently, so that buyers can browse and purchase my produce.

#### Acceptance Criteria

1. THE Crop_Service SHALL store crop listings with crop type, quantity, price, location, and farmer identifier
2. WHEN a farmer creates a listing, THE Crop_Service SHALL persist it with a unique identifier and timestamp
3. WHEN a buyer browses crops, THE Crop_Service SHALL retrieve active listings with farmer details
4. WHEN a listing is updated, THE Crop_Service SHALL persist the changes and update the modification timestamp
5. WHEN a listing is deleted, THE Crop_Service SHALL mark it as inactive rather than removing the record
6. THE Crop_Service SHALL filter listings by crop type, location, price range, and availability status

### Requirement 4: Order Processing

**User Story:** As a buyer, I want my orders tracked in the database, so that I can monitor purchases and delivery status.

#### Acceptance Criteria

1. THE Order_Service SHALL store orders with buyer identifier, crop listing identifier, quantity, total price, and status
2. WHEN a buyer creates an order, THE Order_Service SHALL persist it with status "pending"
3. WHEN an order status changes, THE Order_Service SHALL update the record and timestamp
4. THE Order_Service SHALL retrieve orders by buyer identifier, farmer identifier, or order identifier
5. THE Order_Service SHALL calculate order totals based on crop listing prices and quantities
6. WHEN an order is completed, THE Order_Service SHALL update the crop listing available quantity

### Requirement 5: Transport Job Management

**User Story:** As a transporter, I want transport jobs stored in the database, so that I can accept jobs and track deliveries.

#### Acceptance Criteria

1. THE Transport_Service SHALL store transport jobs with order identifier, transporter identifier, pickup location, delivery location, and status
2. WHEN a transport job is created, THE Transport_Service SHALL persist it with status "available"
3. WHEN a transporter accepts a job, THE Transport_Service SHALL update the status to "in_progress" and assign the transporter identifier
4. WHEN a delivery is completed, THE Transport_Service SHALL update the status to "completed" and record completion timestamp
5. THE Transport_Service SHALL retrieve available jobs for transporters to browse
6. THE Transport_Service SHALL retrieve active and completed deliveries by transporter identifier

### Requirement 6: Contract Management

**User Story:** As a buyer, I want contracts with farmers stored in the database, so that I can manage long-term supply agreements.

#### Acceptance Criteria

1. THE Contract_Service SHALL store contracts with buyer identifier, farmer identifier, crop type, quantity, price, duration, and terms
2. WHEN a contract is created, THE Contract_Service SHALL persist it with status "active" and start date
3. WHEN a contract expires, THE Contract_Service SHALL update the status to "expired"
4. THE Contract_Service SHALL retrieve contracts by buyer identifier or farmer identifier
5. THE Contract_Service SHALL support contract renewal by creating a new contract record
6. WHEN a contract is terminated early, THE Contract_Service SHALL update the status to "terminated" and record termination date

### Requirement 7: Disease Detection Job Persistence

**User Story:** As a farmer, I want my disease detection jobs stored persistently, so that I can review historical analysis results.

#### Acceptance Criteria

1. THE Job_Service SHALL store disease detection jobs with farmer identifier, image path, status, result, and timestamps
2. WHEN a disease detection job is created, THE Job_Service SHALL persist it with status "pending"
3. WHEN a job is processed, THE Job_Service SHALL update the status and store the analysis result
4. IF a job fails, THEN THE Job_Service SHALL update the status to "failed" and store the error message
5. THE Job_Service SHALL retrieve jobs by farmer identifier or job identifier
6. THE Job_Service SHALL retrieve job history for a farmer in reverse chronological order

### Requirement 8: Analytics and Reporting

**User Story:** As an admin, I want aggregated data from the database, so that I can generate reports and monitor platform activity.

#### Acceptance Criteria

1. THE Analytics_Service SHALL calculate total users by role
2. THE Analytics_Service SHALL calculate total orders and revenue by time period
3. THE Analytics_Service SHALL calculate active crop listings by crop type
4. THE Analytics_Service SHALL calculate completed transport jobs by transporter
5. THE Analytics_Service SHALL calculate disease detection job statistics by status
6. THE Analytics_Service SHALL retrieve top-performing farmers by order volume

### Requirement 9: Database Schema Migrations

**User Story:** As a developer, I want database schema changes managed through migrations, so that schema evolution is tracked and reversible.

#### Acceptance Criteria

1. THE Migration_System SHALL store migration records with version number, name, and execution timestamp
2. WHEN a migration is executed, THE Migration_System SHALL record it in the migrations table
3. THE Migration_System SHALL execute migrations in sequential order based on version number
4. THE Migration_System SHALL skip migrations that have already been executed
5. IF a migration fails, THEN THE Migration_System SHALL rollback the transaction and prevent subsequent migrations
6. THE Migration_System SHALL provide a mechanism to create new migration files with sequential version numbers

### Requirement 10: API Integration

**User Story:** As a frontend developer, I want REST API endpoints backed by the database, so that the UI can interact with persistent data.

#### Acceptance Criteria

1. THE API_Layer SHALL provide endpoints for user registration, login, and profile management
2. THE API_Layer SHALL provide endpoints for creating, reading, updating, and deleting crop listings
3. THE API_Layer SHALL provide endpoints for creating and retrieving orders
4. THE API_Layer SHALL provide endpoints for browsing and accepting transport jobs
5. THE API_Layer SHALL provide endpoints for creating and managing contracts
6. THE API_Layer SHALL provide endpoints for retrieving analytics and reports
7. WHEN an API request fails due to database errors, THE API_Layer SHALL return appropriate HTTP status codes and error messages

### Requirement 11: Data Validation

**User Story:** As a developer, I want input data validated before database operations, so that data integrity is maintained.

#### Acceptance Criteria

1. WHEN a user is created, THE User_Service SHALL validate email format and password strength
2. WHEN a crop listing is created, THE Crop_Service SHALL validate required fields and numeric values
3. WHEN an order is created, THE Order_Service SHALL validate that the crop listing exists and has sufficient quantity
4. WHEN a transport job is accepted, THE Transport_Service SHALL validate that the job is available
5. WHEN a contract is created, THE Contract_Service SHALL validate date ranges and numeric values
6. IF validation fails, THEN THE service SHALL return descriptive error messages without executing database operations

### Requirement 12: Transaction Management

**User Story:** As a developer, I want database operations grouped in transactions, so that data consistency is maintained during complex operations.

#### Acceptance Criteria

1. WHEN an order is created, THE Order_Service SHALL execute the order creation and crop quantity update in a single transaction
2. WHEN a transport job is accepted, THE Transport_Service SHALL execute the job assignment and order status update in a single transaction
3. IF any operation in a transaction fails, THEN THE Database_Manager SHALL rollback all changes
4. THE Database_Manager SHALL commit transactions only when all operations succeed
5. THE Database_Manager SHALL support nested transactions for complex business logic

### Requirement 13: Query Performance

**User Story:** As a user, I want database queries to execute quickly, so that the application remains responsive.

#### Acceptance Criteria

1. THE Database_Manager SHALL create indexes on frequently queried columns
2. THE Crop_Service SHALL retrieve crop listings with pagination support
3. THE Order_Service SHALL retrieve orders with pagination support
4. THE Transport_Service SHALL retrieve transport jobs with pagination support
5. THE Analytics_Service SHALL use aggregation queries rather than loading all records into memory
6. WHEN a query exceeds 1 second execution time, THE Database_Manager SHALL log a performance warning

### Requirement 14: Database Configuration

**User Story:** As a developer, I want database configuration managed through environment variables, so that different environments can use different database files.

#### Acceptance Criteria

1. THE Database_Manager SHALL read the database file path from an environment variable
2. WHERE no database path is configured, THE Database_Manager SHALL use a default path in the backend directory
3. THE Database_Manager SHALL support separate database files for development, testing, and production
4. THE Database_Manager SHALL read connection pool settings from environment variables
5. WHERE no pool settings are configured, THE Database_Manager SHALL use sensible defaults

### Requirement 15: Error Handling and Logging

**User Story:** As a developer, I want database errors logged with context, so that I can diagnose and fix issues.

#### Acceptance Criteria

1. WHEN a database operation fails, THE Database_Manager SHALL log the error with query details and parameters
2. WHEN a constraint violation occurs, THE Database_Manager SHALL log the constraint name and conflicting values
3. WHEN a connection error occurs, THE Database_Manager SHALL log the connection details and retry attempts
4. THE Database_Manager SHALL distinguish between recoverable and non-recoverable errors
5. IF a non-recoverable error occurs, THEN THE Database_Manager SHALL prevent further database operations until resolved
