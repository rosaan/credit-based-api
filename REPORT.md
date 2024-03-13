# Report on Credit-Based System Implementation

## Database Design and Interaction

### Schema Design

The database schema is pivotal in supporting the functionality of the credit-based system. It consists of two primary tables:

- **Users**: Stores user information, including email, password, and role. Each user is uniquely identified by an `id` and is assigned a role that determines access levels within the system.
- **Transactions**: Records each credit transaction, including deductions. Transactions are linked to users via the `userId` field, ensuring that each credit movement is accurately tracked against a user account.


### Interaction Patterns

Database interaction, particularly for credit deductions, is handled through transactional operations to ensure data integrity and consistency. When a user consumes an API, a transaction record is created via middleware, deducting the 1 credit from their available credits. The basic double-entry system is employed to record this transaction, ensuring that the sum of all credits in the system remains constant, thereby preserving the integrity of the credit management system.

## Handling of Credit Deductions

Credit deductions are a critical aspect of the system, ensuring users are billed accurately for their API usage. The process is as follows:

1. **API Consumption**: Upon API request, the system checks the user's available credits via middleware to ensure sufficient balance.
2. **Deduction**: If the balance is sufficient, the system proceeds to deduct the necessary credits from the user's account, recording the transaction and proceed with the API request.
3. **Transaction Recording**: The deduction is recorded as a transaction, with details including the user ID, amount deducted, and timestamp.

## Introduction of Caching for Balance Checks

To enhance system performance and efficiency, a caching mechanism was introduced for balance checks. This optimization significantly reduces database load by caching the user's balance after each transaction. If there are no new transactions, balance inquiries retrieve the cached value, expediting response times and improving user experience.

### Caching Strategy

The caching strategy involves:

- **Caching on Transaction**: Whenever a transaction is processed, the user's new balance is calculated and updated in the cache.
- **Balance Inquiry**: For balance checks, the system first attempts to retrieve the balance from the cache. If the cache is up-to-date, this value is used; otherwise, the system falls back to a database query to fetch the current balance.
- **Cache Invalidation**: The cache is invalidated or updated upon any transaction affecting the user's balance, ensuring the cached balance remains accurate.

## Challenges Faced

The implementation of the credit-based system was straightforward, owing to prior experience with similar systems. No significant challenges were encountered during development.