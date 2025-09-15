#  Collaborative Whiteboard (MERN + Socket.IO)

A real-time collaborative whiteboard built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and **Socket.IO** for live collaboration.  
Multiple users can join a room using a room code and draw together on a shared canvas with persistence and synchronization.

---

##  Live Demo

Try it here: [**Whiteboard Live App**](https://whiteboard-1-lfqy.onrender.com)

---

##  Features

-  **Room Management**
  - Join with a room code  
  - Auto-create new rooms if they don’t exist  

-  **Drawing Tools**
  - Freehand drawing tool  
  - Adjustable stroke width  
  - Color support (e.g., black, red, blue, green)  
  - Clear canvas option  

-  **Collaboration**
  - Live sync across all users in the same room  
  - Real-time updates for strokes  
  - Active users can see the same board instantly  

-  **Persistence**
  - Drawings are saved in MongoDB per room  
  - Replayed automatically when new users join  

---

## Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB  
- **Real-time:** Socket.IO  
- **Deployment:** Render (backend) 

---

## ⚙️ Setup Instructions

### 1. Clone the repository
 ---bash
git clone https://github.com/your-username/whiteboard.git
cd whiteboard

2. Backend Setup

cd server
npm install
npm start

Backend runs at http://localhost:5000
3. Frontend Setup

cd client
npm install
npm start

Frontend runs at http://localhost:3000
🔌 Socket.IO Events

    join-room → User joins room

    draw-start → Start drawing stroke

    draw-move → Stroke in progress

    draw-end → End stroke & save in DB

    clear-canvas → Clear whiteboard (per room)

 Database: MongoDB Atlas

Backend: Render

(currently deployed ✅)

Frontend: Render
Built with using MERN stack + Socket.IO.
Live version deployed here: https://whiteboard-1-lfqy.onrender.com

## 📂 Project Structure

