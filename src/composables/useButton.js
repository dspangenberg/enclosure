import { computed } from 'vue'

export function useButton (props) {
  const variants = {
    outline: 'shadow-sm border border-neutral-200 rounded relative text-neutral-900 bg-transparent hover:bg-neutral-100 hover:border-neutral-300  focus:border-transparent focus:outline-none focus:ring-2 ring-offset-white focus:ring-blue-500 active:bg-neutral-200',
    primary: 'shadow-sm border border-transparent rounded relative text-white bg-blue-600 hover:bg-blue-500  focus:border-white focus:outline-none focus:ring-2 ring-offset-white focus:ring-blue-500 active:bg-blue-700',
    solid: 'shadow-sm border border-neutral-300 rounded relative text-neutral-900 bg-neutral-200 hover:bg-neutral-300 hover:border-neutral-400  focus:border-transparent focus:outline-none focus:ring-2 ring-offset-white focus:ring-blue-500 active:bg-neutral-200',
    light: 'shadow-sm border border-transparent rounded relative text-neutral-900 bg-neutral-100 hover:bg-neutral-200 hover:border-transparent  focus:border-transparent focus:outline-none focus:ring-2 ring-offset-white focus:ring-blue-500 active:bg-neutral-300',
    ghost: 'border border-transparent rounded text-center text-neutral-900 bg-transparent hover:bg-neutral-100 hover:border-neutral-300 focus:outline-none focus:ring-2 ring-offset-white focus:ring-blue-500 active:bg-neutral-200 flex-1',
    danger: 'border border-transparent rounded text-center text-neutral-900 bg-transparent hover:bg-neutral-100 hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-2 ring-offset-white focus:ring-red-500 active:bg-neutral-200 focus:text-red-600'
  }

  const sizes = {
    lg: 'leading-5 h-10 w-10',
    md: 'leading-5 h-8 w-8 ',
    sm: 'leading-5 h-7 w-7',
    full: 'w-full h-8',
    auto: 'h-8 w-auto text-sm'
  }

  const iconSizes = {
    lg: 'h-6 w-6 ',
    sm: 'h-5 w-5',
    md: 'h-5 w-5 mx-auto',
    full: 'h-5 h-5',
    auto: 'h-5 h-5'
  }

  const getClasses = computed(() => getVariant.value + ' ' + getSize.value)
  const getVariant = computed(() => {
    let classes = props.disabled ? disable(variants[props.variant]) : variants[props.variant]
    if (props.removeBorder) {
      classes = removeClasses(classes, ['border', 'hover:border', 'rounded'])
    }
    return props.focusOnClick ? classes : removeClasses(classes, ['focus:', 'active:'])
  })
  const getSize = computed(() => sizes[props.size])
  const getIconSize = computed(() => iconSizes[props.size])

  const removeClasses = (classes, classesToRemove) => {
    const removes = []
    classes = classes.split(' ')

    for (const name of classes) {
      for (const remove of classesToRemove) {
        if (name.startsWith(remove)) {
          removes.push(name)
        }
      }
    }

    classes = classes.filter(item => !removes.includes(item))
    return classes.join(' ')
  }

  const disable = (classes) => {
    classes = classes.replace(
      props.variant === 'primary' ? 'bg-blue-600' : '',
      props.variant === 'primary' ? 'bg-gray-300' : ''
    )
    classes = classes.replace(
      props.variant === 'primary' ? 'text-white' : 'text-neutral-900',
      props.variant === 'primary' ? 'text-gray-500' : 'text-neutral-300'
    )
    return removeClasses(classes, [
      'active:', 'hover:', 'focus:'
    ])
  }

  return { getClasses, getIconSize }
}
