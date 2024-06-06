<script setup>
import { onMounted } from 'vue';



</script>

<template>
    
    <h1 data-type="咖啡">about</h1>
    <h1><img src="https://picsum.photos/300/200/?random=10"></h1>
    <img class="img" data-type="咖啡" src="https://fakeimg.pl/300x200/200">

</template>
<style scoped>
    h1::after{
        content: attr(data-type);
        color: red;
    }

    .img::before{
        content: attr(data-type);
        
    }
</style>
