<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios';
import { useDataStore } from './stores/data';
import 'animate.css';
import * as echarts from 'echarts';

let inputFile = ref()
let dataStore = useDataStore()
let placeList = reactive([])
let name = ref('root')
let email = ref('root@gmail.com')
let myChart
let img = ref()
if (!localStorage.getItem('data')) {
  console.log('getdata');
  getData()
}
async function getData() {
  const data = await axios.get('https://media.taiwan.net.tw/XMLReleaseALL_public/restaurant_C_f.json')
  placeList = data.data.XML_Head.Infos.Info
  // dataStore.dataList = data.data.XML_Head.Infos.Info
  for (let i = 0; i < placeList.length; i++) {
    placeList[i].Comments = []
  }
  localStorage.setItem('data', JSON.stringify(placeList))
  console.log(data.data.XML_Head.Infos.Info);

}

onMounted(() => {
  placeList = JSON.parse(localStorage.getItem('data'))
  console.log(placeList);


})

//縣市搜尋
let isSearching = ref(false)
const pulldown = ref()

function pull() {
  isSearching.value = !isSearching.value
  if (isSearching.value) {
    pulldown.value.style.rotate = '180deg'
  } else {
    pulldown.value.style.rotate = '0deg'
  }
}
//區域搜尋
const placePulldown = ref()
let isSearchingPlace = ref(false)
function placePull() {

  isSearchingPlace.value = !isSearchingPlace.value
  if (isSearchingPlace.value) {
    placePulldown.value.style.rotate = '180deg'
  } else {
    placePulldown.value.style.rotate = '0deg'
  }

}
//選擇城市事件回調
let city = ref('選擇城市')
let place = reactive([])
let prev = 0
function selectCity(e) {
  if (prev) {
    prev.style.backgroundColor = 'white'
    prev.style.color = '#659dd9'
  }
  if (e.target.className === '') {

    city.value = e.target.innerText
    e.target.style.color = 'white'
    e.target.style.backgroundColor = ' #659dd9'
  }
  prev = e.target
  //計算屬性  
  place = computed(() => {
    let arr = []
    for (let i = 0; i < placeList.length; i++) {
      if (placeList[i].Region === city.value) {
        arr.push(placeList[i].Town)
      }
    }

    //去除空值&重複
    arr = arr.filter(item => item)
    return [...new Set(arr)]
  })

}
let placePrev = 0
let selectedPlace = ref('選擇區域')
function selectPlace(e) {
  if (placePrev) {
    placePrev.style.color = ' #659dd9'
    placePrev.style.backgroundColor = 'white'
  }
  if (e.target.className === 'place') {
    selectedPlace.value = e.target.innerText
    e.target.style.color = 'white'
    e.target.style.backgroundColor = ' #659dd9'

  }
  placePrev = e.target
}
function handleClick() {
  dataStore.showHome = true
}
function search() {

  setTimeout(() => {
    city.value = '選擇城市'
    selectedPlace.value = '選擇區域'
  }, 200)

}
function logOut() {
  dataStore.isLogin = false
}

