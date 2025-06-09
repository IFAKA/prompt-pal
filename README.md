# PromptPal

<div align="center">
  <img src="public/icon128.png" alt="PromptPal Logo" width="128" height="128" />
  <p>A modern Chrome extension for managing and organizing AI chatbot prompts efficiently.</p>
</div>

## ✨ Features

- 📝 **Smart Prompt Management**

  - Create, edit, and delete prompts with ease
  - Rich text formatting support
  - Quick copy functionality with visual feedback
  - Usage tracking and analytics

- 🏷️ **Advanced Organization**

  - Category-based prompt organization
  - Flexible filtering system (title, content, category)
  - Smart sorting based on usage frequency
  - Instant search functionality

- 🎨 **Modern UI/UX**

  - Clean and intuitive interface
  - Smooth animations and transitions
  - Responsive hover interactions
  - Contextual action buttons
  - Automatic dark/light mode adaptation

- 🔄 **Data Management**
  - Automatic Chrome storage sync
  - Efficient state management with Zustand
  - Persistent data across sessions

## 🛠️ Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS + ShadcnUI
- **State Management:** Zustand
- **UI Components:** Radix UI
- **Animations:** CSS + Tailwind

## 📦 Installation

### For Users

1. Install from the Chrome Web Store (coming soon)
2. Click the extension icon to start using

### For Developers

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/prompt-pal.git
   cd prompt-pal
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

5. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `dist` folder

## 🗂️ Project Structure

```
src/
├── components/         # React components
│   ├── prompt/        # Prompt-related components
│   ├── theme/         # Theme provider & settings
│   └── ui/           # Reusable UI components
├── store/             # Zustand store configuration
├── types/             # TypeScript declarations
└── lib/              # Utility functions
```

## 🔧 Development

### Prerequisites

- Node.js (latest LTS)
- npm or yarn
- Chrome browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
