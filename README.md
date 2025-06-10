# Directus Hasura SSO Bridge

> Seamless single sign-on integration between Hasura and Directus admin panel

[![npm version](https://img.shields.io/npm/v/directus-extension-hasura-sso-bridge.svg?style=flat-square)](https://www.npmjs.com/package/directus-extension-hasura-sso-bridge)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Directus](https://img.shields.io/badge/Directus-263238?style=flat-square&logo=directus&logoColor=white)](https://directus.io/)
[![Hasura](https://img.shields.io/badge/Hasura-1EB4D4?style=flat-square&logo=hasura&logoColor=white)](https://hasura.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## 🚀 Features

✅ **One-Click Admin Access** - Hasura users can access Directus admin without re-authentication  
✅ **Automatic User Provisioning** - Creates Directus users automatically from Hasura JWT  
✅ **Role Mapping** - Maps Hasura roles to appropriate Directus permissions  
✅ **Secure Session Management** - Full session handling with HTTP-only cookies  
✅ **TypeScript Support** - Fully typed for better developer experience  
✅ **Production Ready** - Comprehensive error handling and logging

## 📋 Requirements

- **Directus** v10+ (TypeScript extension support)
- **Hasura** with JWT authentication configured
- **Node.js** v18+
- **PostgreSQL** (shared database recommended)

## 🔧 Installation

### Method 1: NPM Installation (Recommended)

```bash
# Navigate to your Directus project root
cd your-directus-project

# Install the extension via npm
npm install directus-extension-hasura-sso-bridge

# Restart Directus
npm start
```
