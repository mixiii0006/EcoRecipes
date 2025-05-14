<template>
  <div class="landing-page">
    <!-- Navbar Component -->
    <Navbar />

    <section class="hero">
      <div class="hero-text">
        <h1>Satu Resep, Satu langkah untuk Bumi.</h1>
        <p>
          Masukkan bahan makanan yang kamu miliki, dan temukan resep rendah
          emisi yang membantu melindungi bumi.
        </p>
        <button class="btn btn-primary" @click="goToLogin">Input Here</button>
      </div>
    </section>

    <section class="carousel-section">
      <div class="carousel" ref="carouselRef">
        <div class="carousel-track" ref="trackRef">
          <div
            class="carousel-item"
            v-for="(item, index) in duplicatedItems"
            :key="index"
          >
            <img :src="item.image" :alt="item.name" />
            <div class="item-info">
              <h3>{{ item.name }}</h3>
              <p>1kg = {{ item.co2 }} CO<sub>2</sub>e</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="carbon-footprint">
      <h2>Current World Carbon Footprint</h2>
      <div class="carbon-content">
        <div class="carbon-text">
          <h3>Apa itu Jejak Karbon? Bagaimana situasi Bumi saat ini?</h3>
          <p>
            Jejak karbon adalah total emisi gas rumah kaca (terutama karbon
            dioksida dan metana) yang dihasilkan oleh aktivitas manusia. Menurut
            Pusat Penelitian Gabungan Uni Eropa di tahun 2023, total emisi
            CO<sub>2</sub> global mencapai 37,4 hingga 37,55 Mt (juta ton
            metrik).
          </p>
          <h3>Mengapa Ini Penting?</h3>
          <p>
            Gas rumah kaca membantu Bumi tetap hangat, tetapi kelebihan gas ini
            menyebabkan pemanasan global. Dengan memilih makanan rendah karbon,
            maka Anda ikut melindungi planet kita.
          </p>
          <h3>
            Tahukah Anda bahwa pilihan makanan kita turut berperan besar pada
            lingkungan?
          </h3>
          <p>
            Setiap makanan meninggalkan jejak karbon, yaitu jumlah gas rumah
            kaca yang dihasilkan selama produksi, pengolahan, dan
            transportasinya.
          </p>
        </div>
        <div class="carbon-chart">
          <img src="/images/carbon-chart.png" alt="Carbon Footprint Chart" />
        </div>
      </div>
      <div class="carbon-note">
        <p>
          Oleh karena itu, kami hadir sebagai website yang dapat mengalkulasi
          jejak karbon dari bahan makanan yang dimiliki pengguna dan memberikan
          rekomendasi resep masakan rendah emisi karbon, dilengkapi saran
          substitusi bahan yang lebih ramah lingkungan.
        </p>
      </div>
    </section>

    <section class="how-it-works">
      <h2>How Does it Work</h2>
      <p>Mulai semuanya dengan tiga langkah mudah.</p>
      <div class="how-it-works-card">
        <div class="step-card">
          <img src="/images/rekomendasi-resep.png" alt="Resep Rendah Emisi" />
          <h3>Dapatkan Rekomendasi Resep Rendah Emisi</h3>
          <p>
            Kami menyarankan resep-resep lezat dengan jejak karbon yang lebih
            rendah, berdasarkan bahan yang kamu input.
          </p>
        </div>
        <div class="step-card active">
          <img src="/images/input-bahan.png" alt="Input Bahan Makanan" />
          <h3>Input bahan makanan yang kamu miliki</h3>
          <p>Cukup tulis bahan-bahan masakanmu yang ada di rumah.</p>
        </div>
        <div class="step-card">
          <img src="/images/belajar-memasak.png" alt="Belajar Sambil Memasak" />
          <h3>Belajar Sambil Memasak</h3>
          <p>
            Lihat estimasi emisi dari setiap resep dan pelajari bagaimana
            pilihan kecil bisa memberi dampak besar.
          </p>
        </div>
      </div>
    </section>

    <section class="why-choose-us">
      <h2>Why Choose Us?</h2>
      <p>
        Kami percaya bahwa perubahan besar dimulai dari pilihan kecil.<br />
        Inilah alasan kamu bisa percaya pada kami.
      </p>
      <div class="choose-us-card-container">
        <div class="top-row">
          <div class="choose-us-card">
            <img
              src="/images/icon-fast.png"
              alt="Cepat dan Mudah"
              class="choose-us-icon"
            />
            <h3 class="choose-us-heading">Cepat dan Mudah</h3>
            <p class="choose-us-desc">
              Cukup masukkan bahan<br />
              ↓ <br>Dapatkan resep<br />
              ↓ <br>Lihat estimasi emisi
            </p>
          </div>
          <div class="choose-us-card">
            <img
              src="/images/icon-recommend.png"
              alt="Rekomendatif"
              class="choose-us-icon"
            />
            <h3 class="choose-us-heading">Rekomendatif</h3>
            <p class="choose-us-desc">
              Dapatkan alternatif bahan makanan dan resep yang lebih rendah
              emisi.
            </p>
          </div>
          <div class="choose-us-card">
            <img
              src="/images/icon-eco.png"
              alt="Ramah Lingkungan"
              class="choose-us-icon"
            />
            <h3 class="choose-us-heading">Ramah Lingkungan</h3>
            <p class="choose-us-desc">
              Bantu kurangi emisi karbon dari dapurmu.
            </p>
          </div>
        </div>
        <div class="bottom-row">
          <div class="choose-us-card">
            <img
              src="/images/icon-data.png"
              alt="Berdasarkan Data"
              class="choose-us-icon"
            />
            <h3 class="choose-us-heading">Berdasarkan Data</h3>
            <p class="choose-us-desc">
              Sistem kami menggunakan data terpercaya tentang emisi karbon dari
              makanan.
            </p>
          </div>
          <div class="choose-us-card">
            <img
              src="/images/icon-ml.png"
              alt="Didukung Machine Learning"
              class="choose-us-icon"
            />
            <h3 class="choose-us-heading">Didukung Machine Learning</h3>
            <p class="choose-us-desc">
              Rekomendasi resep berdasarkan data dan pola terbaik.
            </p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Navbar from "../components/navbar.vue";
