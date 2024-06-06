<script setup>
import { RouterLink } from 'vue-router';
import { ref,onMounted } from 'vue';
import { useDataStore } from '@/stores/data';
import router from '@/router';

let dataStore=useDataStore()
onMounted(()=>{
    dataStore.isLogin=false
})
let user=ref('root@gmail.com')
let password=ref('')
function log(){
    if(user.value==="root@gmail.com"&&password.value==='12345'){
        router.push('/home')
        dataStore.isLogin=true
    }else{
        alert('信箱或密碼錯誤')
    }

    
    
}
</script>
<template>
    <div  class="screen-1">
       
        <div class="email">
            <label for="email">Email Address</label>
            <div class="sec-2">
                <!-- <ion-icon name="mail-outline"></ion-icon> -->
                <input v-model="user" autofocus type="email" name="email" placeholder="root@gmail.com" />
            </div>
        </div>
        <div class="password">
            <label for="password">Password</label>
            <div class="sec-2">
                <!-- <ion-icon name="lock-closed-outline"></ion-icon> -->
                <input v-model="password" class="pas" type="password" name="password" placeholder="" />
                <!-- <ion-icon class="show-hide" name="eye-outline"></ion-icon> -->
            </div>
        </div>
        
            <button @click="log" class="login">Login </button>
       

    </div>
</template>
<style scoped>


.screen-1 {  
    width: 50%;
    background: #f1f7fe;
    padding: 2em;
    display: flex;
    flex-direction: column;
    border-radius: 30px;
    box-shadow: 0 0 2em #e6e9f9;
    gap: 2em;
    position: fixed;
    left: 50vw;
    top: 50vh;
    transform: translate(-50%,-70%);
}



.screen-1 .email {
    background: white;
    box-shadow: 0 0 2em #e6e9f9;
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    border-radius: 20px;
    color: #4d4d4d;
    /* margin-top: -3em; */
}

.screen-1 .email input {
    outline: none;
    border: none;
}

.screen-1 .email input::-moz-placeholder {
    color: black;
    font-size: 0.9em;
}

.screen-1 .email input:-ms-input-placeholder {
    color: black;
    font-size: 0.9em;
}

.screen-1 .email input::placeholder {
    color: black;
    font-size: 0.9em;
}



.screen-1 .password {
    background: white;
    box-shadow: 0 0 2em #e6e9f9;
    padding: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    border-radius: 20px;
    color: #4d4d4d;
}

.screen-1 .password input {
    outline: none;
    border: none;
}

.screen-1 .password input::-moz-placeholder {
    color: black;
    font-size: 0.9em;
}

.screen-1 .password input:-ms-input-placeholder {
    color: black;
    font-size: 0.9em;
}

.screen-1 .password input::placeholder {
    color: black;
    font-size: 0.9em;
}


.screen-1 .password .show-hide {
    margin-right: -5em;
}

.screen-1 .login {
    padding: 1em;
    background: #4a95ca;
    color: white;
    border: none;
    border-radius: 30px;
    font-weight: 600;
    width: 100%;
    font-size: 1.5rem
}



button {
    cursor: pointer;
}
@media screen and (max-width:768px) {
    .screen-1 {  
    width: 95%;
    background: #f1f7fe;
    padding: 2em;
    display: flex;
    flex-direction: column;
    border-radius: 30px;
    box-shadow: 0 0 2em #e6e9f9;
    gap: 2em;
    position: fixed;
    left: 50vw;
    top: 50vh;
    transform: translate(-50%,-70%);
}

}
</style>
