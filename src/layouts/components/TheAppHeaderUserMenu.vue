<template>
  <stormy-menu :button="false">
    <template #button>
      <span class="sr-only">Open user menu</span>
      <span class="rounded-full border border-gray-100">
        <img
          class="h-8 w-8 rounded-full border-white border-2"
          src="https://files.mastodon.social/accounts/avatars/108/198/176/038/891/079/original/def37f17c2e29141.jpg"
          alt=""
        >
      </span>
    </template>
    <div class="px-3 py-3 bg-gray-50 -mt-0.5 rounded-t-l-md rounded-t-r-md hover:bg-gray-100">
      <div class="text-sm text-gray-900 truncate pt-0.5 font-semibold flex items-center">
        <div class="truncate flex-1">
          daspbn
          <div class="text-xxs font-normal pt-0.5 leading-snug">
            @mastodon.social
          </div>
        </div>
        <stormy-icon
          name="copy"
          class="h-4 w-4 text-gray-400 cursor-pointer"
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
        icon="lock-off"
        label="user-menu.sign-out"
      />
    </div>

    <!--
      Da vue-i18n-extract keine dynamischen Keys unterstüzt und ich zu faul bin, ständige zwischen den Tabs zu wechseln ...
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
