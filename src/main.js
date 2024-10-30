import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import VueLuckyCanvas from '@lucky-canvas/vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const app = createApp(App)
// 引入 VueLuckyCanvas 插件
app.use(VueLuckyCanvas);
app.use(ElementPlus);
app.mount('#app')
