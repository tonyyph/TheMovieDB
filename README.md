# TheMovieDB - React Native Movie App 🎬

This is a movie browsing application built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev), using [The Movie Database (TMDb) API](https://www.themoviedb.org/documentation/api).

## Features

- 📱 Browse movies by category (Now Playing, Upcoming, Popular)
- 🔍 Search movies by title
- 📊 Sort movies (Alphabetically, By Rating, By Release Date)
- 🎥 View detailed movie information (cast, crew, overview, ratings)
- 💾 Add movies to watchlist/bookmark
- 🎨 Beautiful UI with Source Sans Pro font family
- 📱 Cross-platform (iOS, Android, Web)

## Get started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with your TMDb API credentials:

```env
EXPO_PUBLIC_TMDB_API_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_TMDB_BEARER_TOKEN=your_tmdb_bearer_token_here
```

**How to get TMDb API credentials:**

1. Go to [The Movie Database (TMDb)](https://www.themoviedb.org/)
2. Create an account or sign in
3. Go to Settings → API
4. Request an API Key
5. Copy your **API Read Access Token (v4 auth)** - this is your Bearer Token
6. Paste it in `.env.local` file

**Important Notes:**

- The `.env.local` file is gitignored for security
- Use `EXPO_PUBLIC_` prefix for all environment variables that need to be accessed in your app
- Never commit your API keys to version control

### 3. Start the app

```bash
npx expo start
```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Structure

```
TheMovieDB/
├── app/                      # Application screens (file-based routing)
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Home screen (movie list)
│   │   └── bookmark.tsx     # Watchlist/bookmark screen
│   ├── movie/
│   │   └── [id].tsx         # Movie detail screen
│   └── _layout.tsx          # Root layout with font loading
├── components/              # Reusable components
│   ├── Text.tsx            # Custom Text with Source Sans Pro fonts
│   └── ...
├── contexts/               # React Context providers
│   └── WatchlistContext.tsx # Watchlist state management
├── hooks/                  # Custom React hooks
│   ├── useMovies.ts       # Fetch movies by category
│   ├── useMovieDetails.ts # Fetch movie details
│   ├── useMovieCredits.ts # Fetch cast & crew
│   └── ...
├── constants/              # App constants
│   └── api.ts             # API endpoints and config
├── utils/                  # Utility functions
│   └── api.ts             # Axios instance with interceptors
├── types/                  # TypeScript type definitions
│   └── movie.ts           # Movie-related types
├── assets/                 # Images, fonts, and other static files
└── .env.local             # Environment variables (create this!)
```

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo Router** - File-based navigation
- **TypeScript** - Type safety
- **Axios** - HTTP client for API requests
- **AsyncStorage** - Local data persistence
- **TMDb API** - Movie database API
- **Source Sans Pro** - Custom font family

## API Integration

The app uses The Movie Database (TMDb) API v3 with the following endpoints:

- `/movie/now_playing` - Get current movies in theaters
- `/movie/upcoming` - Get upcoming movies
- `/movie/popular` - Get popular movies
- `/movie/{id}` - Get movie details
- `/movie/{id}/credits` - Get cast and crew
- `/movie/{id}/recommendations` - Get similar movies
- `/account` - Get account information

All API calls are handled through:

- Custom hooks in `hooks/` directory
- Axios instance with error interceptors in `utils/api.ts`
- Environment variables for secure configuration

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [TMDb API Documentation](https://developers.themoviedb.org/3): Complete API reference

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
