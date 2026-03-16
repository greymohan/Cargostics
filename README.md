# Cargostics - AI-Powered Logistics Dashboard

Cargostics is a modern, AI-powered logistics dashboard designed for the Australian market. This project focuses on providing a premium frontend experience for fleet management, route optimization, and operational insights.

## Features

- **Fleet Management**: Track vehicles, health scores, and maintenance schedules.
- **Driver Dispatch**: Manage driver profiles and route assignments.
- **AI-Powered Insights**: AI Route Optimization and Cost Analysis.
- **Australian Localization**: Pre-configured with Australian cities, license classes (HR), and business formats (ABN/ACN).
- **Modern UI**: Built with Next.js, Tailwind CSS, Framer Motion, and Lucide Icons.

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Components**: Radix UI / Shadcn UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts / Chart.js / Plotly.js

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Run the development server**:
   ```bash
   pnpm dev
   ```

3. **Build for production**:
   ```bash
   pnpm build
   ```

## Deployment

This project is ready for deployment via Dokploy or other VPS solutions. It is configured to run as a standard Next.js application.

## Evaluation Note

This version is intended for **frontend design evaluation**. All data is currently served via mock APIs (`lib/fake-api.ts`) using localized Australian data.
