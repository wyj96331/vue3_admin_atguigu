<template>
  <div class="logo">
    <img src="../../../public/logo.png" alt="" />
    <P>后台管理系统</P>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: 50px;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 5px;
  img {
    width: 40px;
    height: 40px;
  }
  P {
    font-size: 20px;
    margin-left: 10px;
  }
}
</style>
