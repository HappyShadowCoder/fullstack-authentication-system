# Full-Stack Authentication System

A robust and secure user authentication system built for modern web applications. This project provides a complete and production-ready solution for managing user accounts, including registration, secure login, password resets, and email verification. It's a great starting point for any full-stack project requiring user management.

***

### ✨ Features

- **User Registration:** Securely create new user accounts.
- **Secure Login:** Authenticate users with password hashing (`bcryptjs`) and secure tokens (`jsonwebtoken`).
- **Email Verification:** New users must verify their email with a unique, one-time-use link sent to their inbox.
- **Password Reset:** Users can securely reset their password via a one-time-use email link.
- **Protected Routes:** A protected profile page accessible only to logged-in users.
- **Responsive UI:** A clean, mobile-friendly user interface built with Tailwind CSS.

***

### 🛠️ Tech Stack

This project is built with the following technologies:

- **Frontend:** Next.js (React)
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **Styling:** Tailwind CSS
- **Email Service:** MailerSend
- **Authentication:** `bcryptjs` and `jsonwebtoken`
- **HTTP Client:** `axios`

***

### 🚀 How It Works

This is a full-stack application where the frontend and backend are seamlessly integrated within a single Next.js project.

- **Registration & Login:** The frontend forms send data to dedicated API routes (e.g., `/api/users/signup`), where the backend handles password hashing and user creation or authentication.
- **Email Verification & Password Reset:** The backend generates a secure, one-time token and stores it in the database with an expiry time. The token is then used to construct a unique URL that is sent to the user via a beautiful email template powered by **MailerSend**.
- **User Profile:** Upon successful login, the frontend stores the user's authentication token and uses it to access protected API routes, such as `/api/users/me`, to fetch and display their data.

***

### ⚙️ Getting Started

Follow these steps to set up the project on your local machine:

**1. Clone the repository**

```bash
git clone [https://github.com/HappyShadowCoder/fullstack-authentication-system.git](https://github.com/HappyShadowCoder/fullstack-authentication-system.git)
cd fullstack-authentication-system
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mzfwdts.mongodb.net/
TOKEN_SECRET=your_long_and_random_token_secret
DOMAIN=http://localhost:3000 
MAILERSEND_API_KEY=your_mailersend_api_key
MAILERSEND_FROM_EMAIL=your_verified_email@yourdomain.com
```

**4. Run the development server**

```bash
npm run dev
```
The application will be running at **http://localhost:3000.**

***

🗺️ **Future Updates**
This project is a solid foundation and can be extended with many new features, including:

**Two-Factor Authentication** (2FA)

**Social Logins** (e.g., Google, GitHub)

**User Profile Editing**

**Dashboard for user settings**

***

📜 **Version**
**v1.0.0** - Initial release with complete authentication, email verification, and password reset functionality.
