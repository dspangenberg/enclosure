export function useMegaLinks () {
  const addHandlerToHashTagsAndMentions = () => {
    const hashTags = document.querySelectorAll('.toot-content a.hashtag, .toot-content a.mention')
    hashTags.forEach(function (hashtag) {
      hashtag.addEventListener('click', (event) => {
        event.preventDefault() // Don't navigate!
        const anchor = event.target.closest('a') // Find closest Anchor (or self)
        if (!anchor) return // Not found. Exit here.
        const tagOrMention = anchor.href.split('/').pop()
        if (tagOrMention.startsWith('@')) {
          console.log('mention', tagOrMention)
        } else {
          window.location = `app/timeline/tags/${tagOrMention}`
          // http://localhost:3000/app/timeline/tags/Pressefreiheit
          // http://localhost:3000/app/timeline/profile
        }
      })
    })
  }
  return { addHandlerToHashTagsAndMentions }
}
