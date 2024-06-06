<script setup>
import { useDataStore } from '@/stores/data';
import { ref, onMounted, reactive, watch } from 'vue'
let dataList = ref([])
let likedList = ref([])
let dataStore=useDataStore()
onMounted(() => {
    dataList.value = JSON.parse(localStorage.getItem('data'))
    updatelikedList()
    dataStore.isLogin = true
})
function updatelikedList() {
    for (let i = 0; i < dataList.value.length; i++) {
        if (dataList.value[i].liked === true) {
            likedList.value.push(dataList.value[i])
        }
    }
}
function like(e) {
    console.log(e.target.className);
    let id = e.target.parentNode.parentNode.children[0].innerText
    for (let i = 0; i < dataList.value.length; i++) {
        if (dataList.value[i].Id === id) {
            if (e.target.className.baseVal.includes('color2')) {
                dataList.value[i].liked = false
            }
            else {
                dataList.value[i].liked = true
            }
        }
    }
    localStorage.setItem('data', JSON.stringify(dataList.value))

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
watch(() => dataList, updatelikedList)
</script>
<template>

    <div class="foodcard" v-for="item in likedList" :key="item.Id">
        <div v-show="false">{{ item.Id }}</div>
        <div class="img-container">
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
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                            <button @click="commit" type="button" class="btn btn-primary">提交</button>
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
            <font-awesome-icon :icon="['far', 'heart']" :class="item.liked ? 'color2' : 'color'" />
        </span>

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

.wrapper {
    width: 100%;
    /* display: flex; */
}

.img-container {
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
    font-weight: bolder
        /* font-family: '手寫'; */
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
    height: 70px;
}

.googlemap svg {
    position: static;
    margin-left: 10px;
    color: #4a95ca;
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
        margin: 0 auto;
        margin-top: 20px;
        position: relative;
        background-color: #fff;
    }


    .img-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 0px;
        margin: 0;
    }

    .wrapperout {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

    }
}
</style>
