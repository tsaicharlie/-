<script setup>
import { useRoute } from 'vue-router';
import axios from 'axios';
import { reactive, ref, watch, onMounted } from 'vue';
import { useDataStore } from '@/stores/data';
import { icon } from '@fortawesome/fontawesome-svg-core';


let dataStore = useDataStore()
let placeList = ref([])
let searchedList = ref([])
const route = useRoute()
const next = ref()
const h5 = ref()
const h6 = ref()
let comment = ref('')


// console.log(date.toLocaleString());
onMounted(() => {
    // commentInput.value.focus()
    placeList.value = JSON.parse(localStorage.getItem('data'))
    updateSearchedList()
    next.value.click()
    let count = 1
    let count2 = 1
    //動畫
    h5.value.addEventListener('animationend', () => {

        h5.value.style.animationPlayState = 'paused';

        h5.value.style.animationIterationCount = count;
        setTimeout(() => {
            h5.value.style.animationPlayState = 'running';
            ++count
            h5.value.style.animationIterationCount = count;

            // h5.value.style.animationIterationCount= 'infinite';
        }, 5000); // Delay in milliseconds
    })
    h6.value.addEventListener('animationend', () => {

        h6.value.style.animationPlayState = 'paused';

        h6.value.style.animationIterationCount = count2;
        setTimeout(() => {
            h6.value.style.animationPlayState = 'running';
            ++count2
            h6.value.style.animationIterationCount = count2;


        }, 5000); // Delay in milliseconds
    })
    dataStore.isLogin = true
})


function updateSearchedList() {
    if (route.query.text) {
        searchedList.value = placeList.value.filter(place => place.Description.includes(route.query.text));
    }
    // else if(route.query.city){
    //     searchedList.value = placeList.value.filter(city => city.Region === (route.query.city));
    // }
    else if (route.query.city && route.query.place) {
        searchedList.value = placeList.value.filter(place => place.Town === (route.query.place));
    }



}
let color = ref('color')
let color2 = ref('color2')
function like(e) {

    let id = e.target.parentNode.parentNode.children[0].innerText
    for (let i = 0; i < placeList.value.length; i++) {
        if (placeList.value[i].Id === id) {
            if (e.target.className.baseVal.includes('color2')) {
                placeList.value[i].liked = false
            }
            else {
                placeList.value[i].liked = true
            }
        }
    }
    localStorage.setItem('data', JSON.stringify(placeList.value))
    // console.log(placeList.value);

}
function commit(e) {
    let date = new Date()
    let name = e.target.parentNode.parentNode.children[1].children[0].innerText
    console.log(e.target.parentNode.parentNode.children[1].innerText);
    for (let i = 0; i < placeList.value.length; i++) {
        if (placeList.value[i].Name === name) {
            placeList.value[i].Comments.push([comment.value, date.toLocaleString()])

            console.log(placeList.value[i]);
        }

    }

    localStorage.setItem('data', JSON.stringify(placeList.value))
    comment.value = ''

}

watch(() => route.query.text, updateSearchedList);
watch(() => route.query.place, updateSearchedList);

</script>
<template>
    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
            <h5 ref="h5">發現台灣 </h5>
            <h6 ref="h6">好味道</h6>
            <!-- <p>Some representative placeholder content for the third slide.</p> -->
            <div class="carousel-item active">
                <img src="../../public/img/街道1.jpg" class="d-block w-100">
            </div>
            <div class="carousel-item">
                <img src="../../public/img/街道2.jpg" class="d-block w-100">
            </div>
            <div class="carousel-item">
                <img src="../../public/img/街道3.jpg" class="d-block w-100">
            </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button ref="next" class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
    </div>
    <!-- <iframe v-show="route.query.city === '臺北市'" width="100%" height="100%" frameborder="0"
        src="https://lottie.host/embed/6ce0de72-8e17-4955-a087-e8e1df95c0f4/ovGdDBOpXd.json"></iframe> -->
    <h1 v-show="route.query.city === '臺北市'" class="error">找不到您要的資料</h1>
    <div class="wrapperout">
        <div class="foodcard" v-for="item in searchedList" :key="item.Id">
            <div v-show="false">{{ item.Id }}</div>
            <div class="imgcontainer">
                <img v-if="item.Picture1 === ''" src="../../public//img/餐廳.jpg" alt="">
                <img v-if="item.Picture1 !== ''" :src="item.Picture1" alt="">
            </div>
            <div class="text-container">
                <h1> {{ item.Name }}</h1>
                <h2> {{ item.Description }}</h2>
                <h3> {{ item.Add }}<a target="_blank" class="googlemap"
                        :href="`https://www.google.com/maps/search/?api=1&query=${item.Name}`"><font-awesome-icon
                            :icon="['fas', 'location-dot']" /></a></h3>
                <h3> {{ item.Tel }}</h3>

                <div class="modal fade modal-dialog-scrollable" :id="item.Id" tabindex="-1"
                    aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header" style="background-color:#4a95ca ;">

                                <h1 class="modal-title " id="exampleModalLabel" style="font-size: 60px;color: white;">
                                    留言區</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <h1 v-show="false" class="name">{{ item.Name }}</h1>
                                <h1 class="comments" v-for="(i) in item.Comments">
                                    {{ i[0] }}
                                    <span class="time">{{ i[1] }}</span>
                                    <hr>
                                </h1>


                            </div>
                            <div class="modal-footer">
                                <h1>留下評論:</h1>
                                <input autofocus style="width: 84%;" v-model="comment" type="text">
                                <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> -->
                                <button @click="commit" type="button" class="btn submit">提交</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="comment" type="button" data-bs-toggle="modal" :data-bs-target="'#' + item.Id" aria-expanded="false"
                aria-controls="collapseExample">

                <font-awesome-icon :icon="['far', 'comment']" />
                <span class="badge">{{ item.Comments.length }}</span>
            </div>

            <span @click="like">
                <font-awesome-icon :icon="['far', 'heart']" :class="item.liked ? color2 : color" />
            </span>

        </div>
    </div>

