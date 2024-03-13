# Credit-Based System for API Usage

This project implements a credit-based system to manage API usage, ensuring fair access and preventing abuse. It uses Express.js for the backend, Postgres for the database, and Drizzle ORM for object-relational mapping. The testing framework is powered by Vitesse, offering a fast and efficient way to test your application.

## Quick Start

Follow these steps to clone the repository and get started:

### Prerequisites

- Node.js (v20.10.0) and npm installed
- Docker (optional, for running a Postgres container)
- Postman (for testing API endpoints)

### Setting Up Your Environment

1. **Install Dependencies**: Run `npm install` to install required dependencies.
2. **Environment Variables**:
   - Copy the `.env.example` file to `.env`.
   - Update the `.env` file with your database credentials.
3. **Database Setup**:
   - For Docker users, start a Postgres container by running `docker-compose up -d`. Make sure you have `docker-compose.yaml` ready.
   - Alternatively, manually create a database named `credit_dev` in your Postgres instance.
   - Create necessary tables by executing `npm run migrate`.
   - Populate the database with initial data using `npm run seed`.

### Seeded Data

Here's the initial data seeded into the database:

- **Users**:
  - `username`: `admin@admin.com`, `password`: `password`
  - `username`: `user@user.com`, `password`: `password`

### Configuring Database Settings for Testing

When running tests with Vitesse, ensure your database settings in `vite.config.ts` match your testing environment. This step is crucial for accurate test results.

### Running the Application

- Launch the development server with `npm run dev`.

### Testing

- Run tests using `npm run test` to ensure your setup is correct.

## API Endpoints

Explore and test the API endpoints by importing the `postman.json` schema from the root directory into your Postman application. This provides a ready-to-use collection of requests for interacting with the API.

## Tech Stack

- **Backend**: Express.js
- **Database**: Postgres with Drizzle ORM
- **Testing**: Vitesse for an efficient testing workflow

## Docker Support

A `docker-compose.yaml` file is included for convenience, facilitating the use of a Postgres container. This is optional but recommended for a seamless development setup.