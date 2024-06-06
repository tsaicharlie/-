import { ref, computed ,reactive} from 'vue'
import { defineStore } from 'pinia'

//id值(建議跟檔案名一樣)
export const useDataStore = defineStore('data', () => {
  let showHome = ref(true);
  let isLogin=ref(false)
  
  return {showHome,isLogin}
})
