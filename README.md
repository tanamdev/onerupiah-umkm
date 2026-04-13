# Next.js Fullstack Boilerplate

A production-ready Next.js boilerplate with TypeScript, React Query, Axios, Zod validation, and a clean, organized structure.

## Features

- ✅ **TypeScript** - Full type safety across the entire application
- ✅ **React Query** - Powerful data fetching and caching
- ✅ **Axios** - HTTP client with interceptors
- ✅ **Zod** - Runtime validation and type inference
- ✅ **Tailwind CSS** - Utility-first CSS framework
- ✅ **Organized Structure** - Clean and scalable folder organization
- ✅ **API Routes** - RESTful API with validation
- ✅ **Custom Hooks** - Reusable data fetching hooks
- ✅ **Environment Variables** - Proper configuration management
- ✅ **Component Library** - Reusable UI components

## Getting Started

1. **Clone and install dependencies:**

   ```bash
   git clone <your-repo-url>
   cd boilerplate-nextjs
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   │   ├── users/         # User endpoints
│   │   ├── posts/         # Post endpoints
│   │   └── auth/          # Authentication endpoints
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── hooks/                # Custom React Query hooks
├── lib/                  # Utilities and configurations
│   ├── api/              # API client and configuration
│   ├── utils/            # Utility functions
│   └── validations/      # Zod schemas
├── providers/            # React providers
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

## API Structure

### Users API

- `GET /api/users` - Get paginated users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get a specific user
- `PUT /api/users/[id]` - Update a user
- `DELETE /api/users/[id]` - Delete a user

### Posts API

- `GET /api/posts` - Get paginated posts
- `POST /api/posts` - Create a new post

## Usage Examples

### Using Custom Hooks

```tsx
import { useUsers, useCreateUser } from '@/hooks';

function UserComponent() {
  const { data: users, isLoading } = useUsers({ page: 1, limit: 10 });
  const createUserMutation = useCreateUser();

  const handleCreateUser = async (userData) => {
    await createUserMutation.mutateAsync(userData);
  };

  // ... component JSX
}
```

### Using API Client

```tsx
import { apiClient } from '@/lib/api/client';
import { userSchema } from '@/lib/validations/schemas';

const user = await apiClient.get('/users/1', userSchema);
```

### Validation with Zod

```tsx
import { z } from 'zod';
import { createUserSchema } from '@/lib/validations/schemas';

const userData = {
  name: 'John Doe',
  email: 'john@example.com',
};

const validatedUser = createUserSchema.parse(userData);
```

## Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Database (if needed)
# DATABASE_URL=""

# Authentication (if needed)
# NEXTAUTH_SECRET=""
# NEXTAUTH_URL="http://localhost:3000"
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **React Query (TanStack Query)** - Data fetching and state management
- **Axios** - HTTP client
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
