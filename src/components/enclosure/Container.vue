<template>
  <div class="border-gray-100 bg-white flex flex-col w-[36rem] max-w-xl flex-1  justify-between border-l border-r">
    <slot />
  </div>
  <div class="flex-shrink-0 w-[16rem] flex flex-col max-h-screen ">
    <div class="relative">
      <div class="sticky top-50">
        <slot name="aside" />
      </div>
    </div>
  </div>
</template>
