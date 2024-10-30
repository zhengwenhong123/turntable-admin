<template>
  <!--  <div class="wheel-container">-->
  <!--    <div class="light-dots-container" :style="{transform:`rotate${rotation}deg`}">-->
  <!--      <div class="light-dot" v-for="n in 24" :key="n"></div> &lt;!&ndash; 12个灯点 &ndash;&gt;-->
  <!--    </div>-->
  <!--    <LuckyWheel-->
  <!--        :width="300"-->
  <!--        :height="300"-->
  <!--        :prizes="prizes"-->
  <!--        :buttons="buttons"-->
  <!--        @start="startCallback"-->
  <!--        @end="endCallback"-->
  <!--        ref="MyLucky"-->
  <!--    />-->
  <!--  </div>-->
  <div class="select-box">
    <el-select v-model="selectedCanteen" placeholder="请选择餐厅" @change="getCanteens">
      <el-option
          v-for="canteen in canteens"
          :key="canteen.id"
          :label="canteen.name"
          :value="canteen.id"
      />
    </el-select>

    <el-select v-model="selectedCategory" placeholder="请选择分类" @change="getCategories">
      <el-option
          v-for="category in categories"
          :key="category.id"
          :label="category.name"
          :value="category.id"
      />
    </el-select>
  </div>


  <LuckyWheel
      ref="myLucky"
      width="500px"
      height="500px"
      :prizes="prizes"
      :blocks="block"
      :buttons="buttons"
      @start="startCallback"
      @end="endCallback"
      :default-config="defaultConfig"
  />
</template>

