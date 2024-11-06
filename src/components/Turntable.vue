<template>
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
<!-- 转盘组件 -->
  <LuckyWheel
      ref="myLucky"
      :width="wheelSize"
      :height="wheelSize"
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
import {ElOption, ElSelect,ElMessage} from 'element-plus';
const myLucky = ref();
const defaultConfig = {
  // gutter: '5px',
  offsetDegree: -20
}
// 计算转盘的尺寸
const wheelSize = computed(() => {
  // 基础尺寸
  const baseSize = 600; // 这个值可以根据你的设计需求调整
  // 每增加一个奖项，转盘尺寸增加的比例
  const incrementPerPrize = 5; // 这个值也可以根据需求调整
  // 计算最终尺寸
  const size = baseSize + (incrementPerPrize * prizes.value.length);
  return `${Math.max(size, 500)}px`; // 最小尺寸限制为300px
});


// 计算block的padding
const blockPadding = computed(() => {
  // 例如，我们假设基础padding是50px，然后根据转盘尺寸按比例放大
  const basePadding = 50;
  const wheelSizeNum = parseInt(wheelSize.value.replace('px', ''));
  const padding = (wheelSizeNum / 500) * basePadding; // 300px是最小尺寸
  return `${padding}px`;
});

// 计算字体大小
const fontSize = computed(() => {
  // 基础字体大小
  const baseFontSize = 14; // px
  const wheelSizeNum = parseInt(wheelSize.value.replace('px', ''));
  const size = (wheelSizeNum / 5) * baseFontSize; // ⅓是根据实际设计调整的比例
  return `${size}px`;
});

// 配置背景
const block = ref([
  {
    padding: blockPadding, // 设置背景块的padding
    // background: '#fff',  // 可以设置一个背景颜色
    imgs: [
      {
        src: "../../public/转盘.png",
        width: '100%',
        height: '100%',
      }
    ]
  }
]);

// 奖项和按钮的配置（与之前相同）
const prizes = ref([
  {
    background: '#ffffff',
    fonts: [{text: '汉堡包', top: '20px', fontColor: '', fontSize}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/lf/preview_sets/previews/LZeaIOpiqps8EFyo.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.1,
  },
  {
    background: '#D6FF63',
    fonts: [{text: '披萨', top: '20px', fontColor: '', fontSize}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/bd/preview_sets/previews/j16p8EXUyNFlSdYH.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.4
  },
  {
    background: '#ffffff',
    fonts: [{text: '冰淇淋', top: '20px', fontColor: '', fontSize}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/ue/preview_sets/previews/tB2cCUuVCod0ZUaT.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.3,
  },
  {
    background: '#D6FF63',
    fonts: [{text: '爆米花', top: '20px', fontColor: '', fontSize}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/dj/preview_sets/previews/TO_4nOeoT4vMoifl.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.1,
  },
  {
    background: '#ffffff',
    fonts: [{text: '美式热狗', top: '20px', fontColor: '', fontSize}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/id/preview_sets/previews/s1SdMQF2JnE61Lck.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.2,
  },
  {
    background: '#D6FF63',
    fonts: [{text: '奶茶', top: '20px', fontColor: '', fontSize}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/dl/preview_sets/thumbs/gufsFj0vR3bMqqRi.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.1,
  },
  {
    background: '#ffffff',
    fonts: [{text: '美式薯条', top: '20px', fontColor: '', fontSize}],
    imgs: [{
      src: 'https://threedio-prod-var-cdn.icons8.com/sm/preview_sets/thumbs/6GojDiUoyDfzxPDi.webp',
      width: '60px',
      top: '50px'
    }],
    probability: 0.2,
  },
  {
    background: '#d6ff63',
    fonts: [{text: '美食炸鸡', top: '20px', fontColor: '', fontSize}],
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
    // background: '#F93D57', // 改为紫色
    imgs: [{
      src: "../../public/箭头.svg",
      width: "140px",
      height: "145px",
      top: "-80px"
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
  ElMessage({
      message: `抽中 ${prize.fonts[0].text}`,
      type: 'success',
  })
}


/**
 *  测试
 * */

const selectedCanteen = ref("");
const selectedCategory = ref("");
const canteens = ref([]);
const categories = ref([]);

const getCanteens = async (target) => {
  try {
    const response = await axios.get('/api/canteen/list');
    console.log(response.data.data);
    canteens.value = response.data.data;
  } catch (error) {
    console.error('Error fetching canteens:', error);
  }
};

const getCategories = async () => {

  if (selectedCanteen.value) {
    try {
      const response = await axios.get(`/api/category/list`);
      categories.value = response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
};

const getShops = async () => {

    try {
      const response = await axios.get(`/api/shop/list?canteenId=${selectedCanteen.value}&categoryId=${selectedCategory.value}`);
      // prizes.value = response.data.map(shop => ({name: shop.name, id: shop.id}));
      // 根据返回的档口信息设置转盘的 prizes 和其他属性
      console.log(response.data);
      console.log(selectedCategory.value);

      prizes.value = response.data.data.map((shop,index) => ({
        background: index % 2 === 0 ? '#ffffff' : '#D6FF63', // 交替背景颜色 // 背景颜色可以根据需要调整
        fonts: [{text: shop.name, top: '20px', fontColor: '#000000', fontSize: '14px'}],
        imgs: [{
          src: shop?.image, // 假设每个店s铺都有一个 image 字段
          width: '60px',
          top: '50px'
        }],
        probability: 1 / prizes.value.length  // 假设每个奖项的概率均等
      }));
    } catch (error) {
      console.error('Error fetching shops:', error);
    }

};

onMounted(() => {
  getCanteens();
  getShops();
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


