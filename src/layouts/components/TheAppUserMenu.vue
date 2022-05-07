<template>
  <stormy-menu
    v-if="account"
    items-class="origin-bottom-left  bottom-12 left-0 z-50 w-56 "
    button-class="flex flex-1 hover:border-gray-200 border border-transparent my-1 mx-1  mr-0 rounded-md active:bg-gray-100"
    menu-class="flex-1 flex mr-3"
    :button="false"
  >
    <template #button>
      <div class="flex items-center flex-1">
        <span class="flex-shrink-0 flex items-center">
          <span class="rounded-full  border-gray-100">
            <img
              class="h-8 w-8 rounded-full border-white border-2 "
              :src="account.avatar"
              alt=""
            >
          </span>
        </span>
        <span class="flex-1 text-sm text-gray-600  text-left truncate font-semibold pl-2">
          {{ account.username }}@{{ account.domain }}
        </span>
        <span class="pr-2 flex-shrink-0">
          <stormy-icon
            name="chevron-down"
            class="w-4 h-4 text-gray-400 "
            :stroke-width="2"
          />
        </span>
      </div>
    </template>
    <div class="px-3 py-3 bg-gray-50 -left-10 -mt-0.5 rounded-t-l-md rounded-t-r-md hover:bg-gray-100">
      <div class="text-sm text-gray-900 truncate pt-0.5 font-semibold flex items-center">
        <div class="truncate flex-1">
          {{ account.username }}
          <div class="text-xs font-normal pt-0.5 leading-snug">
            @{{ account.domain }}
          </div>
        </div>
        <stormy-icon
          v-if="isSupported"
          name="copy"
          class="h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-500 active:text-blue-600"
          @click="copy()"
        />
      </div>
    </div>
    <div class="flex flex-col space-y-0.5">
      <stormy-menu-item
        disabled
        i18n
        icon="pencil"
        label="user-menu.profile-change"
      />
      <stormy-menu-item
        disabled
        i18n
        icon="pin"
        label="user-menu.pined-toots"
      />
    </div>
    <div class="flex flex-col">
      <stormy-menu-item
        disabled
        i18n
        icon="user-check"
        label="user-menu.follower-request"
      />
      <stormy-menu-item
        disabled
        i18n
        icon="bell-off"
        label="user-menu.muted-profiles"
      />
      <stormy-menu-item
        disabled
        i18n
        icon="at-off"
        label="user-menu.blocked-profiles"
      />
      <stormy-menu-item
        disabled
        i18n
        icon="world-off"
        label="user-menu.hidden-domains"
      />
      <stormy-menu-item
        disabled
        i18n
        icon="a-b-off"
        label="user-menu.muted-words"
      />
    </div>
    <div class="flex flex-col">
      <stormy-menu-item
        disabled
        i18n
        icon="settings"
        label="user-menu.settings"
      />
      <stormy-menu-item
        disabled
        i18n
        icon="app-window"
        label="user-menu.app"
      />
    </div>
    <div class="flex flex-col">
      <stormy-menu-item
        disabled
        i18n
        icon="lock-off"
        label="user-menu.sign-out"
      />
    </div>

    <!--
      // $t('user-menu.profile-change')
      // $t('user-menu.pined-toots')
      // $t('user-menu.follower-request')
      // $t('user-menu.muted-profiles')
      // $t('user-menu.blocked-profiles')
      // $t('user-menu.hidden-domains')
      // $t('user-menu.muted-words')
      // $t('user-menu.settings')
      // $t('user-menu.sign-out')
    -->
  </stormy-menu>
</template>
<script setup>
import { useStore } from '@/stores/global'
import { storeToRefs } from 'pinia'
import { useClipboard } from '@vueuse/core'

const store = useStore()
const { account } = storeToRefs(store)
const { copy, isSupported } = useClipboard({ source: store.getMastodonHandle })

</script>