function upload() {
  if (inputFile.value.files && inputFile.value.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      img.value.setAttribute("src", e.target.result)
      localStorage.setItem('imgSrc', JSON.stringify(e.target.result))
    }

    reader.readAsDataURL(inputFile.value.files[0]);

  }
  // let src = URL.createObjectURL(inputFile.value.files[0])
  // img.value.src = src


}
let eggContainer = ref()
let left = ref()
let right = ref()
let egg = ref()
let clickedEgg = false
function transformFonSize(fontSize) {
  let width = window.screen.width
  let ratio = width / 1920
  return parseInt(fontSize * ratio)
}
function clickEgg() {
  placeList = JSON.parse(localStorage.getItem('data'))
  // img.value.src = JSON.parse(localStorage.getItem('imgSrc'))
  // console.log( JSON.parse(localStorage.getItem('imgSrc')));
  //echart data
  let liked = []
  for (let i = 0; i < placeList.length; i++) {
    if (placeList[i].liked === true) {
      liked.push(placeList[i].Region)
    }
  }
  const total_count = liked.reduce((obj, item) => {
    if (item in obj) {
      obj[item]++
    } else {
      obj[item] = 1
    }
    return obj
  }, {})
  console.log(total_count)
  let key = ref([])
  let value = ref([])
  for (let k in total_count) {
    key.value.push(k)
    value.value.push(total_count[k])
  }

  myChart = echarts.init(document.getElementById('chartContainer'));
  window.addEventListener('resize', function () {
    myChart.resize();
  });
  myChart.setOption({
    title: {
      text: '收藏餐廳縣市分布',
      textStyle: {
        fontSize: window.screen.width<768 ? transformFonSize(60):transformFonSize(40)
      }
    },
    xAxis: {
      data: key.value,
      axisLabel: {
        fontSize:window.screen.width<768 ? transformFonSize(50):transformFonSize(25)
      }
    },
    yAxis: {
      interval: 1,
      axisLabel: {
        fontSize: window.screen.width<768 ? transformFonSize(50):transformFonSize(25)
      }
    },
    series: [
      {
        name: '數量',
        type: 'bar',
        data: value.value
      }
    ],

  });
  if (!clickedEgg) {
    eggContainer.value.style.clipPath = "circle(100%)"
    left.value.style.transform = "rotate(45deg)"
    right.value.style.transform = "rotate(-45deg)"
    egg.value.style.transform = "translateY(0px) scale(1)"
  } else {
    if (window.screen.width < 768) {
      eggContainer.value.style.clipPath = "circle(5% at 95% 7%)"
      left.value.style.transform = "rotate(0)"
      right.value.style.transform = "rotate(0)"
      egg.value.style.transform = "translateY(-350px) scale(0)"
    } else {
      eggContainer.value.style.clipPath = "circle(5% at 95% 10%)"
      left.value.style.transform = "rotate(0)"
      right.value.style.transform = "rotate(0)"
      egg.value.style.transform = "translateY(-350px) scale(0)"
    }

  }
  clickedEgg = !clickedEgg
}
let isEdit = ref(false)
function edit() {
  isEdit.value = true
}
function submit() {
  isEdit.value = false
}

// 基于准备好的dom，初始化echarts实例

// 绘制图表

</script>

