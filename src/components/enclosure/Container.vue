<template>
  <div class="border-gray-100 bg-white flex flex-col w-[36rem] max-w-xl flex-1  justify-between border-l border-r">
    <slot />
  </div>
  <div class="flex-shrink-0 w-[16rem] overflow-x-hidden">
    <div class="relative">
      <div class="fixed w-full">
        <slot name="aside" />
      </div>
    </div>
  </div>
</template>
