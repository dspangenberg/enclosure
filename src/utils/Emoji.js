/*
  https://github.com/h3poteto/whalebird-desktop/blob/master/src/renderer/utils/emojify.ts
*/

import EmojiConvertor from 'emoji-js'
import emoji from 'node-emoji'

const converter = new EmojiConvertor()

converter.replace_mode = 'img'
converter.img_sets.apple.path = 'http://localhost:3000/twitter/'

const standardEmojis = (str) => {
  // console.log(str)
  str = emoji.unemojify(str)
  // console.log(str)
  str = converter.replace_colons(str)
  return str
}

const emojify = (str, customEmoji = []) => {
  str = standardEmojis(str)
  try {
    // console.log(str, customEmoji)
    let result = str

    customEmoji.map(emoji => {
      const reg = new RegExp(`:${emoji.shortcode}:`, 'g')
      const match = result.match(reg)
      if (!match) return emoji
      const replaceTag = `<img draggable="false" class="emojione" alt="${emoji.shortcode}" title="${emoji.shortcode}" src="${emoji.url}" />`
      result = result.replace(reg, replaceTag)
      return emoji
    })
    return result
  } catch (error) {
    console.log(error)
  }
}

export default emojify