<template>
  <div ref="eggContainer" class="egg-container" v-show="dataStore.isLogin">
    <div class="userinfo-container">
      <div class="user-container">
        <img class="user-img" ref="img" src="../public/img/user.png" alt="image">
        <label id="upload" for="inputFile">Upload</label>
        <input @change="upload" id="inputFile" ref="inputFile" type="file" accept="image/jpeg , image/png ,image/jpg">
      </div>
      <div class="info-container">
        <div v-show="!isEdit">{{ name }}</div>
        <label v-show="isEdit" for="name">name:</label>
        <br>
        <input v-show="isEdit" id="name" v-model="name" type="text" :placeholder="name">
        <br>
        <div v-show="!isEdit">{{ email }}</div>
        <label v-show="isEdit" for="email">email:</label>
        <br>
        <input v-show="isEdit" id="email" v-model="email" type="text" :placeholder="email">
        <div v-show="!isEdit" @click="edit" class="edit">Edit</div>
        <div v-show="isEdit" @click="submit" class="edit">Submit</div>
      </div>
    </div>

    <div id="chartContainer"></div>
    <svg @click="clickEgg" id="EGG" xmlns="http://www.w3.org/2000/svg" width="150" height="402" viewBox="0 0 425 702"
      fill="none">
      <g id="Group 1">
        <g ref="egg" id="egg">
          <path id="Star 1"
            d="M228.892 459.631L284.112 503.103C288.291 506.392 293.154 508.701 298.345 509.858L355.302 522.56C376.261 527.234 383.249 553.59 367.359 568.034L348.212 585.439C341.317 591.706 337.163 600.433 336.645 609.736L334.853 641.947C333.97 657.807 319.428 669.333 303.785 666.57L218.673 651.541C214.589 650.819 210.411 650.819 206.327 651.541L121.215 666.57C105.572 669.333 91.0302 657.807 90.1475 641.947L88.3549 609.736C87.8371 600.433 83.6829 591.706 76.7884 585.439L57.641 568.034C41.7509 553.59 48.7389 527.234 69.698 522.56L126.655 509.858C131.846 508.701 136.709 506.392 140.888 503.103L196.108 459.631C205.725 452.061 219.275 452.061 228.892 459.631Z"
            fill="white" stroke="#B6B6B6" stroke-width="9" />
          <g id="Ellipse 2" filter="url(#filter0_d_1_18)">
            <ellipse cx="210.5" cy="562.5" rx="65.5" ry="43.5" fill="#FAF118" />
            <path
              d="M273.5 562.5C273.5 573.412 266.84 583.601 255.432 591.177C244.043 598.74 228.165 603.5 210.5 603.5C192.835 603.5 176.957 598.74 165.568 591.177C154.16 583.601 147.5 573.412 147.5 562.5C147.5 551.588 154.16 541.399 165.568 533.823C176.957 526.26 192.835 521.5 210.5 521.5C228.165 521.5 244.043 526.26 255.432 533.823C266.84 541.399 273.5 551.588 273.5 562.5Z"
              stroke="#E1E447" stroke-width="5" />
          </g>
        </g>
        <path ref="right" id="right"
          d="M157 95L197 7C249.333 23.6667 352.4 85.6 346 200C339.6 314.4 266.667 344.333 231 345L157 271L225 200L157 95Z"
          fill="#FFFDFD" stroke="black" stroke-width="10" />
        <path ref="left" id="left"
          d="M160 92L196 8.00001C152.8 -7.19999 110.667 39.6667 95 65C77.3333 98.3333 52.6 186.2 95 271C137.4 355.8 202.667 354.333 230 343L160 271L225 198L160 92Z"
          fill="#FFFEFE" stroke="black" stroke-width="10" />
      </g>
      <defs>
        <filter id="filter0_d_1_18" x="141" y="519" width="139" height="95" filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha" />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_18" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_18" result="shape" />
        </filter>
      </defs>
    </svg>
  </div>
  <nav class="navigation" v-show="dataStore.isLogin">

    <RouterLink to="/home" @click="handleClick">
      <svg height="10%" width="55%" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve">
        <g>
          <path class="fork" style="fill:#66C6FE;" d="M41.514,87.173c-4.585,0-8.303,3.717-8.303,8.303v84.134h16.605V95.476
		C49.816,90.89,46.099,87.173,41.514,87.173z" />
          <path class="fork" style="fill:#66C6FE;" d="M74.724,87.173c-4.585,0-8.303,3.717-8.303,8.303v84.134l16.605-34.871V95.476
		C83.027,90.89,79.31,87.173,74.724,87.173z" />
          <path class="fork" style="fill:#66C6FE;" d="M8.303,87.173C3.717,87.173,0,90.89,0,95.476v49.263l16.605,34.871V95.476
		C16.605,90.89,12.888,87.173,8.303,87.173z" />
          <path class="earth" style="fill:#66C6FE;"
            d="M428.212,239.922l-42.243-96.47c-24.139-26.979-56.82-46.144-93.801-53.24
		c0,0-0.053,331.041,0,331.566C370.095,406.825,428.973,338.289,428.973,256C428.973,250.577,428.716,245.206,428.212,239.922z" />
        </g>
        <path class="earth" style="fill:#99D9FF;" d="M362.012,143.452c-18.244-25.189-42.522-43.562-70.037-51.676l-63.841-1.553
	c-23.603,4.523-45.459,13.966-64.452,27.226l-70.23,111.754c-1.404,8.726-2.122,17.676-2.122,26.797
	c0,8.307,0.6,16.486,1.769,24.471l43.743,90.82c23.871,25.532,55.577,43.637,91.292,50.496c0-0.011,63.841-1.565,63.841-1.565
	c60.133-17.718,104.841-84.529,104.841-164.223L362.012,143.452z" />
        <path class="earth" style="fill:#668A30;" d="M385.979,143.442c-0.011,0.011-23.967,0.011-23.967,0.011l34.804,112.548h15.317
	c8.886,0,16.078-7.203,16.078-16.078C424.729,203.017,409.358,169.563,385.979,143.442z" />
        <g>
          <path class="earth" style="fill:#CCECFF;" d="M291.975,420.223l-30.056,4.588c10.333-0.107,20.441-1.136,30.248-3.022
		C292.115,421.253,292.061,420.738,291.975,420.223z" />
          <path class="earth" style="fill:#CCECFF;" d="M261.92,87.189l30.056,4.588c0.086-0.515,0.139-1.028,0.193-1.554
		C282.361,88.325,272.253,87.297,261.92,87.189z" />
        </g>
        <g>
          <path class="earth" style="fill:#FEFDCA;" d="M291.975,91.777c-2.218,15.575-15.628,27.558-31.824,27.558c-16.732,0-30.484-12.787-32.017-29.113
		c10.365-2.005,21.073-3.044,32.017-3.044c0.59,0,1.179,0,1.769,0.011C272.253,87.35,282.317,88.936,291.975,91.777z" />
          <path class="earth" style="fill:#FEFDCA;"
            d="M260.151,392.665c16.196,0,29.605,11.984,31.824,27.558c-9.658,2.841-19.723,4.427-30.056,4.588
		c-0.59,0.011-1.179,0.011-1.769,0.011c-10.944,0-21.652-1.039-32.017-3.033C229.667,405.453,243.42,392.665,260.151,392.665z" />
        </g>
        <g>
          <path class="earth" style="fill:#84B044;" d="M110.087,272.078c-6.903,0-13.026,3.278-16.947,8.346c-0.014,0.018-0.029,0.029-0.042,0.047
		c5.059,34.868,20.773,66.274,43.743,90.82c0.001-0.001,23.933-29.069,23.933-29.069c7.495-9.102,13.626-26.197,13.626-37.988
		v-32.157h-64.313V272.078z" />
          <path class="earth" style="fill:#84B044;" d="M93.452,229.203h53.624v10.718c0,4.585,3.717,8.303,8.303,8.303c4.585,0,8.303-3.717,8.303-8.303
		V117.449C126.895,143.099,100.805,183.026,93.452,229.203z" />
          <path class="earth" style="fill:#84B044;" d="M335.182,220.899c-4.586,0-8.303,3.717-8.303,8.303v23.854h-74.531
		c-13.456,0-24.355,10.899-24.355,24.355c0,13.456,10.899,24.355,24.355,24.355h7.802v39.985c0,11.791,9.647,21.438,21.438,21.438
		h37.516v-93.526h16.077c4.586,0,8.303-3.717,8.303-8.303v-32.157C343.485,224.617,339.769,220.899,335.182,220.899z" />
        </g>
        <g>
          <path class="earth" style="fill:#668A30;" d="M351.262,348.252c-4.586,0-8.303-3.717-8.303-8.303v-11.07c0-4.585,3.716-8.303,8.303-8.303
		s8.303,3.717,8.303,8.303v11.07C359.565,344.536,355.847,348.252,351.262,348.252z" />
          <path class="earth" style="fill:#668A30;" d="M238.714,173.368c-4.585,0-8.303-3.717-8.303-8.303v-11.07c0-4.585,3.717-8.303,8.303-8.303
		c4.585,0,8.303,3.717,8.303,8.303v11.07C247.016,169.652,243.299,173.368,238.714,173.368z" />
        </g>
        <path class="earth" style="fill:#84B044;" d="M396.816,256c0-43.239-13.163-82.674-34.804-112.548h-58.986c-4.586,0-8.303,3.717-8.303,8.303
	c0,4.585,3.716,8.303,8.303,8.303h16.077v18.802h-10.719c-8.875,0-16.078,7.203-16.078,16.078h-43.225v24.908h-10.367
	c-4.585,0-8.303,3.717-8.303,8.303c0,4.585,3.717,8.303,8.303,8.303h120.323v46.346c0,4.585,3.716,8.303,8.303,8.303
	s8.303-3.717,8.303-8.303V256H396.816z" />
        <polygon class="knife" style="fill:#66C6FE;"
          points="511.989,267.065 511.989,300.276 495.384,330.73 478.778,300.276 478.778,250.47 " />
        <g>
          <path class="knife" style="fill:#99D9FF;" d="M511.989,300.276v107.946c0,9.166-7.439,16.605-16.605,16.605c-9.166,0-16.605-7.439-16.605-16.605
		V300.276H511.989z" />
          <path class="knife" style="fill:#99D9FF;" d="M487.092,87.173c-13.757,0-24.908,11.152-24.908,24.908v130.076
		c0,13.757,11.151,24.908,24.908,24.908H512c0-71.9,0-154.984,0-154.984C512,98.325,500.849,87.173,487.092,87.173z" />
          <path class="fork" style="fill:#99D9FF;" d="M0,144.738v18.271c0,17.022,10.249,31.642,24.908,38.05v207.151c0,9.171,7.435,16.605,16.605,16.605
		s16.605-7.435,16.605-16.605V201.059c14.659-6.407,24.908-21.028,24.908-38.05v-18.271H0z" />
        </g>
      </svg>
    </RouterLink>
    <li>

      <div class="search-container">
        <div class="search">
          {{ city }}
          <span @click="pull" ref="pulldown" id="pulldown">
            <font-awesome-icon :icon="['fas', 'circle-down']" />
          </span>
        </div>
        <transition name="fade">
          <div @click="selectCity" class="show-city" v-show="isSearching">
            <div class="north area-container">
              <div class="title">北部區域</div>
              <div class="north-list list">
                <div>臺北市</div>
                <div>新北市</div>
                <div>基隆市</div>
                <div>桃園市</div>
                <div>新竹市</div>
                <div>新竹縣</div>
              </div>
            </div>
            <div class="central area-container">
              <div class="title">中部區域</div>
              <div class="central-list list">
                <div>苗栗縣</div>
                <div>臺中市</div>
                <div>彰化縣</div>
                <div>彰化市</div>
                <div>南投縣</div>
                <div>雲林縣</div>
              </div>
            </div>
            <div class="south area-container">
              <div class="title">南部區域</div>
              <div class="south-list list">
                <div>嘉義縣</div>
                <div>嘉義市</div>
                <div>臺南市</div>
                <div>高雄市</div>
                <div>屏東縣</div>
              </div>
            </div>
            <div class="east area-container">
              <div class="title">東部</div>
              <div class="east-list list">
                <div>花蓮縣</div>
                <div>臺東縣</div>
              </div>
            </div>
            <div class="outer area-container">
              <div class="title">離島</div>
              <div class="outer-list list">
                <div>金門縣</div>
                <div>連江縣</div>
              </div>
            </div>
          </div>
        </transition>

      </div>
      <div class="searchplace-container">
        <div class="search">
          {{ selectedPlace }}
          <span @click="placePull" ref="placePulldown" id="pulldown">
            <font-awesome-icon :icon="['fas', 'circle-down']" />
          </span>
        </div>
        <transition name="place-fade">
          <div @click="selectPlace" class="showplace" v-show="isSearchingPlace">

            <div class="place " v-for="(p, index) in place" :key="index">
              {{ p }}
            </div>
          </div>
        </transition>
      </div>
      <router-link :to="`/search?city=${city}&place=${selectedPlace}`">
        <div @click="search" id="send"><font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </div>
      </router-link>



    </li>
    <RouterLink to="/liked">
      <span style=" font-size: 30px; line-height: 50px; color: #659dd9;
  opacity: 0.7; ">我的收藏 &nbsp</span>
      <font-awesome-icon style="color: red;" :icon="['fas', 'heart']" />
    </RouterLink>
    <RouterLink to="/">
      <nav v-show="dataStore.isLogin" class="nav">
        <!-- <span>root 你好</span> -->

        <div class="logout" @click="logOut">登出</div>

      </nav>
    </RouterLink>
  </nav>
  <div class="wrapperout">



    <RouterView />
  </div>


