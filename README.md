# 🚀 Flopfolio

Flopfolio is a platform that empowers entrepreneurs to celebrate their journey - both successes and failures - while helping others learn from their experiences. Built with Next.js and modern web technologies, Flopfolio provides a beautiful, user-friendly interface for showcasing your entrepreneurial portfolio.

## 🌟 Features

- **Project Showcase**: Document and share your ventures, from active projects to past experiences
- **Learning-Focused**: Highlight valuable lessons learned from each project
- **Modern UI**: Clean, responsive design built with Tailwind CSS
- **User Authentication**: Secure user management powered by Clerk
- **Real-time Updates**: Dynamic content loading with React
- **Mobile-Friendly**: Fully responsive design that works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS, Radix UI Components
- **Authentication**: Clerk
- **Database**: MongoDB with Mongoose
- **File Upload**: UploadThing
- **Type Safety**: TypeScript
- **Form Handling**: React Hook Form with Zod validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database
- Clerk account for authentication
- UploadThing account for file uploads

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cavdarfr/flopfolio.git
cd flopfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# MongoDB
MONGODB_URI=your_mongodb_uri

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🤝 Contributing

This is an MVP version, and we welcome contributions! If you'd like to contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Current Status

This is an MVP (Minimum Viable Product) version of Flopfolio. We're actively developing new features and improvements, including:

- Custom domain support
- Enhanced analytics
- Advanced project metrics
- Community features
- Integration with popular platforms

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with Next.js
- UI components from Radix UI
- Authentication by Clerk
- File hosting by UploadThing
- All the entrepreneurs who inspire us to build this platform

---

Made with ❤️ for entrepreneurs who understand that every setback is a setup for a comeback.
