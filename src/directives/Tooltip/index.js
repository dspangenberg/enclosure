// https://codesandbox.io/s/8e9k3?file=/src/directives/Tooltip/index.js:0-433

const tooltipDirective = (app) => {
  app.directive('tooltip', {
    mounted (el, binding) {
      init(el, binding)
    },
    updated (el, binding) {
      init(el, binding)
    }
  })
}

function init (el, binding) {
  const position = binding.arg || 'top'
  const tooltipText = binding.value || 'Tooltip text'
  el.setAttribute('position', position)
  el.setAttribute('tooltip', tooltipText)
}

export default tooltipDirective