</template>

<style scoped>
* {
  margin: 0;
  padding: 0;

}


li {
  list-style: none;
}

body {
  background-color: #dbecff;
}

.navigation {
  width: 20%;
  min-height: 100vh;
  background-color: rgb(255, 255, 255);
  font-size: 12px;
  text-align: center;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  box-shadow: 0 0 10px #4a95ca;
  padding-top: 20px;
  margin-left: 3%;
}

.wrapperout {
  width: 70%;
  height: 100%;
  /* background-color: rgb(219, 236, 255); */
  position: absolute;
  /* right: 0; */
  left: 25%;

}

.navigation>a {
  width: 100%;
  font-size: 2.5rem;
  display: block;
}

.navigationv>li {
  width: 100%;
  font-size: 2.5rem;
  display: block;
  margin: 50px auto;
}

/* .navigation a.router-link-exact-active {
  color: rgb(75, 26, 211);
} */

/* .navigation a:hover {
  background-color: rgb(154, 160, 223);
} */

.search-container {
  margin-bottom: 20px;
  position: relative;
}

.search {
  width: 80%;
  height: 50px;
  border-radius: 20px;
  border: 1px solid #4864d4;
  margin: 0 auto;
  position: relative;
  font-size: 30px;
  line-height: 50px;
  color: #659dd9;
  opacity: 0.7;
}

