export class WindowBindings{
  static EnableMouseData = (): void =>{
    globalThis.MouseData = {
      clientX: null,
      clientY: null,
      lastClientX: null,
      lastClientY: null,
      clientDirX : null,
      clientDirY : null
    }
    document.addEventListener('mousemove', (e)=>{
      if(globalThis.MouseData.clientX !== null){
        globalThis.MouseData.lastClientX = globalThis.MouseData.clientX
        globalThis.MouseData.lastClientY = globalThis.MouseData.clientY
      }
      globalThis.MouseData.clientX = e.clientX
      globalThis.MouseData.clientY = e.clientY
      globalThis.MouseData.clientDirX = e.movementX
      globalThis.MouseData.clientDirY = e.movementY
    })
  }
}