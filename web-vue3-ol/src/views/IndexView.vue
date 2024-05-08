<template>
    <div class="index">
      <h1>This is an Index page</h1>
    </div>
  
      <div class="page">
        <router-link
                class="one"
                to="/home"
                :class="{ active: $route.path === '/home' }">
                home
                </router-link>
      <router-link
                class="two"
                to="/analysis"
                :class="{ active: $route.path === '/analysis' }">
                analysis
                </router-link>
              <router-link
                class="three"
                to="/river"
                :class="{ active: $route.path === '/river' }">river
              </router-link> 
  
            </div>
  
  </template>
  
  <style>
  @media (min-width: 1024px) {
    .index {
      /* min-height: 100vh; */
      display: flex;
      align-items: center;
    }
    .page {
    font-size: larger;
    }
  }
  
  </style>