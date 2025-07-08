# QuirkyRoomie - Flatmate Conflict Management System

A modern web platform that helps flatmates resolve everyday conflicts through complaint logging, community voting, and gamification.
Live = https://exquisite-fenglisu-67fe55.netlify.app/login

## 🏠 Features

- **User Authentication**: JWT-based authentication for secure access
- **Complaint Management**: File, track, and resolve flatmate issue
- **Community Voting**: Upvote/downvote complaints for community resolution
- **Gamification**: Karma points and leaderboards for engagement
- **Smart Punishments**: Automated punishment suggestions for validated complaints
- **Real-time Stats**: Track complaint trends and resolution rates

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests
- **In-memory storage** (development mode)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/quirky-roomie.git
cd quirky-roomie
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

This will start both the frontend (Vite) and backend (Express) servers concurrently.

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📱 Usage

### Getting Started
1. **Register**: Create an account with your email and a flat code
2. **Join Flat**: Use the same flat code as your flatmates to join the group
3. **File Complaints**: Report issues with title, description, category, and severity
4. **Vote**: Upvote or downvote complaints to help resolve conflicts
5. **Resolve**: Mark complaints as resolved to earn karma points

### Complaint Categories
- Noise
- Cleanliness  
- Bills
- Pets
- Kitchen
- Bathroom
- Common Area
- Other

### Severity Levels
- **Mild**: Minor annoyances
- **Annoying**: Moderate issues
- **Major**: Significant problems
- **Nuclear**: Serious conflicts requiring immediate attention

## 🎮 Gamification

### Karma System
- Earn **10 karma points** for resolving complaints
- Build reputation as a helpful flatmate
- Compete on the leaderboard

### Punishments
When a complaint reaches **10+ upvotes**, the system suggests creative punishments:
- "Make chai for everyone for a week"
- "You owe everyone samosas"
- "Clean the entire kitchen for a week"
- "Buy groceries for the flat this month"

### Auto-Archive
Complaints with more downvotes than upvotes are automatically archived after 3 days.

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Complaints
- `GET /api/complaints` - Get all complaints for user's flat
- `POST /api/complaints` - File new complaint
- `POST /api/complaints/:id/vote` - Vote on complaint
- `PUT /api/complaints/:id/resolve` - Mark complaint as resolved
- `GET /api/complaints/trending` - Get trending complaints

### Users
- `GET /api/users/leaderboard` - Get karma leaderboard
- `GET /api/users/stats` - Get flat statistics
- `GET /api/users/flatmates` - Get flatmates list

## 🏗️ Project Structure

```
quirky-roomie/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── pages/             # Page components
│   └── main.tsx           # App entry point
├── server/                # Backend Express application
│   ├── middleware/        # Custom middleware
│   ├── models/           # Data models (MongoDB schemas)
│   ├── routes/           # API route handlers
│   └── index.js          # Server entry point
└── package.json          # Dependencies and scripts
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 🚀 Deploymen

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform

### Backend (Render)
1. Set environment variables:
   - `JWT_SECRET`: Your JWT secret key
   - `PORT`: Server port (usually set automatically)
2. Deploy the server 

### Database
For production, replace the in-memory storage with:
- MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Integration with smart home devices
- [ ] Advanced analytics dashboard
- [ ] Automated conflict resolution suggestions
- [ ] Integration with payment systems for bill splitting

## 👥 Team

Built as part of a MERN Stack internship project to demonstrate full-stack development skills.

---

**Happy Flatmate Living! 🏠✨**
