# Full Stack E-commerce Project 🛍️

A modern, scalable e-commerce platform built with React, TypeScript, and Node.js, demonstrating industry best practices and clean architecture.

## 🌟 Features

### Frontend
- **Modern UI/UX**: Built with React, TypeScript, and Tailwind CSS
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **State Management**: Efficient state handling with custom hooks
- **Type Safety**: Full TypeScript implementation
- **Component Architecture**: Reusable, modular components
- **Performance Optimized**: Implemented with best practices for optimal performance
- **Authentication**: Secure user authentication and authorization
- **Admin Dashboard**: Comprehensive admin interface for product and user management

### Backend
- **RESTful API**: Clean, well-documented API endpoints
- **MongoDB Integration**: Efficient data storage and retrieval
- **Security**: Implemented with best security practices
- **Error Handling**: Comprehensive error handling and logging
- **File Upload**: Secure file upload functionality
- **Caching**: Redis implementation for improved performance

## 🚀 Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Custom Hooks
- Shadcn UI Components

### Backend
- Node.js
- Express
- MongoDB
- Redis
- TypeScript
- JWT Authentication
- Socket.IO

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Redis (optional, for caching)

### Frontend Setup
```bash
cd my-ecommerce-frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd starter-template-be-main
npm install
# Create .env file based on .env.example
npm run dev
```

## 🔧 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=E-commerce
```

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
```

## 🏗️ Project Structure

```
├── my-ecommerce-frontend/          # Frontend application
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   ├── models/               # TypeScript interfaces
│   │   └── utils/                # Utility functions
│   └── public/                   # Static assets
│
└── starter-template-be-main/      # Backend application
    ├── src/
    │   ├── api/                  # API routes and controllers
    │   ├── services/             # Business logic
    │   ├── models/               # Database models
    │   └── utils/                # Utility functions
    └── config/                   # Configuration files
```

## 🎯 Best Practices Implemented

### Frontend
- **Component Organization**: Logical grouping and separation of concerns
- **Type Safety**: Comprehensive TypeScript implementation
- **Custom Hooks**: Reusable logic encapsulation
- **Error Boundaries**: Graceful error handling
- **Performance Optimization**: 
  - Code splitting
  - Lazy loading
  - Memoization
  - Debouncing
- **Accessibility**: ARIA labels and semantic HTML
- **Responsive Design**: Mobile-first approach

### Backend
- **Clean Architecture**: Separation of concerns
- **Dependency Injection**: Modular and testable code
- **Error Handling**: Comprehensive error management
- **Security**: 
  - Input validation
  - Rate limiting
  - CORS configuration
  - Secure headers
- **Logging**: Structured logging with Winston
- **Documentation**: API documentation with Swagger

## 🔄 Continuous Improvement

This project is continuously evolving with:
- Regular dependency updates
- Performance optimizations
- New feature implementations
- Security enhancements
- Code quality improvements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Author

- **Lazar Krmpot** - [GitHub](https://github.com/LazarKrmpot)

## 🙏 Acknowledgments

- Shadcn UI for the beautiful component library
- The open-source community for their invaluable tools and libraries 