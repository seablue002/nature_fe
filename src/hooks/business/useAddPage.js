import { computed } from 'vue'

const useAddPage = (props) => {
  // 是否是详情模式
  const isDetailMode = computed(() => {
    return ['detail'].includes(props.mode)
  })

  // 是否新增模式
  const isCreateMode = computed(() => {
    return ['add'].includes(props.mode)
  })

  // 是否编辑模式
  const isEditMode = computed(() => {
    return ['edit'].includes(props.mode)
  })

  return {
    isDetailMode,
    isCreateMode,
    isEditMode,
  }
}

export default useAddPage
