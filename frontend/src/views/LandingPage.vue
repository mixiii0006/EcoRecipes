<template>
  <div class="landing-page">
    <section class="hero">
      <div class="hero-text">
        <h1>Satu Resep, Satu langkah untuk Bumi.</h1>
        <p>Masukkan bahan makanan yang kamu miliki, dan temukan resep rendah emisi yang membantu melindungi bumi.</p>
        <button class="btn btn-primary">Input Here</button>
      </div>
    </section>
    <section class="carousel-section">
      <div class="carousel">
        <div class="carousel-item" v-for="item in foodItems" :key="item.name">
          <img :src="item.image" :alt="item.name" />
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>1kg = {{ item.co2 }} CO<sub>2</sub>e</p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="carbon-footprint">
      <h2>Current World Carbon Footprint</h2>
      <div class="carbon-content">
        <div class="carbon-text">
          <h3>Apa itu Jejak Karbon? Bagaimana situasi Bumi saat ini?</h3>
          <p>Jejak karbon adalah total emisi gas rumah kaca (terutama karbon dioksida dan metana) yang dihasilkan oleh aktivitas manusia. Menurut Pusat Penelitian Gabungan Uni Eropa di tahun 2023, total emisi CO<sub>2</sub> global mencapai 37,4 hingga 37,55 Mt (juta ton metrik).</p>
          <h3>Mengapa Ini Penting?</h3>
          <p>Gas rumah kaca membantu Bumi tetap hangat, tetapi kelebihan gas ini menyebabkan pemanasan global. Dengan memilih makanan rendah karbon, maka Anda ikut melindungi planet kita.</p>
          <h3>Tahukah Anda bahwa pilihan makanan kita turut berperan besar pada lingkungan?</h3>
          <p>Setiap makanan meninggalkan jejak karbon, yaitu jumlah gas rumah kaca yang dihasilkan selama produksi, pengolahan, dan transportasinya.</p>
        </div>
        <div class="carbon-chart">
          <img src="/images/carbon-chart.png" alt="Carbon Footprint Chart" />
        </div>
      </div>
      <div class="carbon-note">
        <p>Oleh karena itu, kami hadir sebagai website yang dapat mengalkulasi jejak karbon dari bahan makanan yang dimiliki pengguna dan memberikan rekomendasi resep masakan rendah emisi karbon, dilengkapi saran substitusi bahan yang lebih ramah lingkungan.</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LandingPage',
  data() {
    return {
      foodItems: [
        { name: 'Daging Sapi', image: '/images/beef.png', co2: '99,48 kg' },
        { name: 'Unggas', image: '/images/chicken.png', co2: '9,87 kg' },
        { name: 'Dark Chocolate', image: '/images/chocolate.png', co2: '46,65 kg' },
        { name: 'Keju', image: '/images/cheese.png', co2: '23,88 kg' },
        { name: 'Ikan', image: '/images/fish.png', co2: '13,63 kg' }
      ],
      moreFoodItems: [
        { name: 'Sayur Bayam', image: '/images/spinach.png', co2: '2,0 kg' },
        { name: 'Kacang Merah', image: '/images/red-beans.png', co2: '1,5 kg' },
        { name: 'Beras', image: '/images/rice.png', co2: '3,2 kg' },
        { name: 'Apel', image: '/images/apple.png', co2: '0,4 kg' },
        { name: 'Pisang', image: '/images/banana.png', co2: '0,5 kg' }
      ]
    };
  }
};
</script>

<style scoped>
.landing-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2e7d32;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 4rem;
  background: url('/images/landing-bg.jpg') no-repeat center center/cover;
  color: #f5f5dc;
  min-height: 700px;
}

.hero-text {
  max-width: 600px;
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
  background-color: #f5f5dc;
  color: #2e7d32;
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
  background: #f5f5dc;
  padding: 1rem 2rem;
  color: #2e7d32;
}

.carousel {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 1rem;
  scroll-behavior: smooth;
}

.carousel-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.2);
  min-width: 140px;
  text-align: center;
  padding: 1rem;
  flex-shrink: 0;
}

.carousel-item img {
  max-width: 100px;
  margin-bottom: 0.5rem;
}

.item-info h3 {
  margin: 0.5rem 0 0.25rem 0;
  font-weight: 700;
  color: #2e7d32;
}

.item-info p {
  margin: 0;
  font-weight: 600;
  color: #2e7d32;
}

.carbon-footprint {
  padding: 2rem;
  text-align: left;
  font-weight: 700;
  font-size: 1.25rem;
  color: #2e7d32;
}

.carbon-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 1rem;
  gap: 2rem;
  flex-wrap: wrap;
}

.carbon-text {
  max-width: 600px;
  text-align: left;
  color: #2e7d32;
}

.carbon-text h3 {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.carbon-text p {
  margin-bottom: 1rem;
  line-height: 1.4;
}

.carbon-chart img {
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(46, 125, 50, 0.2);
}

.carbon-note {
  margin-top: 1rem;
  background: #2e7d32;
  color: #f5f5dc;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
}
</style>
