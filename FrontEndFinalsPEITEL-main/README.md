# MediaBudgeter Frontend

A React Native mobile app for tracking media and budgets.

## 🚀 Live Deployment

**Deployed via Expo EAS:** https://expo.dev/accounts/andredizon/projects/frontend

**Backend API:** https://backendfinalspeitel.onrender.com/api/

## 📱 How to Run the App

### **Method 1: Scan QR Code (Recommended)**

1. **Download Expo Go app**
   - iOS: https://apps.apple.com/us/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Scan the QR Code**
   - Go to: https://expo.dev/accounts/andredizon/projects/frontend
   - Find the latest update
   - Use Expo Go to scan the QR code

3. **App will load automatically!**

### **Method 2: Find in Expo Go App**

1. Open **Expo Go** app
2. Go to **"You"** tab (bottom right)
3. Find `@andredizon/frontend` in your projects
4. Tap to open

### **Method 3: Development Mode (Local)**

```bash
cd frontend
npm install
npx expo start
```

Then:
- Press `w` for web preview
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Or scan QR code with Expo Go

## ✨ Features

- ✅ User Registration
- ✅ User Login
- ✅ Add Media Items
- ✅ Edit Media Items
- ✅ Delete Media Items
- ✅ Track Budgets

## 🧪 Test Account

You can create a new account in the app, or use:
- **Username:** testuser777
- **Password:** test123456

## 🔧 Tech Stack

- **Frontend:** React Native with Expo
- **Backend:** Django REST Framework
- **Database:** PostgreSQL (production)
- **Authentication:** Token-based
- **Deployment:** Expo EAS (frontend), Render.com (backend)

## 📂 Project Structure

```
frontend/
├── screens/           # UI screens (Login, Register, Media CRUD)
├── context/          # AuthContext for auth state management
├── navigation/       # App navigation setup
├── assets/           # Images and icons
├── App.js            # Main app component
└── package.json      # Dependencies
```

## 🔗 Important Links

- **Frontend GitHub:** https://github.com/AndreDizon/FrontEndFinalsPEITEL
- **Backend GitHub:** https://github.com/AndreDizon/BackEndFinalsPEITEL
- **Backend API:** https://backendfinalspeitel.onrender.com/api/
- **Expo Dashboard:** https://expo.dev/accounts/andredizon/projects/frontend

## 👤 Team

- Andre Dizon

## 📝 API Endpoints

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/media-items/` - Get all user's media items
- `POST /api/media-items/` - Create new media item
- `PUT /api/media-items/{id}/` - Update media item
- `DELETE /api/media-items/{id}/` - Delete media item

---

**Status:** ✅ Live and Running

Last Updated: December 11, 2025
