import { reactive, ref } from 'vue'
import { PAGE_SIZES } from '@/settings/config/app'

const useListPage = () => {
  const list = ref([])
  // 列表数据总条数
  const total = ref(0)

  // 分页参数
  const pagination = reactive({
    // 当前页码
    currentPage: 1,
    // 每页条数
    pageSize: PAGE_SIZES[0],
    // 是否显示分页
    isShow: true,
    // 总条数
    total: 0,
  })

  // loadding加载状态
  const loadding = ref(false)

  return {
    list,
    total,
    pagination,
    loadding,
  }
}

export default useListPage
