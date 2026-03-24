<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="400px"
  >
    <el-form
      :model="stockForm"
      :rules="rules"
      ref="formRef"
      label-width="80px"
    >
      <el-form-item label="商品名称" disabled>
        <el-input v-model="stockForm.productName" disabled />
      </el-form-item>
      <el-form-item label="当前库存" disabled>
        <el-input v-model="stockForm.currentStock" disabled />
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input-number
          v-model="stockForm.quantity"
          :min="1"
          :max="maxQuantity"
          placeholder="请输入数量"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="stockForm.remark"
          type="textarea"
          placeholder="请输入备注"
          rows="3"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, computed, watch } from 'vue'

// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: null
  },
  type: {
    type: String,
    default: 'in', // 'in' 表示入库，'out' 表示出库
    validator: (value) => ['in', 'out'].includes(value)
  }
})

// 定义事件
const emit = defineEmits(['onSubmit', 'update:visible'])

// 表单引用
const formRef = ref(null)

// 对话框可见性
const dialogVisible = ref(props.visible)

// 监听 visible 属性变化
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

// 监听 dialogVisible 变化，通知父组件
watch(dialogVisible, (newVal) => {
  emit('update:visible', newVal)
  // 如果对话框关闭，重置表单
  if (!newVal) {
    resetForm()
  }
})

// 监听 product 变化，更新表单数据
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    stockForm.productName = newProduct.name
    stockForm.currentStock = newProduct.stock
  }
}, { deep: true, immediate: true })

// 对话框标题
const dialogTitle = computed(() => {
  return props.type === 'in' ? '商品入库' : '商品出库'
})

// 最大数量（出库时不能超过当前库存）
const maxQuantity = computed(() => {
  if (props.type === 'out' && props.product) {
    return props.product.stock
  }
  return Infinity
})

// 库存操作表单数据
const stockForm = reactive({
  productName: '',
  currentStock: 0,
  quantity: 1,
  remark: ''
})

// 表单验证规则
const rules = {
  quantity: [
    {
      required: true,
      message: '请输入数量',
      trigger: 'blur'
    },
    {
      type: 'number',
      min: 1,
      message: '数量必须大于0',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (props.type === 'out' && props.product && value > props.product.stock) {
          callback(new Error(`出库数量不能超过当前库存 ${props.product.stock}`))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(stockForm, {
    productName: props.product?.name || '',
    currentStock: props.product?.stock || 0,
    quantity: 1,
    remark: ''
  })
}

// 提交表单
const handleSubmit = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      // 提交表单数据
      emit('onSubmit', {
        productId: props.product.id,
        type: props.type,
        quantity: stockForm.quantity,
        remark: stockForm.remark
      })
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>