#pulldown {
  /* font-size: 0px; */
  line-height: 50px;
  position: absolute;
  right: 10px;
  top: 0;
  cursor: pointer;
  transition: all .5s;
}

.show-city {
  width: 90%;
  background-color: aliceblue;
  overflow-y: scroll;
  height: 500px;
  border-radius: 20px;
  margin-top: 10px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.showplace {
  overflow-y: scroll;
  width: 90%;
  background-color: aliceblue;
  overflow-y: scroll;
  height: 450px;
  border-radius: 20px;
  margin-top: 10px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  cursor: pointer;
}

.place {
  border: 2px solid #4a95ca;
  border-radius: 20px;
  padding: 10px;
  font-size: 20px;
  color: #659dd9;
  margin: 20px 5px;
  height: 50px;

}

.show-city::-webkit-scrollbar {
  display: none;
}

.showplace::-webkit-scrollbar {
  display: none;
}

.navigation::-webkit-scrollbar {
  display: none
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0px)translateX(-50%);
}

.fade-leave-to,
.fade-enter-from {
  opacity: 0;
  transform: translateY(-20px)translateX(-50%);
}

.searchplace-container {
  position: relative;
}

.place-fade-enter-active,
.place-fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.place-fade-enter-from,
.place-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px)translateX(-50%);
}