export default {
  name: "LandingPage",
  components: {
    Navbar,
  },
  data() {
    return {
      foodItems: [
        { name: "Daging Sapi", image: "/images/beef.png", co2: "99,48 kg" },
        { name: "Unggas", image: "/images/chicken.png", co2: "9,87 kg" },
        {
          name: "Dark Chocolate",
          image: "/images/chocolate.png",
          co2: "46,65 kg",
        },
        { name: "Keju", image: "/images/cheese.png", co2: "23,88 kg" },
        { name: "Ikan", image: "/images/fish.png", co2: "13,63 kg" },
      ],
      moreFoodItems: [
        { name: "Sayur Bayam", image: "/images/spinach.png", co2: "2,0 kg" },
        { name: "Kacang Merah", image: "/images/red-beans.png", co2: "1,5 kg" },
        { name: "Beras", image: "/images/rice.png", co2: "3,2 kg" },
        { name: "Apel", image: "/images/apple.png", co2: "0,4 kg" },
        { name: "Pisang", image: "/images/banana.png", co2: "0,5 kg" },
      ],
      scrollInterval: null,
    };
  },
  computed: {
    allFoodItems() {
      return [...this.foodItems, ...this.moreFoodItems];
    },
    duplicatedItems() {
      // Gandakan untuk efek looping
      return [...this.allFoodItems, ...this.allFoodItems];
    },
  },
  mounted() {
    this.startCarouselAutoscroll();
  },
  beforeUnmount() {
    clearInterval(this.scrollInterval);
  },
  methods: {
    goToLogin() {
      this.$router.push('/login')
    },
    startCarouselAutoscroll() {
      const carousel = this.$refs.carouselRef;
      const track = this.$refs.trackRef;

      const scrollSpeed = 1;
      const intervalTime = 16;
      const halfScroll = track.scrollWidth / 2;

      this.scrollInterval = setInterval(() => {
        if (!carousel || !track) return;

        if (carousel.scrollLeft >= halfScroll) {
          // Langsung reset tanpa animasi
          carousel.scrollLeft = 0;
        } else {
          carousel.scrollLeft += scrollSpeed;
        }
      }, intervalTime);
    },
  },
};
</script>

<style scoped>
.landing-page {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #235f3a;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
}

.hero {
  height: calc(
    100vh - 70px
  ); /* Gunakan calc untuk menghitung tinggi penuh dikurangi tinggi navbar */
  display: flex;
  align-items: center;
  padding: 0 4rem;
  background: url("/images/landing-bg.jpg") no-repeat center center;
  background-size: cover;
  color: #f9f9f9;
  margin-top: 70px; /* Sesuaikan dengan tinggi navbar yang fixed */
  box-sizing: border-box;
}

.hero-text {
  max-width: 600px;
  margin-left: 80px;
}

.hero-text h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-text p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.btn-primary {
  background-color: #f9f9f9;
  color: #235f3a;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #a5d6a7;
}

.carousel-section {
  padding: 2rem 0;
  color: #235f3a;
  overflow: hidden;
}

