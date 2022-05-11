<template>
  <div
    v-if="account"
    ref="profileRef"
    class="mb-4"
  >
    <vue-easy-lightbox
      scroll-disabled
      move-disabled
      :visible="lightboxHeaderVisibile"
      :imgs="[account.header]"
      teleport="body"
      @hide="lightboxHeaderVisibile = false"
    />
    <vue-easy-lightbox
      scroll-disabled
      move-disabled
      :visible="lightboxAvatarVisibile"
      :imgs="[account.avatar]"
      teleport="body"
      @hide="lightboxAvatarVisibile = false"
    />

    <div
      v-if="!account.header.endsWith('missing.png')"
      class=""
    >
      <img
        class="h-32 w-full object-cover lg:h-48 cursor-pointer"
        :src="account.header"
        alt=""
        @click="lightboxHeaderVisibile = true"
      >
    </div>
    <div
      v-else
      class="bg-blue-50"
    >
      <div class="h-16" />
    </div>
    <div class="max-w-5xl mx-auto px-4">
      <div class="-mt-10 flex space-x-5 items-center">
        <div class="flex">
          <div class="border-gray-100">
            <img
              class="h-[5.5rem] w-[5.5rem] rounded-full ring-4 ring-white cursor-pointer"
              :src="account.avatar"
              alt=""
              @click.capture="lightboxAvatarVisibile = true"
            >
          </div>
        </div>
        <div class="mt-12 flex-1">
          <div class="flex flex-1 items-center">
            <div class="text-xl font-bold text-gray-900 truncate -pl-2 flex-1">
              <span
                class="mr-3 mt-1 truncate"
                v-html="$sanitize(displayName)"
              />
              <div class="text-sm text-gray-400 mt-0.5 truncate">
                @{{ account.acct }}
              </div>
            </div>
            <div>
              <stormy-badge
                v-if="!account.isMe && account.isFollowing"
                class="mr-6"
                color="orange"
                border
              >
                {{ $t('common.is-follower') }}
              </stormy-badge>
            </div>
            <div class="space-x-1 flex items-center content-center">
              <template v-if="account.isMe">
                <stormy-icon-button
                  icon="pencil"
                  variant="outline"
                  size="md"
                />
                <stormy-icon-button
                  icon="dots-vertical"
                  variant="outline"
                  size="md"
                />
              </template>
              <template v-else>
                <stormy-icon-button
                  :icon="account.isFollowedByMe ? 'user-x' : 'user-plus'"
                  variant="outline"
                  size="md"
                />
                <stormy-icon-button
                  icon="dots-vertical"
                  variant="outline"
                  size="md"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="text-base text-gray-800 mx-5 my-6 toot-content"
      v-html="$sanitize(note)"
    />
    <div class="text-base font-semibold text-gray-700 grid grid-cols-3 mx-5 text-center my-4">
      <div>
        <router-link :to="`/app/timeline/bubble/${account.id}/follower`">
          {{ followingCount }} {{ $t('profiles.header.following') }}
        </router-link>
      </div>
      <div>
        <router-link :to="`/app/timeline/bubble/${account.id}/follower`">
          {{ followersCount }} {{ $t('profiles.header.followers') }}
        </router-link>
      </div>
      <div>
        {{ statusesCount }} {{ $t('common.toots') }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { useProp } from '@/composables/useProp.js'
import { useTemplateFilter } from '@/composables/useTemplateFilter.js'
import { computed, onMounted, ref, nextTick } from 'vue'
import emojify from '@/utils/Emoji'
import { useRouter } from 'vue-router'
import VueEasyLightbox from 'vue-easy-lightbox'
import { useI18n } from 'vue-i18n'
const { t: $t } = useI18n({ useScope: 'global' })

const router = useRouter()
const { formatDate, formatInt, getRoute } = useTemplateFilter()

const lightboxHeaderVisibile = ref(false)
const lightboxAvatarVisibile = ref(false)

const props = defineProps({
  account: useProp(Object)
})

const displayName = computed(() => {
  const emos = emojify(props.account.display_name, props.account.emojis)
  return emos
})

const note = computed(() => {
  const emos = emojify(props.account.note, props.account.emojis)
  return emos
})

const createdAt = computed(() => formatDate(props.account.created_at))
const lastStatusAt = computed(() => formatDate(props.account.last_status_at))

const followingCount = computed(() => formatInt(props.account.following_count))
const followersCount = computed(() => formatInt(props.account.followers_count))
const statusesCount = computed(() => formatInt(props.account.statuses_count))

const profileRef = ref()

const onMastodonClick = (event) => {
  const el = event.target.closest('a') || event.srcElement.closest('a')
  if (el instanceof HTMLAnchorElement) {
    const href = el.getAttribute('href')
    if (href) {
      const route = getRoute(href, [])
      if (route) {
        event.preventDefault()
        router.push(route)
      }
    }
  }
}

onMounted(async () => {
  await nextTick()
  if (props.account && note.value) {
    const tags = profileRef.value.querySelectorAll('.mention')
    if (tags.length) {
      tags.forEach((input) => input.addEventListener('click', (e) => onMastodonClick(e)))
    }
  }
})
</script>