.place-fade-enter-to,
.place-fade-leave-from {
  opacity: 1;
  transform: translateY(0px)translateX(-50%);
}

.area-container {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 40px;
}

.title {
  color: #4a95ca;
  font-size: 30px;
}

.title::after {
  content: '';
  width: 90%;
  display: block;
  border-bottom: 2px solid #4864d4;
  margin: 0 auto;
}

.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  cursor: pointer;
}

.list>div {
  border: 2px solid #4a95ca;
  border-radius: 20px;
  padding: 10px;
  font-size: 20px;
  color: #659dd9;
  margin: 20px 5px;
}

#send {
  width: 80%;
  height: 50px;
  border-radius: 20px;
  background-color: #659dd9;
  border: 1px solid #4864d4;
  margin: 0 auto;
  position: relative;
  font-size: 30px;
  line-height: 50px;
  color: white;
  margin-top: 20px;
  cursor: pointer;
  margin-bottom: 20px;
}

#send a {
  text-decoration: none;
}

.fork {
  animation: bounce 2s infinite ease-in-out alternate;
  transform-origin: center;
  /* animation: fork 3s infinite ease-in; */
}

.earth {
  animation: swing 3s infinite ease-in;
  /* animation-delay: 3s; */
  transform-origin: center;
}

.knife {
  animation: bounce 2s 1s infinite ease-in-out alternate;
  transform-origin: bottom;
}

svg {
  overflow: visible;
  cursor: pointer;
}

@keyframes fork {
  0% {
    /* transform: translateY(0); */
    transform: rotate(0);
  }

  100% {
    /* transform: translateY(-30px); */
    transform: rotate(45deg);
  }
}

.nav {
  width: 80%;
  height: 50px;
  border-radius: 20px;
  background-color: #659dd9;
  border: 1px solid #4864d4;
  margin: 0 auto;
  position: relative;
  font-size: 30px;
  line-height: 50px;
  color: white;
  margin-top: 20px;
  cursor: pointer;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  margin-top: 70%;
}

.logout {
  font-size: 25px;
  color: white;
  text-align: center;
  margin: 0 auto;


}

