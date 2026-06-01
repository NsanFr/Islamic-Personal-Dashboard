***Focus Space - Minimalist Personal Dashboard***

Focus Space adalah sebuah personal dashboard berbasis web yang dirancang dengan pendekatan minimalis, estetik, dan fungsional. Berbeda dengan dashboard statis biasa, proyek ini sepenuhnya editable (dapat disesuaikan oleh pengguna secara langsung) dan dilengkapi dengan fitur produktivitas harian serta integrasi spiritual berupa Jadwal Sholat otomatis dan Kalender Hijriyah.

Proyek ini dibangun untuk menciptakan ruang digital yang tenang (focus mode) guna meningkatkan produktivitas harian tanpa distraksi.

*Fitur Utama:*

* Modular & Editable Dashboard: Pengguna dapat menyesuaikan konten, catatan, atau komponen di dalam dashboard secara dinamis sesuai kebutuhan alur kerja mereka.
* Jadwal Sholat Otomatis: Menampilkan waktu ibadah secara real-time dan akurat berdasarkan lokasi pengguna saat ini (menggunakan integrasi API eksternal).
* Dual Kalender (Masehi & Hijriyah): Sinkronisasi kalender konvensional dengan kalender Hijriyah untuk mempermudah pemantauan tanggal-tanggal penting atau puasa sunnah.
* Focus Mode Dashboard: Tampilan jam digital, kalender, dan task list yang bersih, membantu pengguna untuk tetap berada di mode produktif (deep work).
* Estetika Minimalis: Antarmuka modern yang nyaman di mata, mendukung fokus jangka panjang tanpa kelelahan visual.

*Teknologi yang Digunakan:*
Proyek ini dibangun murni menggunakan ekosistem Front-End web development modern untuk memastikan performa yang cepat dan ringan:

* HTML5 – Sebagai kerangka struktural utama halaman dashboard.
* Tailwind CSS – Untuk sistem penataan gaya (styling) yang responsif, modern, dan berbasis utility classes.
* JavaScript (ES6+) – Sebagai otak di balik fitur dinamis (manipulasi DOM, state management untuk komponen editable, kalkulasi waktu, dan fetch data jadwal sholat).
* Al-Quran/Kemenag Prayer API – Untuk penarikan data jadwal sholat secara real-time.

Kamu bisa menjalankan proyek ini di perangkat lokal kamu dengan sangat mudah tanpa perlu proses instalasi yang rumit:

1. Kloning Repositori
Buka terminal kamu dan jalankan perintah berikut untuk mengunduh kode:
git clone [https://github.com/username-kamu/nama-repo-kamu.git](https://www.google.com/search?q=https://github.com/username-kamu/nama-repo-kamu.git)
2. Masuk ke Direktori Proyek
cd nama-repo-kamu
3. Jalankan Aplikasi

* Cara Langsung: Cukup klik ganda (double-click) pada file index.html untuk membukanya di browser pilihanmu (Chrome, Edge, Firefox, dll).
* Lewat VS Code (Direkomendasikan): Buka proyek di VS Code, lalu gunakan ekstensi Live Server (klik kanan pada index.html -> pilih Open with Live Server) agar fitur auto-reload berjalan saat kamu memodifikasi kode.

*Struktur Folder:*

├── index.html     # Struktur halaman utama dashboard
├── styles.css     # Konfigurasi Tailwind & custom stylesheet
└── app.js         # Logika fitur (jam, jadwal sholat, kalender, editable state)

*Rencana Pengembangan (Roadmap):*
[ ] Integrasi dengan Local Storage agar data yang di-edit pengguna tidak hilang saat halaman di-refresh.
[ ] Fitur Dark Mode / Light Mode toggle yang lebih dinamis.
[ ] Sinkronisasi dengan Google To-Do List atau Notion API.