<template>
  <div class="overflow-hidden flex flex-1 max-w-xl h-full items-center relative w-full">
    <div class="fixed flex-shrink-0 top-0 max-w-xl bg-white z-20 w-[574px]">
      <div class=" text-lg font-bold text-gray-900 flex items-center  border-b border-gray-100">
        <div class="flex-1 my-3 mx-4 ">
          {{ getTitle }}
        </div>
      </div>
    </div>
    <template v-if="!store.isLoading">
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="filteredToots.length"
          class="flex-1 z-10 pt-12  w-full -mt-1"
        >
          <ul
            role="list"
            class="divide-y divide-gray-200/75"
          >
            <enclosure-toot
              v-for="(toot, index) in filteredToots"
              :key="toot.id"
              :deep-limit="deeplLimit"
              :index="index"
              :toot="toot"
            />
          </ul>
        </div>
        <div
          v-else
          class="w-xl flex-1 w-xl items-center"
        >
          <stormy-icon
            name="mood-empty"
            class="text-gray-300 mx-auto drop-shadow-xl w-20 h-20"
          />
          <div class="relative p-8 text-center">
            <h2 class="text-2xl font-medium">
              There's nothing here...
            </h2>
            <p class="mt-4 text-sm text-gray-500">
              Created posts will appear here, try creating one!
            </p>
          </div>
        </div>
      </transition>
    </template>
    <template v-else>
      <div class="w-xl  flex-1 w-xl items-center">
        <div class="flower-spinner mx-auto">
          <div class="dots-container">
            <div class="bigger-dot">
              <div class="smaller-dot" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { useToots } from '@/stores/toots'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useTemplateFilter } from '@/composables/useTemplateFilter'
import axios from 'axios'

const { formatInt } = useTemplateFilter()

const route = useRoute()
const store = useToots()

const deeplLimit = ref(0)

const { t: $t } = useI18n({ useScope: 'global' })

const filteredToots = computed(() => {
  if (['local'].includes(props.type)) {
    return store.toots.filter(item => ['de', 'en'].includes(item.language))
  }
  return store.toots
})

const props = defineProps({
  title: useProp(String, ''),
  type: useProp(String, '')
})

const getTitle = computed(() => {
  if (props.title) return props.title
  if (!props.type) return `Oops ${props.type}`

  if (props.type === 'tags') {
    const i18 = $t(`timelines.titles.${props.type}`)
    return `${i18} #${route.params.tag}`
  }

  return $t(`timelines.titles.${props.type}`)
})

onMounted(async () => {
  const authKey = 'bfca006a-9a83-b5cd-786c-cbf877d89b26:fx' // Replace with your key
  try {
    const response2 = await axios
      .get('https://api-free.deepl.com/v2/usage', {
        params: {
          auth_key: authKey
        },
        proxy: {
          host: 'localhost',
          port: 8080
        }
      })
    deeplLimit.value = response2.data.character_limit - response2.data.character_count
  } catch (error) {
    console.log(error)
  }
})

</script>
