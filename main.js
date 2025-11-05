// login
function login() {
  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;

  const user = dataPengguna.find(
    (u) => u.email === emailInput && u.password === passwordInput
  );

  if (user) {
    localStorage.setItem("namaUser", user.nama);
    localStorage.setItem("roleUser", user.role);

    alert(`Login berhasil! Selamat datang, ${user.nama}`);
    window.location.href = "dashboard.html";
    return false;
  } else {
    alert("Email atau password yang anda masukkan salah!");
    return false;
  }
}

function bukaDaftar() {
  document.getElementById("modalDaftar").style.display = "flex";
}

function bukaLupaPassword() {
  document.getElementById("modalLupa").style.display = "flex";
}

function tutupModal(id) {
  document.getElementById(id).style.display = "none";
}

function daftarAkun() {
  const nama = document.getElementById("namaDaftar").value;
  const email = document.getElementById("emailDaftar").value;
  const password = document.getElementById("passwordDaftar").value;

  if (!nama || !email || !password) {
    alert("Semua kolom wajib diisi!");
    return;
  }

  const sudahAda = dataPengguna.find(u => u.email === email);
  if (sudahAda) {
    alert("Email sudah terdaftar!");
    return;
  }

  dataPengguna.push({
    id: dataPengguna.length + 1,
    nama,
    email,
    password,
    role: "User"
  });

  alert("Akun berhasil didaftarkan!");
  tutupModal("modalDaftar");
}

function resetPassword() {
  const email = document.getElementById("emailLupa").value;
  const user = dataPengguna.find(u => u.email === email);
  if (user) {
    alert(`Password untuk ${user.nama} adalah: ${user.password}`);
  } else {
    alert("Email tidak ditemukan!");
  }
  tutupModal("modalLupa");
}

// greeting
function tampilkanGreeting() {
  const jam = new Date().getHours();
  let sapaan;

  if (jam < 12) sapaan = "Selamat Pagi";
  else if (jam < 18) sapaan = "Selamat Siang";
  else sapaan = "Selamat Malam";

  const nama = localStorage.getItem("namaUser") || "Pengunjung";
  document.getElementById("greeting").textContent =
    `${sapaan}, ${nama}! Selamat datang di Dashboard Toko Buku.`;
}

