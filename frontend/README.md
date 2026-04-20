# ✨ Daily Mood | Interactive Mindfulness & Emotion Tracker

### 📊 1. Project Overview
| Category | Details |
| :--- | :--- |
| **Project Name** | Daily Mood |
| **Type** | Premium Interactive SaaS / Web Application |
| **Core Concept** | Moving away from static charts by using a **2D Physics Engine** to represent emotions as physical entities, creating a tactile "Mental Health Journal". |
| **Design Language** | Spatial UI, Glassmorphism, Mesh Gradients |

---

### 🚀 2. Key Features
| Feature | Description | Interaction / Tech |
| :--- | :--- | :--- |
| **🫙 The Mood Jar** | Dynamic representation of moods as physical spheres with custom mass, friction, and restitution. | Drag, toss, and interact using **Matter.js**. Includes collision audio feedback. |
| **🎨 Spatial UI** | VisionOS/macOS inspired interface featuring high-translucency layers and soft shadows. | Built with **Tailwind CSS** (`backdrop-blur`). Ambient mesh gradient backgrounds. |
| **📅 History Heatmap** | Smart calendar grid that calculates and visualizes the "Dominant Mood" for each day. | Click to inspect details, read notes, and filter by specific mood types. |
| **🧭 Floating Navbar** | A centralized "Pill-style" navigation bar that adapts seamlessly to all viewports. | Responsive micro-interactions and active-route highlighting. |
| **⚡ Real-time CRUD** | Full lifecycle management of emotional entries (Create, Read, Delete). | Instant synchronization between the physics engine, UI, and SQL Database. |

---

### 🛠️ 3. Technical Stack
| Domain | Technology | Purpose in Project |
| :--- | :--- | :--- |
| **Framework** | **React 18** | Functional components and high-performance state management (`useRef` for physics sync). |
| **Styling** | **Tailwind CSS** | Utility-first styling, custom animations, and complex CSS filters for glassmorphism. |
| **Physics** | **Matter.js** | 2D rigid body physics engine for the interactive jar simulation. |
| **Routing** | **React Router 6** | Managing stateful navigation between Welcome, Jar, and History views. |
| **Backend Integr.** | **Fetch API / REST** | Asynchronous communication with the C# / .NET Core backend & SQL Server. |

---

### 📦 4. Installation & Setup Guide
| Step | Action | Command / Code |
| :--- | :--- | :--- |
| **1. Prerequisites** | Ensure Node.js (v16+) is installed. | `node -v` |
| **2. Clone Repo** | Clone the project locally. | `git clone https://github.com/your-username/daily-mood.git` |
| **3. Access Folder** | Navigate into the directory. | `cd daily-mood` |
| **4. Install Deps** | Install required NPM packages. | `npm install` |
| **5. Config Env** | Create `.env` file in the root directory for API. | `VITE_API_URL=https://localhost:7000/api/MoodEntries` |
| **6. Run Local** | Launch the Vite development server. | `npm run dev` |

---

### 📐 5. Project Architecture
| Path / File | Component Role | Description |
| :--- | :--- | :--- |
| `/src/App.tsx` | **Global Root** | Handles global layout, Mesh Gradients background, and Router configuration. |
| `/src/main.tsx` | **Entry Point** | React DOM initialization. |
| `/src/index.css` | **Styles** | Global typography, Tailwind imports, and custom scrollbar overrides. |
| `/src/pages/Welcome.tsx`| **Landing Page** | Modern entry screen with shine effects and contextual onboarding. |
| `/src/pages/History.tsx`| **Analytics View**| Advanced calendar, filtering logic, and entry inspection modals. |
| `/src/components/MoodJar.tsx` | **Core Feature** | The physics engine integration, mood selector, and POST/DELETE logic. |
| `/src/components/Navbar.tsx` | **Navigation** | Floating glassmorphism menu. |

---

### 🛣️ 6. Roadmap & Future Improvements
| Status | Feature | Description |
| :---: | :--- | :--- |
| ⏳ | **JWT Authentication** | Secure user accounts to keep journals private and separated per user. |
| ⏳ | **AI Sentiment Analysis** | Backend analysis of daily notes to provide deeper psychological insights. |
| ⏳ | **PWA Integration** | Enable "Add to Home Screen" capabilities for a native mobile application feel. |
| ⏳ | **Global Export** | Ability to download monthly emotional reports in PDF/Excel format. |

---
<div align="center">
  <p><i>Developed with passion for better mental health awareness. 💜</i></p>
</div>