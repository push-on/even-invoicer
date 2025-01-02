# Even Invoicer

<div align="center">

<div style="
  display: inline-block;
  background: #dc2626;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 10px;
">
🔒 Private Repository
</div>

<div style="
  background: #1a1a1a;
  padding: 10px 20px;
  border-radius: 8px;
  border: 2px solid #4f46e5;
  margin: 20px 0;
  display: inline-block;
  position: relative;
">

<div style="
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  animation: ping-dot 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
"></div>

### 🚀 [Live Demo](https://even-invoicer.vercel.app/)

</div>

</div>

<style>
@keyframes ping-dot {
  75%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  25% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>

A modern invoice generation application built with SvelteKit, TailwindCSS, and TypeScript. Create, manage, and export professional invoices with ease.

## Features

- 📝 Create and manage invoices
- 👥 Client management
- ⏱️ Time entry tracking
- 📊 PDF export functionality
- 📁 File history management
- 🎨 Modern and responsive UI

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm (pnpm recommended)

## Setup Instructions

1. Clone the repository:

```bash
git clone [repository-url]
cd even-invoicer
```

2. Install dependencies:

```bash
# Using npm
npm install

# Using pnpm (recommended)
pnpm install
```

## Development

To start the development server:

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
# Using npm
npm run build

# Using pnpm
pnpm build
```

To preview the production build:

```bash
# Using npm
npm run preview

# Using pnpm
pnpm preview
```

## Scripts

- `dev` - Start development server
- `build` - Create production build
- `preview` - Preview production build
- `check` - Run type checking
- `format` - Format code using Prettier
- `lint` - Run linting checks

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) - Web application framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Bits UI](https://www.bits-ui.com/) - UI Components
- [html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/) - PDF generation
- [Zod](https://zod.dev/) - Schema validation

## License

This project is private and not licensed for public use.
