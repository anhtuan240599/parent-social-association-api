<template>
  <div>
    <div>HomePage</div>
    
  </div>
</template>

<script>

import axios from 'axios'

import ref from 'vue'

export default {
  setup(){
      const response = ref([])
      const getAll = async () => {
          try {
              const res = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5')
              console.log(res.data)
              response.value =  res.data
              
          }catch (error) {
              console.log(error)
          }
          
          
      }
      getAll() 
      return {
          getAll
      }
  }
};
</script>
