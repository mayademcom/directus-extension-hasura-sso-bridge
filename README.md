# Directus Hasura SSO Bridge

> Seamless single sign-on integration between Hasura and Directus admin panel

[![npm version](https://img.shields.io/npm/v/@mayademcom/directus-extension-hasura-sso-bridge.svg?style=flat-square)](https://www.npmjs.com/package/@mayademcom/directus-extension-hasura-sso-bridge)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mayademcom_directus-extension-hasura-sso-bridge&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mayademcom_directus-extension-hasura-sso-bridge)
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

## 🔧 Installation

### Method 1: NPM Installation (Recommended)

```bash
# Navigate to your Directus project root
cd your-directus-project

# Install the extension via npm
npm install @mayademcom/directus-extension-hasura-sso-bridge

# Restart Directus
npm start
```

### Method 2: Manual Installation

```bash
# Clone or download the extension
git clone https://github.com/mayademcom/directus-extension-hasura-sso-bridge.git

# Navigate to your Directus project
cd your-directus-project

# Copy extension to Directus extensions directory
cp -r directus-extension-hasura-sso-bridge extensions/endpoints/

# Install dependencies
cd extensions/endpoints/directus-extension-hasura-sso-bridge
npm install

# Build the extension
npm run build

# Return to project root and restart Directus
cd ../../../
npm start
```

### Method 3: Direct Download

1. Download the latest release from [GitHub Releases](https://github.com/yourusername/directus-extension-hasura-sso-bridge/releases)

2. Extract to `extensions/endpoints/directus-extension-hasura-sso-bridge/`

3. Run `npm install && npm run build` in the extension directory

4. Restart Directus

## ⚙️ Configuration

### 1. Environment Variables

Add these to your Directus `.env` file:

```env
# Your existing Directus configuration...

# Hasura JWT Secret (same as your Hasura instance)
HASURA_ADMIN_JWT_SECRET=your-hasura-jwt-secret-key

# Directus JWT Secret
SECRET=your-directus-secret-key
```

### 2. Directus Roles Setup

Create these roles in Directus admin panel:

- **Administrator** - Full system access
- **Editor** - Content management access

Or customize role mapping in the extension configuration.

### 3. Verification

After installation, verify the extension is loaded:

```bash

# Check health endpoint
curl http://localhost:8055/hasura-sso-bridge/health

# Expected response:
{
   "status": "healthy",
   "service": "hasura-sso-bridge",
   "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🎯 Usage

### Basic Usage

1. **Set Hasura JWT Token as Cookie** in your application

```javascript
// Set the Authorization cookie with your Hasura token
document.cookie = `Authorization=${hasuraToken}; path=/; SameSite=Lax; Secure`;
```

2. **Navigate to SSO endpoint** (no token parameter needed):

```
   GET https://your-directus.com/hasura-sso-bridge
```

3. **Automatic redirect** to Directus admin panel with authenticated session

### Frontend Integration

```javascript
// Example: Auto-redirect button with cookie
function openDirectusAdmin() {
  const hasuraToken = getHasuraToken(); // Your token retrieval logic

  // Set token as cookie
  document.cookie = `Authorization=${hasuraToken}; path=/; SameSite=Lax; Secure`;

  // Redirect to SSO endpoint
  const ssoUrl = "https://your-directus.com/hasura-sso-bridge";
  window.open(ssoUrl, "_blank");
}

// Example: Using fetch with credentials
async function openDirectusAdminWithFetch() {
  const hasuraToken = getHasuraToken();

  // Set cookie
  document.cookie = `Authorization=${hasuraToken}; path=/; SameSite=Lax; Secure`;

  // Open in new window
  window.open("https://your-directus.com/hasura-sso-bridge", "_blank");
}
```

```html
Open Content Management
```

### React Integration

```jsx
import { useAuthToken } from "./hooks/useAuth";

function CMSAccessButton() {
  const { hasuraToken } = useAuthToken();

  const openCMS = () => {
    // Set Hasura token as cookie
    document.cookie = `Authorization=${hasuraToken}; path=/; SameSite=Lax; Secure`;

    // Open SSO endpoint
    const ssoUrl = `${process.env.REACT_APP_DIRECTUS_URL}/hasura-sso-bridge`;
    window.open(ssoUrl, '_blank');
  };

  return (

      Open Content Management

  );
}
```

### Advanced: Using Fetch API

```javascript
// If you need more control, use fetch with credentials
async function authenticateWithDirectus() {
  const hasuraToken = getHasuraToken();

  // Set cookie first
  document.cookie = `Authorization=${hasuraToken}; path=/; SameSite=Lax; Secure`;

  try {
    // Call SSO endpoint with credentials
    const response = await fetch(
      `${process.env.REACT_APP_DIRECTUS_URL}/hasura-sso-bridge`,
      {
        method: "GET",
        credentials: "include", // Important: Include cookies
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.redirected) {
      // Successfully authenticated, redirect to admin
      window.location.href = response.url;
    }
  } catch (error) {
    console.error("Authentication failed:", error);
  }
}
```

### API Integration

```bash
# Direct API call with cookie
curl "https://your-directus.com/hasura-sso-bridge" \
  -H "Cookie: Authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." \
  -L  # Follow redirects

# Response: 302 Redirect to /admin/content with authenticated session

# Test without authentication (should return 401)
curl "https://your-directus.com/hasura-sso-bridge" -v
# Response: 401 Unauthorized
```

### Security Notes

- **Cookie Security**: The extension reads the Hasura JWT token from the `Authorization` cookie, not from URL parameters
- **Credentials Required**: Frontend requests must include `credentials: 'include'` to send cookies
- **HTTPS Recommended**: Use `Secure` flag in production to ensure cookies are only sent over HTTPS
- **SameSite Protection**: Set `SameSite=Lax` or `SameSite=Strict` to prevent CSRF attacks
- **No Token in URL**: Tokens are never exposed in URLs, browser history, or server logs

### Cookie Configuration

```javascript
// Development (HTTP)
document.cookie = `Authorization=${token}; path=/; SameSite=Lax`;

// Production (HTTPS)
document.cookie = `Authorization=${token}; path=/; SameSite=Lax; Secure`;

// With expiration (optional)
const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
document.cookie = `Authorization=${token}; path=/; SameSite=Lax; Secure; expires=${expires.toUTCString()}`;
```

## 🔐 Security & Authentication

### JWT Token Format

Your Hasura JWT must include these claims:

```json
{
  "sub": "user-id-123",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "https://hasura.io/jwt/claims": {
    "x-hasura-user-id": "user-id-123",
    "x-hasura-default-role": "editor",
    "x-hasura-allowed-roles": ["editor"]
  }
}
```

### Role Mapping

| Hasura Role   | Directus Role | Permissions             |
| ------------- | ------------- | ----------------------- |
| `super_admin` | Administrator | Full system access      |
| `editor`      | Editor        | Content management only |

### Security Features

- **HTTP-Only Cookies** - Prevents XSS attacks
- **Secure Session Management** - Proper session lifecycle
- **Role Validation** - Only authorized roles can access
- **Automatic User Provisioning** - JIT (Just-In-Time) user creation
- **Token Validation** - Strict JWT verification

## 🛠️ Advanced Configuration

### Custom Role Mapping

Create a custom configuration file:

```javascript
// extensions/endpoints/directus-extensio-hasura-sso-bridge/config/roles.js

export const ROLE_MAPPING: RoleMapping = {
  super_admin: "Administrator",
  editor: "Editor",
  content_manager: "Editor",
  api_user: "User",
  // Add your custom roles here
};
```

### Session Duration

Modify session duration:

```env
# Add to your .env file
SESSION_DURATION_HOURS=86400000 # 24 hours in milliseconds
```

# 📚 API Reference

### Endpoints

#### `GET /hasura-sso-bridge`

Main SSO authentication endpoint.

**Parameters:**

- `token` (query, required) - Hasura JWT token

**Response:**

- `302` - Redirect to `/admin/content` with authenticated session
- `403` - Access denied (invalid token/role)

**Example:**

```bash
curl -L "https://your-directus.com/hasura-sso-bridge?token=eyJ0eXAiOiJKV1Q..."
```

#### `GET /hasura-sso-bridge/health`

Health check endpoint for monitoring.

**Response:**

```json
{
  "status": "healthy",
  "service": "hasura-sso-bridge",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### `GET /hasura-sso-bridge/config`

Configuration information endpoint.

**Response:**

```json
{
  "supportedRoles": ["super_admin", "editor"],
  "environment": "production",
  "features": ["jwt-auth", "role-mapping", "auto-provisioning"]
}
```

# 🧪 Development

### Local Development

```bash

# Clone the repository
git clone https://github.com/yourusername/directus-extension-hasura-sso-bridge.git
cd directus-extension-hasura-sso-bridge
    # Install dependencies
    npm install
    # Development build with watch mode
    npm run dev

    # Type checking
    npm run type-check

    # Linting
    npm run lint

    # Build for production
    npm run build
```

### Testing

```bash
# Test the health endpoint
curl http://localhost:8055/hasura-sso-bridge/health

 # Test configuration endpoint
 curl http://localhost:8055/hasura-sso-bridge/config

 # Test with a valid token
 curl "http://localhost:8055/hasura-sso-bridge?token=YOUR_TEST_TOKEN"
```

### Release Process

```bash
# Release in both NPM and Github
npm run release


```

## 🚨 Troubleshooting

### Common Issues

#### "Access denied" Error

- **Cause**: Invalid JWT token or unsupported role
- **Solution**: Verify token format and role mapping
- **Debug**: Check `/hasura-sso-bridge/config` for supported roles

#### "Directus SECRET not configured" Error

- **Cause**: Missing environment variable
- **Solution**: Add `SECRET` to your `.env` file
- **Verify**: Restart Directus after adding environment variables

#### "Role 'X' not found" Error

- **Cause**: Directus role doesn't exist in database
- **Solution**: Create the role in Directus admin or update role mapping
- **Check**: Visit Settings > Access Control > Roles in Directus admin

#### Extension not loading

- **Cause**: Build errors or incorrect file structure
- **Solution**: Check extension logs and rebuild with `npm run build`
- **Verify**: Check Directus logs for extension loading errors

#### "Invalid or expired Hasura token"

- **Cause**: Token verification failed
- **Solution**: Verify `HASURA_ADMIN_JWT_SECRET` matches your Hasura configuration
- **Debug**: Use [jwt.io](https://jwt.io) to inspect token claims

### Logs Format

All logs include the `[Hasura-SSO-Bridge]` prefix:
[Hasura-SSO-Bridge] ✅ SSO authentication completed, redirecting to admin
[Hasura-SSO-Bridge] ❌ SSO authentication failed: Invalid token
[Hasura-SSO-Bridge] ⚠️ Role mapping failed for role: invalid_role

### Health Monitoring

Monitor the extension with the health endpoint:

```bash
# Check extension health
curl -f http://localhost:8055/hasura-sso-bridge/health || echo "Extension unhealthy"

# Monitor in production
watch -n 30 'curl -s http://your-directus.com/hasura-sso-bridge/health | jq .status'
```

## 🔄 Migration & Updates

### Updating the Extension

```bash
# Update via npm
npm update directus-extension-hasura-sso-bridge

# Restart Directus
npm start
```

### Breaking Changes

Check [CHANGELOG.md](CHANGELOG.md) for breaking changes between versions.

### Database Migration

No database migrations required - the extension uses existing Directus tables.

# 📊 Performance & Monitoring

### Performance Considerations

- **Session Cleanup**: Extension automatically cleans expired sessions
- **Memory Usage**: Minimal memory footprint with efficient JWT processing
- **Database Impact**: Lightweight database operations

### Monitoring Endpoints

```bash

# Health check for load balancers
GET /hasura-sso-bridge/health

# Configuration validation
GET /hasura-sso-bridge/config
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Commit with conventional commits (`git commit -m 'feat: add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow existing TypeScript patterns
- Add tests for new features
- Update documentation
- Follow conventional commit format
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# 🔗 Links

- [NPM Package](https://www.npmjs.com/package/directus-extension-hasura-sso-bridge)
- [GitHub Repository](https://github.com/yourusername/directus-extension-hasura-sso-bridge)
- [Directus Documentation](https://docs.directus.io/)
- [Hasura Documentation](https://hasura.io/docs/)
- [JWT.io](https://jwt.io/) - JWT token debugging
- [Extension Development Guide](https://docs.directus.io/extensions/)

## 💬 Support

- 🐛 [Report bugs](https://github.com/yourusername/directus-extension-hasura-sso-bridge/issues)
- 💡 [Request features](https://github.com/yourusername/directus-extension-hasura-sso-bridge/issues)
- 📖 [Documentation](https://github.com/yourusername/directus-extension-hasura-sso-bridge/wiki)
- 💬 [Discussions](https://github.com/yourusername/directus-extension-hasura-sso-bridge/discussions)

## 🌟 Star History

If this extension helped you, please consider giving it a ⭐ on GitHub!

**Made with ❤️ for seamless SSO integration between Hasura and Directus**
