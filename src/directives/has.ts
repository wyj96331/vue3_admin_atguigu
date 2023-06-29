import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
export const isHasButton = {
  install(app: any) {
    app.directive('has', {
      mounted(el: any, options: any) {
        if (!userStore.buttons.includes(options.value)) {
          el.parentNode.removeChild(el)
        }
      },
    })
  },
}
