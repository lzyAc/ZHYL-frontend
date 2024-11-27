<template>
  <div class="home-container">
    <Header title="智慧养老管理平台" />
    <el-carousel :interval="5000" arrow="always" height="400px">
      <el-carousel-item v-for="item in images" :key="item.id">
        <img :src="item.src" alt="Banner" class="carousel-image" />
      </el-carousel-item>
    </el-carousel>
    <div class="announcements">
      <h2>最新公告</h2>
      <div class="scrollable-announcements">
        <div v-for="announcement in announcements" :key="announcement.id" class="announcement-item">
          {{ announcement.title }}
        </div>
      </div>
    </div>
    <div class="introduction">
      <h2>欢迎来到智慧养老平台</h2>
      <p>
        我们致力于为老年人提供高质量的养老服务，通过先进的技术和专业的团队，为老年人创造一个舒适、安全的生活环境。
      </p>
    </div>
    <Footer />
  </div>
</template>

<script>
// import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    // Header,
    Footer
  },
  data() {
    return {
      images: [
        { id: 1, src: '/images/banner/banner05.png' },
        { id: 2, src: '/images/banner/banner06.png' },
        { id: 3, src: '/images/banner/banner01.png' },
        { id: 4, src: '/images/banner/banner02.png' },
      ],
      announcements: [
        {id: 1, title: '关于开展秋季健康讲座的通知'},
        {id: 2, title: '重阳节活动安排'},
        {id: 3, title: '冬季防寒小贴士'},
        {id: 4, title: '关于加强疫情防控的通知'},
        {id: 5, title: '老年人健康知识讲座'},
        {id: 6, title: '社区志愿者招募启事'}
      ]
    };
  }
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
  padding: 20px;
  text-align: center;
}

.carousel-image {
  width: 60%;
  height: auto;
  max-height: 400px;
  object-fit: cover;
}

.introduction {
  margin-top: 20px;
}

.introduction h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.introduction p {
  font-size: 16px;
  color: #666;
}

.announcements {
  background-color: #f8f9fa;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  margin-bottom: 20px;
}

.announcements h2 {
  font-size: 18px;
  margin-bottom: 5px;
}

.scrollable-announcements {
  max-height: 200px; /* 增加高度 */
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  background-color: #fff;
  font-size: 16px;
}

.announcement-item {
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 3px;
  background-color: #f1f1f1; /* 统一的背景颜色 */
  color: #333;
}
</style>
