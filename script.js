console.log("Script starting...");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");

    // Supabase Configuration
    // REPLACE THESE VALUES WITH YOUR OWN SUPABASE CONFIGURATION
    const SUPABASE_URL = 'https://hfcaxmglzagkqepnxqsz.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmY2F4bWdsemFna3FlcG54cXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2Nzk0NDAsImV4cCI6MjA4NDI1NTQ0MH0.hgxkgEzdiF_ltwyZnDX1Bo7tVBDwAK-1CUveO2FkRbk';

    // Initialize Supabase (Safely)
    let supabase;
    if (typeof window.supabase !== 'undefined') {
        // Create the client
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log("Supabase initialized");
        } catch (e) {
            console.error("Supabase init failed:", e);
            alert("Error: Supabase failed to initialize. " + e.message);
        }
    } else {
        console.error("Supabase SDK not loaded");
        alert("Error: Supabase SDK could not be loaded. Please check your internet connection.");
    }

    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const uploadStatus = document.getElementById('uploadStatus');
    const progressBar = document.getElementById('progressBar');
    const statusText = document.getElementById('statusText');
    const resultContainer = document.getElementById('resultContainer');
    const fileLinkInput = document.getElementById('fileLink');
    const copyBtn = document.getElementById('copyBtn');
    const resetBtn = document.getElementById('resetBtn');
    const fileNameDisplay = document.getElementById('fileName');

    // Drag and Drop Events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Make the entire drop zone clickable for better UX
    dropZone.addEventListener('click', () => {
        console.log("Dropzone clicked");
        fileInput.click();
    });

    // Keep specific button listener just in case (optional, but good for specific behavior if needed)
    browseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent double triggering if dropZone also has listener
        fileInput.click();
        console.log("Browse button clicked");
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            // Debugging: Confirm file selection
            console.log("File selected:", fileInput.files[0].name);
            handleFile(fileInput.files[0]);
        }
    });

    function handleFile(file) {
        if (!file) return;

        // Check if Supabase is working
        if (!supabase) {
            alert("Critical Error: Supabase SDK not loaded. Check your internet connection.");
            return;
        }

        // Show Progress UI
        dropZone.style.display = 'none';
        uploadStatus.style.display = 'block';
        fileNameDisplay.textContent = file.name;
        progressBar.style.width = '0%';
        statusText.textContent = 'Preparing upload...';

        // Check if real keys are provided
        if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_KEY === 'YOUR_SUPABASE_ANON_KEY') {
            simulateUpload(file);
        } else {
            uploadToSupabase(file);
        }
    }

    // ---------------------------------------------------------
    // REAL SUPABASE UPLOAD WITHOUT LOGIN (Using Anon Key)
    // ---------------------------------------------------------
    async function uploadToSupabase(file) {
        statusText.textContent = 'Uploading to Supabase...';

        // Create a unique file name to avoid overwrites
        const timestamp = new Date().getTime();
        const uniqueName = `${timestamp}_${file.name}`;

        try {
            // Start Simulated Progress (Since Supabase v2 fetch doesn't support generic progress events easily)
            let progress = 0;
            const progressInterval = setInterval(() => {
                if (progress < 90) {
                    progress += Math.random() * 10;
                    if (progress > 90) progress = 90;
                    progressBar.style.width = progress + '%';
                    statusText.textContent = `Uploading... ${Math.round(progress)}%`;
                }
            }, 300);

            // Upload file to 'uploads' bucket
            const { data, error } = await supabase
                .storage
                .from('uploads')
                .upload(uniqueName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            clearInterval(progressInterval);

            if (error) throw error;

            // Upload Complete
            progressBar.style.width = '100%';
            statusText.textContent = 'Uploading... 100%';

            // Generate Signed URL (Expires in 10 minutes = 600 seconds)
            // The 'download' option forces the browser to download the file with its original name
            const { data: signedData, error: signedError } = await supabase
                .storage
                .from('uploads')
                .createSignedUrl(uniqueName, 600, {
                    download: file.name
                });

            if (signedError) throw signedError;

            showResult(signedData.signedUrl);

        } catch (err) {
            console.error("Upload failed:", err);
            alert("Upload Error: " + err.message); // Show error to user
            statusText.textContent = "Upload Failed: " + err.message;
            statusText.style.color = "#ff6b6b";
            // Fallback to simulation if bucket doesn't exist
            setTimeout(() => {
                alert("Real upload failed (did you create the 'uploads' bucket?). Switching to simulation.");
                simulateUpload(file);
            }, 2000);
        }
    }

    function simulateUpload(file) {
        console.log("Running in SIMULATION mode (No real backend keys)");
        let progress = 0;
        statusText.textContent = 'Simulating Upload...';

        const interval = setInterval(() => {
            progress += 5;
            progressBar.style.width = `${progress}%`;
            statusText.textContent = `Uploading... ${progress}%`;

            if (progress >= 100) {
                clearInterval(interval);
                // Create a fake local URL for the file
                const fakeUrl = URL.createObjectURL(file);
                showResult(fakeUrl);
            }
        }, 100);
    }

    function showResult(url) {
        uploadStatus.style.display = 'none';
        resultContainer.style.display = 'flex';
        fileLinkInput.value = url;
    }

    copyBtn.addEventListener('click', () => {
        fileLinkInput.select();
        document.execCommand('copy');
        const originalIcon = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        setTimeout(() => {
            copyBtn.innerHTML = originalIcon;
        }, 2000);
    });

    resetBtn.addEventListener('click', () => {
        resultContainer.style.display = 'none';
        dropZone.style.display = 'block'; // Fixed: Was 'flex', causing layout shift
        fileInput.value = '';
        progressBar.style.width = '0%';
        statusText.textContent = 'Uploading... 0%';
        statusText.style.color = 'var(--text-muted)';
    });

});
