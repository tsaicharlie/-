<script setup>
import { ref, onMounted ,nextTick } from 'vue';
import { RouterLink ,RouterView } from 'vue-router';
import { useDataStore } from '@/stores/data';
let dataStore=useDataStore()
const imgContainer=ref()
const img=ref([])
const wrapper=ref()
// const showHome = ref(true);
onMounted(()=>{
  nextTick(()=>{
    img.value=document.getElementsByClassName('wrapper')
    
    ensureImageLoaded().then(() => {
      waterFall();
    });
    
  })
  dataStore.isLogin=true
})
function ensureImageLoaded() {
  const images=img.value
  const promises=[]
  for(let i=0 ;i<images.length;i++){
    const imgElement=images[i].querySelector('img')
    if (!imgElement.complete) {
      promises.push(new Promise((resolve) => {
        imgElement.onload = () => resolve();
      }));
    }
  }

  return Promise.all(promises);
  }

window.addEventListener('resize',waterFall)
function waterFall() {
  wrapper.value=document.getElementsByClassName('wrapper')[0]
  let columCount=parseInt(imgContainer.value.offsetWidth/wrapper.value.offsetWidth)
  const firstRowHeightArray=[] 
  for(let i=0 ;i<img.value.length;i++){
    //第一列 
    if(i<columCount){
      img.value[i].style.top=0
      img.value[i].style.left=(wrapper.value.offsetWidth+(imgContainer.value.offsetWidth-(wrapper.value.offsetWidth*columCount))/4)*i+'px'
      firstRowHeightArray.push(img.value[i].offsetHeight)
    }else{
    //第二列之後
      let minHeight=Math.min(...firstRowHeightArray)
      let index=firstRowHeightArray.indexOf(minHeight)
      img.value[i].style.top=minHeight+8+'px'
      img.value[i].style.left=img.value[index].offsetLeft+'px'
      firstRowHeightArray[index]=firstRowHeightArray[index]+img.value[i].offsetHeight
    }
  }

}
function handleClick(){
 dataStore.showHome=false

}

</script>

<template>
  
    <div  class="imgContainer" ref="imgContainer" v-if="dataStore.showHome">
      <router-link to="/search?text=咖啡" @click="handleClick" >
        <div ref="wrapper" data-type="咖啡" class="wrapper">
          <img  src="../../public/img/coffee.jpg">
        </div>
      </router-link>
      <router-link to="/search?text=牛肉麵" @click="handleClick">
        <div data-type="牛肉麵" class="wrapper">
          <img  src="../../public/img/牛肉麵.jpg">
        </div> 
      </router-link>
      <router-link to="/search?text=日式" @click="handleClick">
        <div data-type="日式" class="wrapper">
          <img  src="../../public/img/日式.jpg">
        </div>
      </router-link>
      <router-link to="/search?text=客家" @click="handleClick">
        <div data-type="客家" class="wrapper">
          <img  src="../../public/img/客家小炒.jpg">
        </div>
      </router-link>
      <router-link to="/search?text=臭豆腐" @click="handleClick">
        <div data-type="臭豆腐" class="wrapper">
          <img  src="../../public/img/臭豆腐.jpg">
        </div> 
      </router-link>
      <router-link to="/search?text=鐵板燒" @click="handleClick">
        <div data-type="鐵板燒" class="wrapper">
          <img  src="../../public/img/鐵板燒.jpg">
        </div>
      </router-link>
      <router-link to="/search?text=早餐" @click="handleClick">
        <div data-type="早餐"  class="wrapper">
          <img src="../../public/img/早餐.jpg">
        </div>
      </router-link>
      <router-link to="/search?text=拉麵" @click="handleClick">
        <div data-type="拉麵" class="wrapper">
          <img  src="../../public/img/拉麵.jpg">
        </div>   
      </router-link>
      <router-link to="/search?text=台菜" @click="handleClick">
        <div data-type="台菜" class="wrapper">
          <img  src="../../public/img/台菜.jpg">
        </div>
      </router-link>
      <router-link to="/search?text=火鍋" @click="handleClick">
        <div data-type="火鍋" class="wrapper">
          <img  src="../../public/img/火鍋.jpg">
        </div>
      </router-link>
      <router-link to="/search?text=酒吧" @click="handleClick">
        <div data-type="酒吧" class="wrapper">
          <img  src="../../public/img/酒吧.jpg">
        </div>
      </router-link>
    </div>
    <router-view v-if="!dataStore.showHome"></router-view>
</template>
<style scoped>
.imgContainer{
  position: relative;
  margin-left: 50px;
  margin-top: 100px;
}
img {
  width: 100%;
  border-radius: 15px;
  transition: all 0.5s;
  
}
.wrapper{
  width: 300px;
  border-radius: 15px;
  overflow: hidden;
  position: absolute;
  display: inline-block;
}
img:hover{
  transform: scale(1.5);
  filter: grayscale(0.4);
}
.wrapper:hover>img{
  transform: scale(1.5);
  filter: grayscale(0.4);
}

.wrapper::before{
  content: attr(data-type);
  font-size: 40px;
  font-weight: 900;
  position: absolute;
  color: aliceblue;
  z-index: 3;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
@media screen and (max-width:768px) {
  .wrapper{
  width: 45%;
  border-radius: 15px;
  overflow: hidden;
  position: absolute;
  display: inline-block;
  margin-left: 10px;
  }
  .imgContainer{
  position: relative;
  margin-left:0px;
  margin-top: 0px;
}
}
</style>