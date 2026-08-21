# LetChat

LetChat is a full-stack real-time chat application built with React, Express, MongoDB, Clerk, Socket.IO, and ImageKit. Users can authenticate with Clerk, discover other users, exchange messages in real time, see online presence, and send image or video attachments.

## Features

- Clerk authentication with protected API routes
- Real-time text messaging with Socket.IO
- Online and offline presence indicators
- Conversation list and user search
- Image and video uploads through ImageKit
- Message history stored in MongoDB
- Responsive chat interface for desktop and mobile
- Theme presets, dark mode, wallpapers, and keyboard sounds
- Dockerized production build with Express serving the frontend

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- HeroUI
- Tailwind CSS
- Zustand
- Axios
- Socket.IO Client
- Clerk React

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- Clerk Express
- Socket.IO
- ImageKit
- Multer
- Docker

## Project Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── controller/     # Authentication and message controllers
│   │   ├── lib/            # Database, Socket.IO, ImageKit, and cron setup
│   │   ├── middleware/     # Auth and media-upload middleware
│   │   ├── model/          # User and Message Mongoose models
│   │   ├── route/          # Express API routes
│   │   ├── seeds/          # Optional development seed data
│   │   └── webhook/        # Clerk webhook handler
│   └── package.json
├── frontend/
│   ├── public/             # Wallpapers and notification sounds
│   ├── src/
│   │   ├── component/      # Auth and chat UI components
│   │   ├── context/        # Theme and wallpaper state
│   │   ├── hook/           # Shared React hooks
│   │   ├── pages/          # Auth and chat pages
│   │   └── store/          # Zustand auth and chat stores
│   └── package.json
├── dockerfile
└── README.md
```

## Prerequisites

- Node.js 22 or newer
- npm
- MongoDB database, local or hosted
- Clerk application
- ImageKit account for media uploads
- Docker, optional for containerized deployment

## Local Development

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure the backend

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_signing_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
FRONT_END_URL=http://localhost:5173
NODE_ENV=development
PORT=3000
```

`FRONT_END_URL` may also be set to `http://localhost:5174` when Vite selects that port. The backend accepts both local development ports.

### 3. Configure the frontend

Create `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

The frontend uses the Vite `/api` proxy during development. The proxy forwards requests to `http://localhost:3000`.

### 4. Start the applications

Open two terminals from the repository root:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.



## Available Scripts

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the production frontend |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production frontend build |

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Nodemon |
| `npm start` | Start the API with Node.js |
| `npm run build` | Copy `src/` into `dist/` |
| `npm run db:seed` | Upsert sample users into MongoDB |

## API Overview

All application API routes are prefixed with `/api` and require Clerk authentication unless noted otherwise.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/auth/check` | Resolve the authenticated Clerk user to a MongoDB user |
| `GET` | `/api/message/users` | List users available for chat |
| `GET` | `/api/message/conversation` | List users with existing conversations |
| `GET` | `/api/message/:id` | Fetch message history with a user |
| `POST` | `/api/message/send/:id` | Send text or media to a user |
| `POST` | `/api/webhook/clerk` | Receive Clerk user lifecycle webhooks |
| `GET` | `/heath` | Backend health response |

Media uploads use the `media` multipart form field and are limited to 25 MB. Supported media types are images and videos.

## Clerk Setup

1. Create a Clerk application.
2. Add the Clerk publishable key to `frontend/.env`.
3. Add the Clerk publishable and secret keys to `backend/.env`.
4. Configure the Clerk user webhook to send user create, update, and delete events to:

   ```text
   https://your-domain.example/api/webhook/clerk
   ```

5. Add the webhook signing secret to `CLERK_WEBHOOK_SIGNING_SECRET`.

The protected-route middleware also creates or updates a MongoDB user record on demand when a valid Clerk user accesses the API.

## Docker

The Dockerfile builds the Vite frontend and packages it with the Express backend. Express serves the built frontend and API from one container.

Build the image from the repository root:

```bash
docker build \
  --build-arg VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key \
  -t letchat .
```

Run the container with the server-side environment variables:

```bash
docker run --rm -p 3001:3001 \
  -e MONGO_URI=your_mongodb_connection_string \
  -e CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key \
  -e CLERK_SECRET_KEY=your_clerk_secret_key \
  -e CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_signing_secret \
  -e IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key \
  -e FRONT_END_URL=http://localhost:3001 \
  -e NODE_ENV=production \
  letchat
```

Open `http://localhost:3001` after the container starts.

## Environment and Secrets

Never commit `.env` files, Clerk secret keys, MongoDB credentials, ImageKit private keys, or webhook signing secrets. If a secret has been exposed, revoke and rotate it in the relevant provider before deploying.

The Clerk publishable key is public by design, but it still needs to be supplied to the frontend build and Clerk configuration.

## Troubleshooting

### CORS errors during local development

Make sure the backend is running on port 3000 and open the Vite URL shown in the terminal. The backend currently allows `localhost:5173` and `localhost:5174`.

### Messages are saved but real-time delivery fails

Confirm that both users are connected to the same backend, that the backend restarted after code or environment changes, and that Socket.IO is reachable from the frontend origin.

### Media upload fails

Confirm that `IMAGEKIT_PRIVATE_KEY` is set in the backend environment, the selected file is an image or video, and its size is no more than 25 MB.

## Maintenance Notes

- The backend health route is currently named `/heath`.
- The production cron helper references a `/health` URL and `FRONTEND_URL`; align those names before relying on the production keep-alive job.
- For production, set `FRONT_END_URL` to the public origin serving the app and configure the Clerk webhook with the public HTTPS URL.

