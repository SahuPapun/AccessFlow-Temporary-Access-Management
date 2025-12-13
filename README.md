# AccessFlow - Temporary Access Management

AccessFlow is a web application designed to manage temporary, just-in-time access to sensitive resources. It provides a clear workflow for users to request access, for approvers to grant or deny requests, and for administrators to manage users and resources.

## Features

- **User Authentication**: Secure sign-up and sign-in functionality using Firebase Authentication.
- **Role-Based Access Control (RBAC)**: Pre-configured roles (`user`, `approver`, `admin`) to manage permissions.
- **Access Request Workflow**: Users can request temporary access to resources for a specific duration.
- **Approval System**: Approvers can view and approve or reject pending requests.
- **Resource Management**: Admins can add and manage the list of available resources.
- **User Management**: Admins can view all users and manage their roles.
- **Real-time Updates**: The UI updates in real-time using Firestore's snapshot listeners.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database & Auth**: Firebase (Firestore, Firebase Authentication)
- **Styling**: Tailwind CSS

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or later recommended)
- A Firebase Project with **Firestore** and **Firebase Authentication** (Email/Password provider) enabled.

### 1. Clone the Repository

First, clone the repository to your local machine.

```bash
git clone <your-repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

Install the project dependencies using npm:

```bash
npm install
```

### 3. Configure Environment Variables

You will need to connect the application to your Firebase project.

1.  Rename the `.env.example` file to `.env.local`.
2.  Open your Firebase project console.
3.  Go to **Project Settings** (click the gear icon ⚙️).
4.  Under the "General" tab, scroll down to "Your apps".
5.  Click on the "Web" icon (`</>`) to create a new web app or view your existing config.
6.  Copy the values from the `firebaseConfig` object into your `.env.local` file.

Your `.env.local` file should look like this:

```
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="1:..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-..."
```

### 4. Deploy Firestore Security Rules

The security of your database depends on its security rules. You must deploy the included rules to your project.

1.  Install the Firebase CLI if you haven't already: `npm install -g firebase-tools`
2.  Log in to Firebase: `firebase login`
3.  Deploy the Firestore rules: `firebase deploy --only firestore:rules`

### 5. Run the Development Server

You can now start the application:

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

### First User is an Admin

When you sign up the very first user for the application, they will automatically be assigned the **admin** role. All subsequent users will be assigned the **user** role by default.