// stok
function tampilkanKatalog() {
  const tbody = document.getElementById("isiTabel");
  tbody.innerHTML = "";

  dataKatalogBuku.forEach((buku) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${buku.kodeBarang}</td>
      <td><img src="${buku.cover}" alt="${buku.namaBarang}" width="80"></td>
      <td>${buku.namaBarang}</td>
      <td>${buku.jenisBarang}</td>
      <td>${buku.edisi}</td>
      <td>${buku.stok}</td>
      <td>${buku.harga}</td>
    `;
    tbody.appendChild(row);
  });
}

function tambahBuku() {
  const kodeBarang = document.getElementById("kodeBarang").value;
  const namaBarang = document.getElementById("namaBarang").value;
  const jenisBarang = document.getElementById("jenisBarang").value;
  const edisi = document.getElementById("edisi").value;
  const stok = document.getElementById("stok").value;
  const harga = document.getElementById("harga").value;
  const cover = document.getElementById("cover").value;

  if (!kodeBarang || !namaBarang || !jenisBarang || !edisi || !stok || !harga || !cover) {
    alert("Semua field harus diisi!");
    return;
  }

  const bukuBaru = {
    kodeBarang,
    namaBarang,
    jenisBarang,
    edisi,
    stok: parseInt(stok),
    harga,
    cover
  };

  dataKatalogBuku.push(bukuBaru);
  tampilkanKatalog();

  document.getElementById("kodeBarang").value = "";
  document.getElementById("namaBarang").value = "";
  document.getElementById("jenisBarang").value = "";
  document.getElementById("edisi").value = "";
  document.getElementById("stok").value = "";
  document.getElementById("harga").value = "";
  document.getElementById("cover").value = "";
}

// checkout
let dataPesanan = [
  { kode: "ASIP4301", nama: "Pengantar Ilmu Komunikasi", harga: 180000, jumlah: 1 },
];

function tampilkanPesanan() {
  const tbody = document.getElementById("isiPesanan");
  tbody.innerHTML = "";
  let total = 0;

  dataPesanan.forEach((buku, index) => {
    const totalItem = buku.harga * buku.jumlah;
    total += totalItem;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${buku.kode}</td>
      <td>${buku.nama}</td>
      <td>Rp ${buku.harga.toLocaleString("id-ID")}</td>
      <td>
        <input type="number" min="1" value="${buku.jumlah}" onchange="ubahJumlah(${index}, this.value)">
      </td>
      <td>Rp ${totalItem.toLocaleString("id-ID")}</td>
      <td><button onclick="hapusPesanan(${index})"></button></td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("totalAkhir").textContent =
    `Total: Rp ${total.toLocaleString("id-ID")}`;
}

function tambahPesanan() {
  const kode = document.getElementById("kodeBuku").value;
  const nama = document.getElementById("namaBuku").value;
  const harga = parseInt(document.getElementById("hargaBuku").value);
  const jumlah = parseInt(document.getElementById("jumlahBuku").value);

  if (!kode || !nama || !harga || !jumlah) {
    alert("Isi semua data buku terlebih dahulu!");
    return;
  }

  dataPesanan.push({ kode, nama, harga, jumlah });
  tampilkanPesanan();

  document.getElementById("kodeBuku").value = "";
  document.getElementById("namaBuku").value = "";
  document.getElementById("hargaBuku").value = "";
  document.getElementById("jumlahBuku").value = "";
}

function ubahJumlah(index, jumlahBaru) {
  dataPesanan[index].jumlah = parseInt(jumlahBaru);
  tampilkanPesanan();
}

function hapusPesanan(index) {
  if (confirm("Yakin ingin menghapus buku ini?")) {
    dataPesanan.splice(index, 1);
    tampilkanPesanan();
  }
}

function konfirmasiPesanan() {
  const nama = document.getElementById("namaPemesan").value;
  const email = document.getElementById("emailPemesan").value;
  const alamat = document.getElementById("alamatPemesan").value;
  const metode = document.getElementById("metodeBayar").value;

  if (!nama || !email || !alamat || !metode) {
    alert("Harap isi semua data pemesan!");
    return false;
  }

  alert(`Pesanan atas nama ${nama} berhasil dikonfirmasi!
Email konfirmasi akan dikirim ke ${email}.`);
  return false;
}

// tracking
function cariTracking() {
  const inputDO = document.getElementById("nomorDO").value.trim();
  const hasilDiv = document.getElementById("hasilTracking");
  hasilDiv.innerHTML = "";

  const data = dataTracking[inputDO];

  if (!data) {
    hasilDiv.innerHTML = `<p style="color:red;"> Nomor DO tidak ditemukan.</p>`;
    return;
  }

  // Tentukan tahap progress berdasarkan status
  let progressStep = 0;
  if (data.status.toLowerCase().includes("dikirim")) progressStep = 1;
  else if (data.status.toLowerCase().includes("dalam perjalanan")) progressStep = 2;
  else if (data.status.toLowerCase().includes("selesai")) progressStep = 3;

  hasilDiv.innerHTML = `
    <div class="card-tracking">
      <h3>Nomor DO: ${data.nomorDO}</h3>
      <p><b>Nama Pemesan:</b> ${data.nama}</p>
      <p><b>Ekspedisi:</b> ${data.ekspedisi}</p>
      <p><b>Tanggal Kirim:</b> ${data.tanggalKirim}</p>
      <p><b>Jenis Paket:</b> ${data.paket}</p>
      <p><b>Total Pembayaran:</b> ${data.total}</p>

      <h4>Status Pengiriman:</h4>
      <div class="progress-wrapper">
        <div class="progress-bar">
          <div class="progress-fill" style="width:${(progressStep / 3) * 100}%"></div>
        </div>
        <div class="progress-labels">
          <span ${progressStep >= 1 ? 'class="aktif"' : ''}>Dikirim</span>
          <span ${progressStep >= 2 ? 'class="aktif"' : ''}>Dalam Perjalanan</span>
          <span ${progressStep >= 3 ? 'class="aktif"' : ''}>Selesai</span>
        </div>
      </div>

      <h4>Riwayat Perjalanan:</h4>
      <table class="riwayat-table">
        <thead>
          <tr><th>Waktu</th><th>Keterangan</th></tr>
        </thead>
        <tbody>
          ${data.perjalanan.map(p => `
            <tr>
              <td>${p.waktu}</td>
              <td>${p.keterangan}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// History
if (document.body.classList.contains("history-page")) {
  const dataHistory = [
    {
      id: 1,
      nama: "Rina Wulandari",
      judulBuku: "Pengantar Ilmu Komunikasi",
      jumlah: 1,
      total: 180000,
      tanggal: "2025-08-25",
      status: "Selesai"
    },
    {
      id: 2,
      nama: "Agus Pranoto",
      judulBuku: "Manajemen Keuangan",
      jumlah: 2,
      total: 440000,
      tanggal: "2025-09-10",
      status: "Dikirim"
    }
  ];

  function tampilkanHistory() {
    const tbody = document.querySelector("#tabelHistory tbody");
    tbody.innerHTML = "";
    dataHistory.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.nama}</td>
        <td>${item.judulBuku}</td>
        <td>${item.jumlah}</td>
        <td>Rp ${item.total.toLocaleString("id-ID")}</td>
        <td>${item.tanggal}</td>
        <td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td>`;
      tbody.appendChild(tr);
    });
  }

  document.addEventListener("DOMContentLoaded", tampilkanHistory);
}