#left,
#right,
#egg {
  transition: transform 1s ease-in, scale 1s ease-in;
  position: absolute;
  z-index: 15;
}

svg:hover #left {
  transform: rotate(45deg);
}

svg:hover #right {
  transform: rotate(-45deg);
}

svg:hover #egg {
  transform: translateY(0);
  transform: scale(1);
}

#left {
  transform-origin: top;
}

#right {
  transform-origin: top;
}

#egg {
  transform: translateY(-350px);

  transform: scale(0);
  transform-origin: center;
}

#EGG {
  position: fixed;
  right: 0px;
  top: -40px;
  z-index: 5;
}

a {
  text-decoration: none;
}

.egg-container {
  width: 100vw;
  height: 100%;
  background-color: rgb(247, 245, 88);
  position: fixed;
  z-index: 10;
  clip-path: circle(5% at 95% 10%);
  /* clip-path: circle(100%); */
  transition: all 1.5s ease-in-out;
}


.user-img {
  width: 350px;
  height: 350px;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid #000;
}

.user-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 5%;
  top: 2%;
  align-items: center;
  justify-content: center;
}

input[type=file] {
  display: none;
}

#upload {
  display: block;
  width: 200px;
  padding: 12px;
  margin: 10px auto;
  cursor: pointer;
  color: #fff;
  background-color: orange;
  border-radius: 10px;
  text-align: center;
}



.info-container {
  position: absolute;
  left: 5%;
  top: 50%;
  font-size: 3rem;

}

.edit {
  display: block;
  width: 200px;
  padding: 12px;
  margin: 10px auto;
  cursor: pointer;
  color: #fff;
  background-color: orange;
  border-radius: 10px;
  text-align: center;
  font-size: 16px;
}

#chartContainer {
  position: absolute;
  left: 40%;
  bottom: 10%;
  font-size: 100px;
  width: 800px;
  height: 600px;
}

@media screen and (max-width:768px) {
  .navigation {
    display: flex;
    flex-direction: column;
    width: 100vw;
    min-height: 1vh;
    height: 60vh;
    position: relative;
    margin-left: 0;
    margin-bottom: 3%;
  }

  #Layer_1 {
    /* display: none; */
    width: 50%;
    height: 100%;
    
  }

  .wrapperout {
    width: 100vw;
    height: 100%;
    position: absolute;
    left: 0;
  }

  .nav {

    margin-top: 0%;
  }

  #send {
    margin-bottom: 0;
  }

  #EGG {
    width: 50px;
    position: fixed;
    right: 0px;
    top: -13%;
    z-index: 5;
  }

  #left,
  #right,
  #egg {
    transition: transform 1s ease-in, scale 1s ease-in;
    z-index: 15;
    /* top: 0; */
  }

  .user-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 20px;
    border: 1px solid #000;
  }

  .user-container {
    display: flex;
    position: absolute;
    /* left: 0%; */
    top: 0%;
    align-items: center;
    justify-content: center;
  }

  .info-container {
    position: absolute;
    left: 160px;
    top: 3%;
    font-size: 1.5rem;

  }

  #chartContainer {
    position: absolute;
    left: 5%;
    bottom: 10%;
    font-size: 100px;
    width: 400px;
    height: 500px;
  }

  .userinfo-container {
    display: flex;
    height: 180px;


  }


  br {
    display: none;
  }

  .egg-container {
    width: 100vw;
    height: 100%;
    background-color: rgb(247, 245, 88);
    position: fixed;
    z-index: 10;
    clip-path: circle(5% at 95% 7%);
    /* clip-path: circle(100%); */
    transition: all 1.5s ease-in-out;
  }

  .edit {
    display: block;
    width: 100px;
    padding: 12px;
    margin: 10px auto;
    cursor: pointer;
    color: #fff;
    background-color: orange;
    border-radius: 10px;
    text-align: center;
    font-size: 16px;
  }

  #upload {
    display: block;
    width: 100px;
    padding: 12px;
    margin: 10px auto;
    cursor: pointer;
    color: #fff;
    background-color: orange;
    border-radius: 10px;
    text-align: center;
  }
}
</style>