</template>
<style scoped>
@font-face {
    font-family: '手寫';
    src: url('../../public/ChenYuluoyan-Thin.ttf');
}

@font-face {
    font-family: '粉圓';
    src: url('../../public/粉圓體.tft');
}

.wrapperout {
    width: 100%;
    /* display: flex; */
}

.imgcontainer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 50px;
}

.text-container {
    text-wrap: wrap;

}

img {
    width: 300px;
    height: 300px;
    object-fit: cover;
    border-radius: 10px;
}

h1 {
    font-size: 40px;
    color: #4a95ca;
    /* font-family:; */
}

h2 {
    font-weight: 700;
    font-family: '粉圓';
    padding-right: 30px;
    font-size: 22px;
    margin-bottom: 20px;
}

h3 {
    margin-bottom: 30px;

}

.foodcard {
    width: 90%;
    display: flex;
    padding: 20px;
    /* border: 1px solid #4a95ca; */
    border-radius: 20px;
    margin-left: 20px;
    margin-top: 20px;
    box-shadow: 0 0 10px #4a95ca;
    position: relative;
    background-color: #fff;
}

span {
    font-size: 50px;
    position: absolute;
    right: 20px;
    bottom: 10px;
    cursor: pointer;
}

svg {
    /* color: red; */
    position: absolute;
    right: 0;
    bottom: 0;
}

.color {
    color: rgb(0, 0, 0);
}

.color2 {
    color: red;
}

#carouselExampleAutoplaying {
    margin-top: 3%;
    width: 90%;
    margin-left: 20px;
    border: 2px solid white;
    box-shadow: 0 0 5px 1px rgb(154, 153, 153), 0 0 8px 1px rgb(200, 198, 198);
    border-radius: 10px;
    /* height: 500px; */
}

.carousel-item img {
    height: 400px;
    filter: grayscale(0.1);
    /* scale: 0.5; */
}

.carousel-inner {
    position: relative;
}

h5 {
    font-family: '手寫';
    position: absolute;
    z-index: 5;
    top: 20px;
    left: 20px;
    font-size: 80px;
    color: white;
    font-weight: 900;
    animation: fadeInUp 2s ease-in forwards;
    /* animation-delay: 5s; */
}

h6 {
    font-family: '手寫';
    position: absolute;
    z-index: 5;
    top: 120px;
    left: 20px;
    font-size: 80px;
    color: white;
    font-weight: 900;
    animation: fadeInUp 2s ease-in forwards;
    /* animation-delay: 1s; */

}

#comment {
    font-size: 50px;
    position: absolute;
    right: 80px;
    bottom: 10px;
    cursor: pointer;
    margin-right: 20px;
}

.card {
    margin-top: 200px;
}

.badge {
    height: 30px;
    position: absolute;
    right: -10px;
    top: -60px;
    text-align: center;
    line-height: 15px;
    background-color: #4a95ca;
    font-size: 20px;
}

.comments {
    position: relative;
    word-wrap: break-word;
    width: 100%;

}

.modal-body {
    width: 100%;
}

.time {
    /* position: static; */
    font-size: 15px;
    color: black;
    cursor: auto;
    bottom: 0px;
}

.modal-footer {
    justify-content: flex-start;
}

.modal-footer input {
    height: 40px;
}

.googlemap svg {
    position: static;
    margin-left: 10px;
    color: #4a95ca;
}

.submit {
    background-color: #4a95ca;
    color: white
}

@media screen and (max-width:768px) {
    .foodcard {
        width: 95%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        border-radius: 20px;
        margin-left: 0px;
        margin-top: 20px;
        box-shadow: 0 0 10px #4a95ca;
        position: relative;
        background-color: #fff;
    }

    #carouselExampleAutoplaying {
        margin-top: 5%;
        width: 95%;
        margin: 0 auto;
        border: 2px solid white;
        box-shadow: 0 0 5px 1px rgb(154, 153, 153), 0 0 8px 1px rgb(200, 198, 198);
        border-radius: 10px;
        /* height: 500px; */
    }
    .imgcontainer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0px;
    }
    .wrapperout {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    }
}
</style>
