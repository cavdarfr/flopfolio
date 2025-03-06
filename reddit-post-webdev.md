# [Show r/webdev] Flopfolio - A Next.js 15 + React 19 platform for entrepreneurs to showcase their journey

Hey r/webdev! I wanted to share a project I've been working on called **Flopfolio** - a platform built with Next.js 15 and React 19 that helps entrepreneurs document their entire journey, including both successes and failures.

## Tech Stack

- **Frontend**: Next.js 15 with React 19 and TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components (based on Radix UI)
- **Authentication**: Clerk for user management
- **Database**: MongoDB with Mongoose
- **File Storage**: UploadThing for image uploads
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Technical Implementation Highlights

### Performance Optimizations

I've implemented several optimizations to ensure excellent Core Web Vitals:

- **Image Optimization**: Custom image optimization script using Sharp to generate WebP and AVIF formats
- **Font Optimization**: Preloaded Google Fonts (Geist) with proper fallbacks
- **Code Splitting**: Leveraging Next.js App Router for automatic code splitting

### Custom Components

Created several reusable components including:

- `OptimizedImage`: A wrapper around Next.js Image component that handles responsive images with proper loading strategies, WebP/AVIF support, and fallbacks
- Custom form components with validation
- Status indicators with dynamic styling based on project status

### Server Components vs. Client Components

Strategically used Next.js server and client components:

- Server components for data fetching and initial rendering
- Client components for interactive elements and form handling

### Responsive Design

Implemented a fully responsive design using Tailwind CSS with custom breakpoints and a mobile-first approach.

## Challenges & Solutions

Some technical challenges I faced:

1. **Image Optimization**: Created a custom script to pre-optimize images and generate multiple formats
3. **Form Validation**: Built a robust form system with client and server validation
4. **Performance**: Optimized for Core Web Vitals through various techniques

## Looking for Technical Feedback

I'd love to get feedback from fellow web developers:

1. Any suggestions for improving the tech stack or architecture?
2. Performance optimization tips for Next.js 15 and React 19?
3. Better ways to handle image optimization?
4. Thoughts on the authentication implementation?
5. Any code quality or organization improvements?

## Links

- GitHub: [GitHub repo link]
- Live Demo: [Demo link if available]

Thanks for checking out my project! I'm open to all technical feedback and suggestions.

---

*Built with Next.js 15, React 19, and TypeScript* 