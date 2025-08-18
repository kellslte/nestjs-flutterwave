## [1.0.2] - 2025-08-18

### 🔧 Chore

- chore: release version 1.0.1 with initial setup and configurations

### 📝 Other

- Initial commit of the @scwar/nestjs-flutterwave package, including core module, services, interfaces, and example usage. Added ESLint, Prettier, and Jest configurations for code quality and testing. Comprehensive documentation and changelog included.

**Total Changes:** 2 commits

## [1.0.1] - 2025-08-18

### 📝 Other

- Initial commit of the @scwar/nestjs-flutterwave package, including core module, services, interfaces, and example usage. Added ESLint, Prettier, and Jest configurations for code quality and testing. Comprehensive documentation and changelog included.

**Total Changes:** 1 commits

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of @scwar/nestjs-flutterwave
- Full Flutterwave API v3 and v4 support
- Comprehensive service coverage including:
  - Payment service
  - Transaction service
  - Customer service
  - Bank service
  - Transfer service
  - Virtual account service
  - Subscription service
  - Plan service
  - Refund service
  - Settlement service
  - Split service
  - Verification service
  - Balance service
  - BVN service
  - OTP service
  - Charge service
- TypeScript interfaces for all API endpoints
- Automatic retry logic with exponential backoff
- Comprehensive error handling with custom FlutterwaveError class
- Full test coverage with Jest
- Support for both synchronous and asynchronous module configuration
- Global module support for easy integration
- Comprehensive documentation and examples

### Technical Features
- Built on NestJS framework
- HTTP client with timeout and retry support
- Base service class for consistent API patterns
- Modular architecture for easy maintenance
- Support for custom base URLs and API versions
- Comprehensive logging and error tracking
