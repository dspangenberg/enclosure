<template>
  <RadioGroup
    v-model="selected"
    class="my-4"
  >
    <RadioGroupLabel class="sr-only">
      Pricing plans
    </RadioGroupLabel>
    <div class="relative bg-white rounded-md -space-y-px">
      <RadioGroupOption
        v-for="(option, index) in options"
        :key="index"
        v-slot="{ checked, active }"
        as="template"
        :value="index"
      >
        <div :class="[index === 0 ? 'rounded-tl-md rounded-tr-md' : '', index === options.length - 1 ? 'rounded-bl-md rounded-br-md' : '', checked ? 'bg-blue-100 border-blue-200 z-10' : 'border-gray-200', 'relative border p-4 flex flex-col cursor-pointer md:pl-4 md:pr-6 md:grid md:grid-cols-3 focus:outline-none']">
          <span class="flex items-center text-sm">
            <span
              :class="[checked ? 'bg-blue-600 border-transparent' : 'bg-white border-gray-300', active ? 'ring-2 ring-offset-2 ring-blue-500' : '', 'h-4 w-4 rounded-full border flex items-center justify-center']"
              aria-hidden="true"
            >
              <span class="rounded-full bg-white w-1.5 h-1.5" />
            </span>
            <RadioGroupLabel
              as="span"
              :class="[checked ? 'text-blue-900' : 'text-gray-900', 'ml-3 text-base']"
            >
              {{ option.title }}
            </RadioGroupLabel>
          </span>
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>

<script setup>
import { ref } from 'vue'
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from '@headlessui/vue'

import { useProp } from '@/composables/useProp.js'

defineProps({
  options: useProp(Array)
})

const plans = [
  { name: 'Startup', priceMonthly: 29, priceYearly: 290, limit: 'Up to 5 active job postings' },
  { name: 'Business', priceMonthly: 99, priceYearly: 990, limit: 'Up to 25 active job postings' },
  { name: 'Enterprise', priceMonthly: 249, priceYearly: 2490, limit: 'Unlimited active job postings' }
]

const selected = ref(plans[0])
</script>
