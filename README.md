# Interview Questions & Answers

A static, responsive interview Q&A website built with Next.js 14, TypeScript, and Tailwind CSS. No backend required - all data is stored in JSON files.

## Features

- **Multiple Topics**: React, TypeScript, JavaScript, Node.js, and more
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes
- **Global Search**: Search across all questions and answers
- **Topic Filtering**: Browse questions by specific topics
- **Bookmarking**: Save questions for later review (localStorage)
- **Static Export**: Deploy to any CDN or static hosting service

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Static export compatible with GitHub Pages, Vercel, Netlify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd interview-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
interview-app/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page with topic cards
│   ├── t/[topic]/page.tsx # Topic-specific questions
│   └── search/page.tsx    # Global search page
├── components/             # Reusable React components
│   ├── Accordion.tsx      # Expandable question cards
│   ├── BookmarkBtn.tsx    # Bookmark functionality
│   ├── FilterBar.tsx      # Difficulty and tag filters
│   ├── SearchInput.tsx    # Search input component
│   └── ThemeToggle.tsx    # Dark mode toggle
├── public/data/           # JSON data files
│   ├── topics.json        # Topic registry
│   ├── react.json         # React questions
│   ├── ts.json           # TypeScript questions
│   ├── js.json           # JavaScript questions
│   └── nodejs.json       # Node.js questions
├── types/                 # TypeScript interfaces
│   └── index.ts          # Shared type definitions
└── next.config.ts        # Next.js configuration
```

## Adding New Topics

1. Create a new JSON file in `public/data/`:
```json
{
  "slug": "newtopic",
  "questions": [
    {
      "id": "n1",
      "q": "Your question here",
      "a": "Your answer here",
      "difficulty": "Easy",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

2. Add the topic to `public/data/topics.json`:
```json
{ "slug": "newtopic", "name": "New Topic", "color": "purple" }
```

3. The topic will automatically appear on the landing page.

## Adding Questions

Simply add new question objects to the appropriate topic JSON file:

```json
{
  "id": "unique-id",
  "q": "What is JSX?",
  "a": "JSX is a syntax extension for JavaScript...",
  "difficulty": "Easy",
  "tags": ["jsx", "react"]
}
```

## Deployment

### Static Export (Recommended)

Build and export the static site:
```bash
npm run build
npm run export
```

The static files will be in the `out/` directory, ready for deployment to any static hosting service.

### GitHub Pages

1. Push your code to GitHub
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose your main branch and `/out` folder
5. Save and wait for deployment

### Vercel

1. Push your code to GitHub
2. Import your repository on Vercel
3. The build settings will be automatically detected
4. Deploy!

### Netlify

1. Push your code to GitHub
2. Connect your repository on Netlify
3. Set build command: `npm run build && npm run export`
4. Set publish directory: `out`
5. Deploy!

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run export` - Export static files
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Features in Detail

### Dark Mode
- Toggle button in the top-right corner
- Preference saved in localStorage
- Automatic system preference detection

### Search
- Real-time search across all questions and answers
- Case-insensitive matching
- Searches question text, answer text, and tags

### Bookmarking
- Click the star icon to bookmark questions
- Bookmarks are saved in localStorage
- Persistent across browser sessions

### Responsive Design
- Mobile-first approach
- 1 column on mobile, 2 on tablet, 3 on desktop
- Touch-friendly interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS