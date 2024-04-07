

<template>
<div class="vue-split-container">
    <!-- 整个页面分为15、65、20 -->
    <SplitWrapper :sizes="[15, 65, 20]" :minSize="0" class="vue-split horizontal">
      <!-- 15 -->
      <SplitItem class="vue-split-item">
            <div class="vue-split-content nested-content-1">
              
            </div>
          </SplitItem>

      <!-- 65的分成70和30 -->
      <SplitItem class="vue-split-item">
        <SplitWrapper :sizes="[70, 30]" :minSize="0" direction="vertical" class="vue-split vertical">

          <!-- 70 -->
          <SplitItem class="vue-split-item">
            <div class="vue-split-content nested-content-2">
            </div>
          </SplitItem>

          <!-- 30 -->
          <SplitItem class="vue-split-item">
            <div class="vue-split-content nested-content-2">
            </div>
          </SplitItem>

        </SplitWrapper>
      </SplitItem>

      <!-- 20 -->
      <SplitItem class="vue-split-item">
            <div class="vue-split-content nested-content-1">
            </div>
          </SplitItem>

    </SplitWrapper>
  </div>
</template>

<script setup lang="ts">

import { SplitWrapper, SplitItem } from 'vue3-split'


</script>

<style>
.vue-split-container {
  height: 256px;
  border: 4px dashed rgba(229, 231, 235, 0.4);
  border-radius: 0.5rem;
}

.vue-split {
  height: 100%;
}

.vue-split.horizontal {
  display: flex;
  flex-direction: row;
}

.vue-split.horizontal .vue-split-content {
  height: 100%;
  
}

.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-horizontal {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
  cursor: col-resize;
}

.gutter.gutter-vertical {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  cursor: row-resize;
}

.vue-split-item {
  height: 100%;
  overflow: hidden;
}

.vue-split-content {
  padding: 16px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.nested-content-1 {
  background: rgba(0, 256, 0, .5);
}

.nested-content-2 {
  background: rgba(0, 0, 256, .5);
}
</style>