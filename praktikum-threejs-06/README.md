| | |
|---|---|
| **Nama** | Kadek Andra Wikanjaya Putra |
| **NRP** | 5025241187 |
| **Mata kuliah** | EF234504 — Grafika Komputer |
| **Praktikum** | Pertemuan 9 — Introduction to Three.js |
| **Judul** | Mini 3D Scene dengan Three.js |

---

# Deskripsi Scene
Aplikasi ini merupakan implementasi mini 3D scene menggunakan Three.js dan Vite sebagai abstraksi grafika di atas WebGL. Scene menampilkan:
- Latar belakang berwarna gelap (`#0b1020`).
- Dua mode kamera: Perspective Camera (default) dan Orthographic Camera yang dapat ditukar secara interaktif dengan tombol keyboard **`P`**.
- Bidang tanah horizontal (ground) sebagai acuan spasial dan penerima bayangan (*shadow receiver*).
- Objek kubus utama dengan material Lambertian diffuse di atas lantai yang melempar dan menerima bayangan.
- Objek bola dengan material Blinn-Phong yang memiliki highlight kilau specular serta animasi pantulan vertikal sinusoidal.
- Objek tambahan (Torus dengan MeshPhongMaterial dan Cone dengan MeshNormalMaterial) untuk memperkaya geometri dan variasi material di dalam scene.
- Sistem pencahayaan ganda (AmbientLight dan DirectionalLight) dengan bayangan real-time (*shadow mapping*).
- Sumber DirectionalLight yang bergerak melingkari scene (animasi orbit) disertai penanda visual bola kecil berwarna kuning.
- HUD (Heads-Up Display) informatif yang memantau jenis kamera aktif, koordinat kamera, jumlah objek di scene, jumlah segitiga yang dirender, dan real-time FPS counter.

# Daftar Geometry
1. **BoxGeometry (1, 1, 1)**: Geometri kubus utama untuk demonstrasi transformasi translasi, rotasi, dan skala.
2. **SphereGeometry (0.7, 32, 16)**: Geometri bola halus dengan animasi pantulan (*bouncing*).
3. **PlaneGeometry (12, 12)**: Geometri bidang datar yang dirotasi horizontal `-Math.PI / 2` pada sumbu X sebagai lantai (ground).
4. **TorusGeometry (0.45, 0.16, 16, 48)**: Geometri donat 3D (*Challenge A*) dengan rotasi kontinu pada sumbu X dan Y.
5. **ConeGeometry (0.5, 1.2, 24)**: Geometri kerucut (*Challenge A*) untuk visualisasi orientasi normal permukaan.
6. **SphereGeometry (0.12, 16, 8)**: Geometri bola kecil sebagai penanda visual sumber cahaya DirectionalLight (*Challenge D*).

# Daftar Material
1. **MeshLambertMaterial (`0x22d3ee` pada Cube & `0x1e293b` pada Ground)**:
   - Menghitung pantulan diffuse non-shiny (Lambertian reflectance).
   - Membutuhkan sumber cahaya agar dapat terlihat.
2. **MeshPhongMaterial (`0x4488ff` pada Sphere & `0xf59e0b` pada Torus)**:
   - Menghitung pantulan diffuse serta specular highlight berkilau (model Blinn-Phong).
   - Menampilkan titik kilau cahaya (*shininess: 70–90*).
3. **MeshNormalMaterial (pada Cone)**:
   - Memetakan arah vektor normal permukaan langsung ke nilai warna RGB tanpa terpengaruh intensitas cahaya luar.
4. **MeshBasicMaterial (`0xfef08a` pada Light Marker)**:
   - Material datar unlit yang tidak memerlukan pencahayaan untuk terlihat, digunakan khusus untuk penanda sumber cahaya.

# Daftar Light
1. **AmbientLight**:
   - Warna: `0xffffff`, Intensitas: `0.35`
   - Memberikan penerangan dasar merata ke seluruh arah agar sisi gelap objek yang tidak terkena cahaya langsung tetap terlihat.
2. **DirectionalLight**:
   - Warna: `0xffffff`, Intensitas: `2.0`
   - Posisi: Bergerak melingkar (*orbit*) mengitari scene.
   - Sumber cahaya terarah paralel dengan kemampuan menghasilkan bayangan real-time (*directional shadow*).

# Konfigurasi Shadow
Sistem bayangan dikonfigurasi melalui 4 komponen utama:
1. **Renderer**: `renderer.shadowMap.enabled = true` dengan filter `THREE.PCFSoftShadowMap` untuk tepian bayangan yang halus.
2. **Light**: `directionalLight.castShadow = true` dengan resolusi shadow map `1024 x 1024` serta batas frustum kamera bayangan:
   - `left: -6`, `right: 6`
   - `top: 6`, `bottom: -6`
   - `near: 0.5`, `far: 25`
