# Secure Cloud Storage Frontend

A modern React-based web interface for securely storing and managing encrypted files.

## Features

- **User Authentication**: Secure login and registration
- **File Management**: Upload, download, and delete files
- **File Annotations**: Add notes to each file
- **Drag & Drop Upload**: Easy file upload with validation
- **Responsive Design**: Works on desktop and mobile
- **Security**: Client-side validation and secure API communication

## Getting Started

### Prerequisites

- Node.js 14+
- npm or yarn

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment**

Create `.env` file (or verify existing):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Start development server**

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/         # Reusable React components
│   ├── FileList.js
│   ├── FileNoteModal.js
│   ├── FileUpload.js
│   ├── Navigation.js
│   └── ProtectedRoute.js
├── context/           # React Context (state management)
│   └── AuthContext.js
├── pages/             # Page components (full pages)
│   ├── DashboardPage.js
│   ├── LoginPage.js
│   └── RegisterPage.js
├── services/          # API client
│   └── api.js
├── styles/            # Stylesheets
│   └── index.css
├── App.js            # Main App component
├── index.js          # Entry point
└── utils/            # Utility functions
```

## 🔐 Security Features

- **Authentication State Management**: Uses React Context for secure token handling
- **Protected Routes**: Routes protected with authentication check
- **Input Validation**: Client-side validation before sending to server
- **Secure Cookies**: Tokens stored in HttpOnly cookies (server-set)
- **Password Strength**: Real-time password requirement display

## 🎨 UI Components

### Authentication Pages

- **Login Page**: Email and password form with error handling
- **Register Page**: Registration with password strength indicator

### Dashboard

- **File Upload**: Drag-and-drop zone with file validation
- **File List**: Table of uploaded files with actions
- **File Note Modal**: Modal for adding annotations to files

## 📝 Available Scripts

### Development

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm build
```

Builds the app for production to the `build` folder.

### Testing

```bash
npm test
```

Launches the test runner.

## 🔗 API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`.

### Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user

### File Endpoints

- `POST /files/upload` - Upload file
- `GET /files` - Get all user files
- `GET /files/:id` - Get file metadata
- `GET /files/:id/download` - Download file
- `DELETE /files/:id` - Delete file
- `POST /files/:id/notes` - Update file note
- `GET /files/:id/notes` - Get file note

## 🧪 Testing

### Example Login

```
Email: demo@example.com
Password: DemoPass123!
```

### Example File Upload

1. Login to dashboard
2. Drag a file into the upload zone or click to browse
3. Supported types: JPEG, PNG, GIF, PDF, TXT, ZIP
4. Max file size: 50MB

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Serve Production Build

```bash
npm install -g serve
serve -s build
```

Visit `http://localhost:3000`

### Docker Deployment

```bash
docker build -t cloud-storage-frontend .
docker run -p 3000:3000 cloud-storage-frontend
```

## 📦 Dependencies

- **react**: UI library
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **lucide-react**: Icon library

## 🛠️ Development Notes

### Adding New Features

1. Create components in `src/components/`
2. Create pages in `src/pages/`
3. Add API methods to `src/services/api.js`
4. Update routing in `src/App.js`

### State Management

- Uses React Context for authentication state
- Local state for component-specific data
- Consider Redux for larger applications

### Styling

- CSS in `src/styles/index.css`
- Inline styles for dynamic/component-specific styles
- CSS variables for theming

## ⚖️ License

MIT

## 🤝 Support

For issues, check the backend logs and API response messages.

## 🔒 Security Checklist

- [ ] Change API_URL for production
- [ ] Enable HTTPS on production
- [ ] Test authentication flow
- [ ] Verify file upload validation
- [ ] Check password requirements display
- [ ] Test with various file types
- [ ] Verify file download/encryption
