# ♟️ ChessVerse — Chess.com Inspired Frontend Clone

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  <img src="https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white"/>
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white"/>
</p>

<p align="center">
  <strong>A modern Chess.com-inspired frontend experience built using HTML, CSS, JavaScript, jQuery, and Bootstrap 5.</strong>
</p>

---

## 📖 Overview

ChessVerse is a frontend-only web application designed to recreate the look and feel of Chess.com while showcasing modern web development skills.

The project demonstrates responsive UI design, interactive JavaScript functionality, DOM manipulation with jQuery, Bootstrap-based layouts, and a custom-built chess engine.

This project was developed as an academic frontend development submission and does not use any backend server or database.

---

## ✨ Key Features

### ♟️ Chess Gameplay

* Complete chessboard implementation
* Legal move generation for all pieces
* Castling support
* En passant support
* Pawn promotion system
* Check detection
* Checkmate detection
* Stalemate detection
* Move history tracking
* Captured pieces display
* Player timers

### 🤖 Bot Opponent

* Play against a simple JavaScript-based bot
* Random and heuristic move selection
* No external chess engines used

### 🧩 Chess Puzzles

* Tactical puzzle challenges
* Correct/incorrect move validation
* JSON-based puzzle storage

### 🎨 User Interface

* Chess.com-inspired design
* Animated homepage hero chessboard
* Sidebar navigation with flyout menus
* Responsive layouts
* Smooth animations and transitions
* Light/Dark mode toggle
* Mobile-friendly design

### 👤 Simulated User System

* Login and registration UI
* Form validation using jQuery
* LocalStorage-based user persistence
* Profile dashboard
* Dummy statistics display

### 🏆 Leaderboard

* Search functionality
* Sorting capabilities
* Local JSON data source
* Dynamic table rendering

---

## 🛠️ Technologies Used

| Technology   | Purpose                       |
| ------------ | ----------------------------- |
| HTML5        | Structure & Semantics         |
| CSS3         | Styling & Responsive Design   |
| Bootstrap 5  | Layout & Components           |
| JavaScript   | Chess Logic & Interactivity   |
| jQuery       | DOM Manipulation & Validation |
| LocalStorage | Client-side Persistence       |
| JSON         | Static Data Storage           |

---

## 📂 Project Structure

```text
ChessVerse/
│
├── index.html
├── play.html
├── game.html
├── puzzles.html
├── login.html
├── profile.html
├── leaderboard.html
│
├── css/
├── js/
├── data/
├── assets/
│
└── README.md
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ChessVerse.git
cd ChessVerse
```

### Run Locally

Using Python:

```bash
python -m http.server 5500
```

Open:

```text
http://localhost:5500
```

Or launch directly using the VS Code Live Server extension.

---

## 📱 Responsive Design

Tested on:

| Device  | Width   |
| ------- | ------- |
| Mobile  | 375px   |
| Tablet  | 768px   |
| Desktop | 1440px+ |

The chessboard maintains a square aspect ratio and adapts smoothly across screen sizes.

---

## 🎓 Academic Objective

This project was developed to demonstrate:

* Frontend web development skills
* Responsive design principles
* UI/UX design understanding
* JavaScript programming
* jQuery integration
* Bootstrap implementation
* Project organization and documentation

---

## ⚠️ Project Limitations

This is a frontend-only project.

The following features are intentionally simulated:

* User Authentication
* Online Multiplayer
* Database Storage
* Matchmaking
* Real-time Communication

User information is stored only in the browser using LocalStorage.

Do not enter real passwords or sensitive information.

---

## 📸 Screenshots

Add screenshots inside:

```text
assets/screenshots/
```

Example:

```markdown


## 📸 Project Screenshots

### Homepage

![Homepage](assets/images/Screenshot%202026-06-22%20110458.png)

### Chess Board

![Chess Board](assets/images/Screenshot%202026-06-22%20110709.png)

### Leaderboard

![Leaderboard](assets/images/Screenshot%202026-06-22%20110750.png)

---

## 🔮 Future Improvements

* Stockfish Integration
* Real Multiplayer using WebSockets
* User Accounts & Authentication
* Cloud Database Support
* Match History Tracking
* Rating System (ELO)
* Friend System
* Real-Time Chat

---

## 🙏 Acknowledgements

* Inspired by Chess.com for educational purposes
* Bootstrap 5
* jQuery
* Open-source chess resources and references

This project is not affiliated with, endorsed by, or associated with Chess.com.

---

## 👨‍💻 Author

**Avinash Singh**

Computer Engineering Student

GitHub: https://github.com/avinashsingh539

---

## 📄 License

This project is released for educational and academic purposes.

Feel free to learn from the code and use it as a reference while respecting attribution to the original author.
