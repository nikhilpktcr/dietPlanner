# 🏗️ Node.js + TypeScript Boilerplate

A clean, scalable backend boilerplate using **Express**, **TypeScript**, and the **MVC architecture** with **Singleton service pattern**.

---

## 📁 Project Structure

```
src/
├── modules/
│   └── users/
│       ├── controller.ts     # Handles HTTP requests
│       ├── service.ts        # Singleton service - business logic
│       ├── message.ts        # Constants/messages
├── routes/
│   ├── index.ts              # Main API router
│   └── user.ts               # /users routes
├── middlewares/             # (Optional) Error or auth middleware
├── app.ts                   # Express app setup
├── server.ts                # Server entry point
```

---

## ✨ Features

- ✅ **Express + TypeScript**
- ✅ **MVC architecture**
- ✅ **Singleton services** for logic reuse
- ✅ **Modular routing** by feature
- ✅ **Clean separation of concerns**
- ✅ Easy to test, extend, and scale

---

## 🧠 Architectural Patterns

| Pattern/Concept               | Description                                              |
| ----------------------------- | -------------------------------------------------------- |
| **MVC**                       | Separates logic into Controller, Service (Model), Routes |
| **Singleton Service Pattern** | Ensures a single reusable instance for business logic    |
| **Modular Design**            | Each feature (like `users`) is self-contained            |
| **Separation of Concerns**    | `app.ts` initializes app, `server.ts` starts the server  |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start in dev mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📦 Scripts

```json
"scripts": {
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

---

## 🔧 Tech Stack

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [ts-node](https://github.com/wclr/ts-node-dev)

---

## 🧪 Coming Soon

- ✅ MongoDB or PostgreSQL integration
- ✅ Unit testing with Jest/Vitest
- ✅ Swagger/OpenAPI docs

---

## 🔢 API Versioning

This boilerplate follows **URL-based API versioning** for clarity and backward compatibility.

### 📌 Example:

| Method | Endpoint            | Description    |
| ------ | ------------------- | -------------- |
| `POST` | `/api/v1/users`     | Create a user  |
| `GET`  | `/api/v1/users/:id` | Get user by ID |

### ✅ Why Use Versioning?

- Supports **backward compatibility**
- Enables **safe evolution** of APIs
- Follows **industry best practices**

### 💡 How to Change Version

In `app.ts`:

```ts
app.use("/api/v1", routes); // Change 'v1' to 'v2' when needed
```

---

## 💡 Notes

- This boilerplate is structured for REST APIs.
- The `service.ts` files use the Singleton pattern to maintain a single instance across the app lifecycle.
- Designed with scalability and testing in mind.
