# Instagram AI Video Automation

An automated tool to generate AI-powered videos and post them directly to your Instagram account.

## Features

- **AI Video Generation**: Create videos using AI models (Stable Video Diffusion)
- **Instagram Auto-Post**: Automatically post generated videos to your Instagram account
- **Post Scheduling**: Schedule posts for future dates and times
- **Multiple Video Styles**: Choose from cinematic, anime, 3D, realistic, and abstract styles
- **Custom Captions**: Add captions to your Instagram posts

## Setup

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file with your credentials:
```env
INSTAGRAM_USERNAME=your_username
INSTAGRAM_PASSWORD=your_password
REPLICATE_API_TOKEN=your_replicate_api_key
```

3. Get a Replicate API token from [replicate.com](https://replicate.com)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

### Generate & Post Video

1. Connect your Instagram account
2. Enter a video prompt describing what you want to create
3. Select video style and duration
4. Add an Instagram caption (optional)
5. Click "Generate Video" or "Generate & Auto-Post"

### Schedule Posts

1. Go to the "Schedule Posts" tab
2. Enter video prompt and caption
3. Select a future date and time
4. Click "Schedule Post"

## Important Notes

- Instagram may require manual verification for new logins
- Two-factor authentication (2FA) must be disabled for automation
- Keep your credentials secure and never commit them to git
- Replicate API charges per generation

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Replicate AI (Stable Video Diffusion)
- Instagram Private API

## Deployment

Deploy to Vercel:
```bash
vercel deploy --prod
```

Add environment variables in Vercel dashboard.