<script setup>
import {computed, onMounted, ref, toRaw, watch} from 'vue'
import axios from 'axios';
import {ElOption, ElSelect} from 'element-plus';
// import { LuckyWheel } from '@lucky-canvas/vue'
//
const myLucky = ref();
console.log(myLucky.value);
// //旋转角度
// const rotation = ref(0);
//
const defaultConfig = {
  // gutter: '5px',
  offsetDegree: -20
}
//
// 配置背景
const block = ref([
  {
    padding: '50px', // 设置背景块的padding
    background: '#fff', // 可以设置一个背景颜色
    imgs: [
      {
        src: 'https://100px.net/assets/img/bg.2daf906c.png',
        width: '100%',
        height: '100%',
      }
    ]
  }
]);
//
//
// // 奖项和按钮的配置（与之前相同）
const prizes = ref([
  {
    background: '#FEF3FC',
    fonts: [{text: '汉堡包', top: '20px', fontColor: '', fontSize: '14px'}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/lf/preview_sets/previews/LZeaIOpiqps8EFyo.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.1,
  },
  {
    background: '#F8DEF8',
    fonts: [{text: '披萨', top: '20px', fontColor: '', fontSize: '14px'}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/bd/preview_sets/previews/j16p8EXUyNFlSdYH.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.4
  },
  {
    background: '#FEF3FC',
    fonts: [{text: '冰淇淋', top: '20px', fontColor: '', fontSize: '14px'}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/ue/preview_sets/previews/tB2cCUuVCod0ZUaT.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.3,
  },
  {
    background: '#F8DEF8',
    fonts: [{text: '爆米花', top: '20px', fontColor: '', fontSize: '14px'}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/dj/preview_sets/previews/TO_4nOeoT4vMoifl.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.1,
  },
  {
    background: '#FEF3FC',
    fonts: [{text: '美式热狗', top: '20px', fontColor: '', fontSize: '14px'}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/id/preview_sets/previews/s1SdMQF2JnE61Lck.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.2,
  },
  {
    background: '#F8DEF8',
    fonts: [{text: '奶茶', top: '20px', fontColor: '', fontSize: '14px'}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/dl/preview_sets/thumbs/gufsFj0vR3bMqqRi.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.1,
  },
  {
    background: '#FEF3FC',
    fonts: [{text: '美式薯条', top: '20px', fontColor: '', fontSize: '14px'}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/sm/preview_sets/thumbs/6GojDiUoyDfzxPDi.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.2,
  },
  {
    background: '#F8DEF8',
    fonts: [{text: '美食炸鸡', top: '20px', fontColor: '', fontSize: '14px'}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/pq/preview_sets/previews/oyNgqCTHwwadp9Hi.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.1,
  },
])

const buttons = ref([
  {
    radius: '18%',
    pointer: true,
    background: '#F93D57', // 改为紫色
    imgs: [{
      src: 'data:image/png;base64,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',
      width: "100px",
      height: "100px",
      top: "-50px"
    }]
  },
])

// 计算累积概率
const cumulativeProbabilities = computed(() => {
  let cumulativeSum = 0;
  return prizes.value.map(prize => {
    cumulativeSum += prize.probability;
    return cumulativeSum;
  });
});

// 根据累积概率选择中奖索引
const getRandomIndex = () => {
  const randomValue = Math.random();
  for (let i = 0; i < cumulativeProbabilities.value.length; i++) {
    if (randomValue <= cumulativeProbabilities.value[i]) {
      return i;
    }
  }
  return cumulativeProbabilities.value.length - 1; // 防止浮点误差导致的越界
};


const startCallback = () => {
  myLucky.value.play();

  // 生成一个随机的中奖索引
  const randomIndex = getRandomIndex();

  setTimeout(() => {
    // 假设后端返回的中奖索引是0
    console.log(randomIndex)
    // 调用stop停止旋转并传递中奖索引
    myLucky.value.stop(randomIndex)
  }, 1000)
}

const endCallback = (prize) => {
  console.log('中奖结果：', toRaw(prize));
}


/**
 *  测试
 * */

const selectedCanteen = ref(null);
const selectedCategory = ref(null);
const canteens = ref([]);
const categories = ref([]);

const getCanteens = async (target) => {
  console.log();
  try {
    const response = await axios.get('/api/shops/canteens');
    console.log(response.data);
    canteens.value = response.data;
  } catch (error) {
    console.error('Error fetching canteens:', error);
  }
};

const getCategories = async () => {

  if (selectedCanteen.value) {
    try {
      const response = await axios.get(`/api/shops/categories?canteenId=${selectedCanteen.value}`);
      categories.value = response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
};

const getShops = async () => {
  if (selectedCanteen.value && selectedCategory.value) {
    try {
      const response = await axios.get(`/api/shops/by-canteen-and-category?canteenId=${selectedCanteen.value}&categoryId=${selectedCategory.value}`);
      // prizes.value = response.data.map(shop => ({name: shop.name, id: shop.id}));
      // 根据返回的档口信息设置转盘的 prizes 和其他属性
      console.log(response.data);
      console.log(selectedCategory.value);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  }
};

onMounted(() => {
  getCanteens();
});

watch(selectedCanteen, getCategories);
watch([selectedCanteen, selectedCategory], getShops);

</script>


<style lang="scss" scoped>
.select-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
}

//$dot-count: 24; // 总的灯点数量，12大12小
//$radius: 160px; // 灯点的旋转半径
//$large-dot-size: 20px; // 大灯点的大小
//$small-dot-size: 12px; // 小灯点的大小
//$large-dot-color: #ffd700; // 大灯点颜色
//$small-dot-color: #ffffff; // 小灯点颜色（白色）
//$animation-duration: 2s; // 灯点闪烁动画时长
//
//.wheel-container {
//  position: relative;
//  display: flex;
//  justify-content: center;
//  align-items: center;
//  height: 100vh;
//}
//
//.light-dots-container {
//  position: absolute;
//  width: 350px;
//  height: 350px;
//  border-radius: 50%;
//  display: flex;
//  justify-content: center;
//  align-items: center;
//
//  // 配置渐变外层
//  background: radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(255, 215, 0, 0.6) 60%, transparent 100%);
//
//  .light-dot {
//    position: absolute;
//    border-radius: 50%;
//    animation: blink $animation-duration infinite ease-in-out;
//  }
//
//  // SCSS循环，生成大灯点和小灯点交替排列
//  @for $i from 1 through $dot-count {
//    .light-dot:nth-child(#{$i}) {
//      transform: rotate((360deg / $dot-count) * ($i - 1)) translate($radius);
//
//
//      // 偶数为大灯点，奇数为小灯点
//      @if $i % 2 == 1 {
//        width: $large-dot-size;
//        height: $large-dot-size;
//        background-color: $large-dot-color;
//        box-shadow: 0 0 10px rgba(255, 215, 0, 0.7);
//      } @else {
//        width: $small-dot-size;
//        height: $small-dot-size;
//        // 小灯点渐变
//        background: $small-dot-color linear-gradient(45deg, #ffffff, #e0e0e0);
//        box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
//      }
//    }
//  }
//}
//
//@keyframes blink {
//  0%, 100% {
//    opacity: 1;
//  }
//  50% {
//    opacity: 0.5;
//  }
//}
</style>


