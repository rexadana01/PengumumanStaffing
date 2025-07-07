# Strategy Above The Depths - Ludo Quiz Game

## Deskripsi Proyek

**Strategy Above The Depths** adalah sebuah aplikasi web permainan papan berbasis Ludo yang terintegrasi dengan kuis. Permainan ini dirancang untuk dimainkan oleh 4 tim (Merah, Biru, Kuning, Hijau) dan dipandu oleh seorang operator. Aplikasi ini menyediakan _interface_ visual untuk papan permainan, pergerakan bidak, skor, dan validasi jawaban, sementara soal kuis dibacakan secara manual oleh juri/operator.

Proyek ini dibuat menggunakan HTML, CSS, dan JavaScript murni (vanilla JS), tanpa memerlukan _framework_ atau _library_ eksternal, sehingga sangat ringan dan mudah dijalankan.

## Fitur Utama

- **Papan Ludo Interaktif:** Papan permainan 15x15 yang digambar secara dinamis dengan jalur spesifik untuk 4 tim.
- **Gameplay 4 Tim:** Mendukung permainan untuk tim Merah, Biru, Kuning, dan Hijau.
- **Sistem Giliran Otomatis:** Giliran permainan berpindah secara otomatis antar tim.
- **Kuis dengan Tingkat Kesulitan:** Tim dapat memilih soal kategori Mudah, Sedang, atau Sulit, yang memberikan poin dan jumlah langkah berbeda.
- **Mekanisme Rebutan (Steal):** Jika sebuah tim salah menjawab, tim lain memiliki kesempatan terbatas untuk merebut soal.
- **Petak Spesial:** Terdapat petak "Special Zone" yang memberikan soal bonus dan petak "Checkpoint" sebagai tujuan akhir.
- **Deteksi Tabrakan:** Bidak yang ditabrak di petak biasa akan kembali ke _basecamp_.
- **Sistem Skor:** Papan skor otomatis yang mencatat perolehan poin setiap tim.
- **Animasi Menarik:** Gerakan bidak, efek _highlight_ pada jalur, dan animasi perayaan untuk memperkaya pengalaman visual.
- **Desain Responsif:** Tampilan game dapat beradaptasi dengan baik di berbagai ukuran layar, dari desktop hingga mobile.

## Cara Menjalankan Proyek

Proyek ini tidak memerlukan instalasi atau proses _build_. Cukup ikuti langkah-langkah berikut:

1.  **Clone atau Unduh Repositori**

    ```bash
    git clone [https://github.com/RioSudrajat/Strategy-Above-The-Depths-Ludo.git](https://github.com/RioSudrajat/Strategy-Above-The-Depths-Ludo.git)
    ```

    Atau unduh file ZIP dan ekstrak.

2.  **Buka File `index.html`**
    Navigasikan ke direktori proyek dan buka file `index.html` menggunakan browser web modern (seperti Google Chrome, Firefox, atau Microsoft Edge).

3.  **Selesai!**
    Permainan siap untuk dimainkan. Operator dapat mulai mengelola permainan dari _interface_ yang ditampilkan.

## Struktur File

```
.
├── index.html      # Struktur utama dan layout halaman web
├── styles.css      # Semua styling untuk komponen visual dan papan permainan
└── script.js       # Seluruh logika permainan, status, dan manipulasi DOM
```

- **`index.html`**: Berisi kerangka HTML dari semua elemen yang terlihat, seperti papan skor, panel kontrol, papan permainan, dan modal.
- **`styles.css`**: Bertanggung jawab atas seluruh aspek visual, termasuk warna tim, layout, animasi, dan desain responsif.
- **`script.js`**: Merupakan otak dari permainan. Ditulis dalam satu kelas `LudoGame`, file ini mengelola semua status (skor, posisi, giliran), logika (pergerakan, rebutan, validasi), dan interaksi dengan antarmuka pengguna (event listener).

## Aturan Singkat Permainan

1.  Operator menekan **Mulai Permainan**.
2.  Tim yang mendapat giliran memilih **tingkat kesulitan soal**.
3.  Juri membacakan soal, dan tim menjawab.
4.  Operator memvalidasi jawaban (BENAR/SALAH).
    - **Benar:** Tim mendapat poin dan bidak maju. Giliran berlanjut.
    - **Salah:** Tim lain bisa **merebut soal** dalam 5 detik.
5.  Tujuan: Menjadi tim pertama yang mencapai petak **Checkpoint** atau memiliki skor tertinggi setelah 20 soal.