.carousel {
  display: flex;
  overflow-x: hidden;
  scroll-behavior: auto;
  gap: 1rem;
  padding-bottom: 1rem;
  scrollbar-width: none;
  max-width: 100%; /* pastikan ini ada */
  white-space: nowrap;
  position: relative;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.carousel-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.2);
  min-width: 150px;
  min-height: 100px;
  text-align: center;
  padding: 1rem;
  flex-shrink: 0;
  flex: 0 0 auto;
  margin-right: 1rem;
}

.carousel-item img {
  max-width: 100px;
  margin-bottom: 0.5rem;
}

.carousel-track {
  display: flex;
  flex-wrap: nowrap;
}

.carousel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.item-info h3 {
  margin: 0.5rem 0 0.25rem 0;
  font-weight: 700;
  color: #235f3a;
}

.item-info p {
  margin: 0;
  font-weight: 600;
  color: #235f3a;
}

.carbon-footprint {
  padding: 0 4rem;
  text-align: center;
  font-size: 1.25rem;
  color: #235f3a;
}

.carbon-content {
  display: flex;
  flex-wrap: wrap;
  justify-content:space-around;
  align-items: flex-start;
  margin-top: 2.5rem;
  gap: 2rem;
}

.carbon-text {
  max-width: 600px;
  text-align: left;
  color: #235f3a;
}

.carbon-text h3 {
  font-size: 1.25rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.carbon-text p {
  font-size: 1rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.carbon-chart img {
  max-width: 450px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.2);
  align-self: center;
}

.carbon-note {
  margin-top: 1rem;
  background: #235f3a;
  color: #f9f9f9;
  padding: 0.5rem;
  border-radius: 10px;
  font-weight: 500;
  font-size: 1rem;
  width: 90%;
  justify-self: center;
}

.how-it-works {
  text-align: center;
  padding: 2rem;
}

.how-it-works-card {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 2rem 0;
  align-items: s;
}

.step-card {
  background-color: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  width: 250px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.step-card:hover {
  transform: translateY(-5px);
}

.step-card img {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
}

.step-card h3 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

.step-card p {
  font-size: 0.95rem;
  line-height: 1.4;
}

.step-card.active {
  background-color: #235f3a;
  color: #fff;
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.3);
  z-index: 1;
}

.why-choose-us {
  text-align: center;
  padding: 3rem 1rem;
}

.choose-us-card-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin: 40px;
}

.choose-us-card {
  background-color: #235f3a;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 260px;
  text-align: center;
  transition: transform 0.3s ease;
}

.choose-us-card:hover {
  transform: translateY(-5px);
}

.top-row,
.bottom-row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.top-row {
  margin-bottom: 40px;
  z-index: 1;
}

.bottom-row {
  z-index: 0;
  position: relative;
}

.choose-us-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
}

.choose-us-heading {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #fff;
}

.choose-us-desc {
  font-size: 0.95rem;
  color: #fff;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .hero-text h1 {
    font-size: 2.5rem;
  }

  .carousel-item {
    min-width: 130px;
  }

  .step-card,
  .choose-us-card {
    width: 220px;
  }
}

@media (max-width: 768px) {
  .hero {
    display: flex;
    flex-direction: column;
    padding: 20rem 2rem;
    text-align: left;
  }

  .hero-text {
    margin: 0;
  }

  .hero-text h1 {
    font-size: 2rem;
  }

  .hero-text p {
    font-size: 1rem;
  }

  .carbon-footprint {
    padding: 1rem;
  }

  .carbon-content {
    flex-direction: column;
    align-items: center;
  }

  .carbon-chart img {
    max-width: 80%;
  }

  .how-it-works-card {
    flex-direction: column;
    align-items: center;
  }

  .step-card, .choose-us-card {
    width: 80%;
  }

  .choose-us-card-container {
    margin: 20px;
  }

  .top-row,
  .bottom-row {
    flex-direction: column;
    align-items: center;
  }

  .bottom-row {
    max-width: 75%;
    min-width: 70%;
  }

  .carousel-item {
    min-width: 120px;
  }

  .btn-primary {
    padding: 0.5rem 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero {
    display: flex;
    flex-direction: column;
    padding: 15rem 2rem;
    text-align: left;
  }

  .hero-text {
    margin: 0;
  }

  .hero-text h1 {
    font-size: 1.75rem;
  }

  .hero-text p {
    font-size: 0.95rem;
  }

  .carbon-text h3 {
    font-size: 1rem;
  }

  .carbon-text p {
    font-size: 0.9rem;
  }

  .choose-us-heading {
    font-size: 1rem;
  }

  .choose-us-desc {
    font-size: 0.85rem;
  }

  .btn-primary {
    padding: 0.5rem 1rem;
    font-size: 0.95rem;
  }

  .step-card.active {
    transform: scale(1.1);
  }

  .step-card h3,
  .choose-us-heading {
    font-size: 1rem;
  }

  .step-card p,
  .choose-us-desc {
    font-size: 0.85rem;
  }
}
</style>
