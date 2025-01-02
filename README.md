# Even Invoicer

# 🚀 [Live Demo](https://even-invoicer.vercel.app/)

A CSV-based invoice generation application built for the Eveneer Senior Software Engineer application project. This application allows users to generate professional invoices from CSV time reports with a modern, user-friendly interface.

## Features

- 📊 CSV Time Report Processing
  - Upload and parse CSV time reports
  - Automatic line item generation
- 📝 Invoice Management
  - Edit billing client details
  - Customize invoice numbers
  - Set invoice and due dates
  - Configure default rates
- ⏱️ Line Item Management
  - View and edit all time entries
  - Modify individual line items
- 📄 PDF Export
  - Generate professional PDF invoices
  - Clean, watermark-free output
- 🎨 Modern and Responsive UI

## Tech Stack

- [SvelteKit](https://kit.svelte.dev/) - Web application framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [html2canvas](https://html2canvas.hertzen.com/) & [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/) - PDF generation
- [Zod](https://zod.dev/) - Schema validation

## Prerequisites

- Bun (latest version)
- Node.js (v20 or higher recommended)

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/[your-username]/even-invoicer.git
cd even-invoicer
```

2. Install dependencies:

```bash
# Using Bun (recommended)
bun install

# Alternative: Using npm
npm install
```

3. Start the development server:

```bash
# Using Bun
bun dev

# Alternative: Using npm
npm run dev
```

The application will be available at `http://localhost:5173`

## CSV Format Requirements

The application expects time report CSV files

## Building for Production

```bash
# Using Bun
bun run build

# Alternative: Using npm
npm run build
```

## Available Scripts

- `dev` - Start development server
- `build` - Create production build
- `preview` - Preview production build
- `check` - Run type checking
- `format` - Format code using Prettier
- `lint` - Run linting checks


