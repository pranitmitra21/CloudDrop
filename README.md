# CloudDrop ⚡
**Secure, Instant, & Temporary File Sharing.**  
🔴 **Live Demo:** [clouddrop-secure.netlify.app](https://clouddrop-secure.netlify.app/)

CloudDrop is a modern file-sharing application designed for speed and privacy. Upload a file, get a secure link, and share it. The link expires automatically in 10 minutes, and the file effectively self-destructs.

![CloudDrop Preview](https://via.placeholder.com/800x400?text=CloudDrop+Preview)
*(You can replace this with a screenshot of your app)*

## ✨ Features

-   **🚀 Instant Uploads:** Drag & drop interface powered by Supabase Storage.
-   **🔒 Secure Links:** Generated links are "Signed URLs" that are only valid for **10 minutes**.
-   **👻 Auto-Cleanup:** Files can be automatically deleted from the database after 10 minutes (using `pg_cron`).
-   **📱 Fully Responsive:** Works perfectly on desktops, tablets, and mobile phones.
-   **⚡ Serverless:** Built with vanilla HTML/CSS/JS and Supabase (no backend server required).

## 🛠️ Tech Stack

-   **Frontend:** HTML5, CSS3 (Glassmorphism UI), JavaScript (Vanilla).
-   **Backend/Storage:** [Supabase](https://supabase.com/) (PostgreSQL + Object Storage).
-   **Hosting:** Netlify / Vercel (Static hosting).

## 🚀 How to Run Locally

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/pranitmitra21/CloudDrop.git
    cd CloudDrop
    ```

2.  **Open `index.html`:**
    Simply open the `index.html` file in your browser!

    *Note: To make uploads work, you need to provide your own Supabase configuration.*

3.  **Configure Supabase:**
    *   Open `script.js`.
    *   Replace `SUPABASE_URL` and `SUPABASE_KEY` with your own project credentials.
    *   Follow `SUPABASE_SETUP.md` to create the `uploads` bucket and set security policies.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