3. **Shadow Casters**:
   - `cube.castShadow = true`
   - `sphere.castShadow = true`
   - `torus.castShadow = true`
   - `cone.castShadow = true`
4. **Shadow Receivers**:
   - `ground.receiveShadow = true`
   - `cube.receiveShadow = true`

# Animasi yang Dibuat
1. **Rotasi Otomatis Kubus**: Kubus berputar secara kontinu pada sumbu X (`0.35 * delta`) dan sumbu Y (`0.8 * delta`).
2. **Pantulan Sinusoidal Bola**: Bola bergerak memantul naik-turun menggunakan fungsi sinusoidal harmonik: `y = 0.75 + Math.sin(elapsed * 2.0) * 0.15` serta rotasi Y kontinu.
3. **Rotasi Torus & Cone**: Torus berputar pada sumbu X dan Y, serta Cone berputar pada sumbu Y.
4. **Animasi Orbit Cahaya (Challenge D)**: Sumber DirectionalLight bersama penanda visualnya bergerak melingkari scene:
   - `x = Math.cos(elapsed * 0.8) * 4.5`
   - `z = Math.sin(elapsed * 0.8) * 4.5`
   - `y = 5.0 + Math.sin(elapsed * 0.5) * 0.5`
   Pergerakan ini menghasilkan arah bayangan yang terus berubah secara halus dan dinamis.
5. **Frame-Rate Independence**: Seluruh laju animasi dikalikan dengan delta time (`THREE.Clock.getDelta()`) yang dibatasi maksimum `0.05` detik agar kecepatan gerak stabil di berbagai variasi refresh rate monitor pengguna.

# Challenge yang Dikerjakan
- **Challenge A — Tambah Geometry**: Menambahkan `TorusGeometry` dan `ConeGeometry` dengan material, transformasi posisi, dan skala yang tidak bertabrakan dengan objek lain di scene.
- **Challenge C — OrthographicCamera**: Menyediakan kamera kedua ortografis (`THREE.OrthographicCamera`). Pengguna dapat menekan tombol keyboard **`P`** untuk beralih mode antara perspektif dan ortografis, lengkap dengan penanganan resize window yang memperbarui projection matrix kedua kamera.
- **Challenge D — Light Animation**: Menggerakkan sumber DirectionalLight secara melingkar mengelilingi scene (orbit) dilengkapi bola penanda visual penunjuk arah cahaya, sehingga arah shading dan bayangan bergerak dinamis.
- **Challenge F — Scene Information**: HUD menampilkan mode kamera aktif, koordinat posisi kamera, jumlah objek di scene, jumlah segitiga yang dirender (`renderer.info.render.triangles`), dan real-time FPS counter.

# Cara Menjalankan
1. Masuk ke direktori project:
   ```bash
   cd praktikum-threejs-06
   ```
2. Pasang dependensi yang diperlukan:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka URL yang ditampilkan terminal pada browser (biasanya `http://localhost:5173`).

# Kontrol Keyboard jika ada
| Tombol | Fungsi / Aksi |
|---|---|
| **P** | Beralih antara PerspectiveCamera dan OrthographicCamera (*Challenge C*) |

# Catatan Debugging
1. **Orientasi PlaneGeometry**: Bidang `PlaneGeometry` default berada pada bidang XY vertikal menghadap sumbu Z. Agar berfungsi sebagai lantai horizontal mendatar, bidang harus dirotasi `-Math.PI / 2` radian terhadap sumbu X.
2. **Batas Shadow Camera (Clipping)**: Karena sumber DirectionalLight bergerak melingkar (*Challenge D*), batas frustum `directionalLight.shadow.camera` diperluas ke `[-6, 6]` agar bayangan tidak terpotong saat cahaya berada di sudut terjauh.
3. **Pembaruan Matriks Proyeksi Saat Resize**: Ketika aspect ratio kamera diperbarui pada event listener `resize`, metode `camera.updateProjectionMatrix()` wajib dipanggil pada kedua kamera (Perspective & Orthographic) agar objek tidak gepeng saat ukuran window diubah.
4. **Stabilitas Animasi dengan Delta Time**: Animasi pergerakan objek dan orbit cahaya dikalikan dengan `delta` (`THREE.Clock.getDelta()`) agar kecepatan animasi berjalan konsisten di monitor 60Hz, 120Hz, maupun 144Hz.
