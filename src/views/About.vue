<!-- src/views/About.vue -->
<template>
  <div class="about-container">
    <Header title="关于我们" />
    <div class="content">
      <h2>关于我们</h2>
      <p>
        智慧养老管理平台致力于为老年人提供高质量的养老服务，通过先进的技术和专业的团队，为老年人创造一个舒适、安全的生活环境。
      </p>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Header,
    Footer
  }
};
</script>

<style scoped>
.about-container {
  padding: 20px;
  text-align: center;
}

.content {
  margin-top: 20px;
}

.content h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.content p {
  font-size: 16px;
  color: #666;
}
</style>
