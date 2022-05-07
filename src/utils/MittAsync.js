// https://github.com/developit/mitt/issues/122

import mitt from 'mitt'

const mittAsync = (all) => {
  const inst = mitt(all)
  inst.emitAsync = async function (type, e) {
    const handlers = this.all.get(type)
    if (handlers) for (const f of handlers) await f(e)

    const handlers2 = this.all.get('*')
    if (handlers2) for (const f of handlers2) await f(type, e)
  }
  return inst
}

export default mittAsync
