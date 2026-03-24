<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增商品"
    width="500px"
  >
    <el-form
      :model="productForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="productForm.name" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="SKU" prop="sku">
        <el-input v-model="productForm.sku" placeholder="请输入商品SKU" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number
          v-model="productForm.price"
          :min="0.01"
          :step="0.01"
          :precision="2"
          placeholder="请输入商品价格"
        />
      </el-form-item>
      <el-form-item label="初始库存" prop="stock">
        <el-input-number
          v-model="productForm.stock"
          :min="0"
          placeholder="请输入初始库存"
        />
      </el-form-item>
      <el-form-item label="预警阈值" prop="alertThreshold">
        <el-input-number
          v-model="productForm.alertThreshold"
          :min="0"
          placeholder="请输入预警阈值"
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
import { ref, reactive, defineProps, defineEmits, watch } from 'vue'

// 定义组件属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
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

// 商品表单数据
const productForm = reactive({
  name: '',
  sku: '',
  price: 0,
  stock: 0,
  alertThreshold: 0
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' }
  ],
  sku: [
    { required: true, message: '请输入商品SKU', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '价格必须大于0', trigger: 'blur' }
  ],
  stock: [
    { type: 'number', min: 0, message: '库存不能为负数', trigger: 'blur' }
  ],
  alertThreshold: [
    { type: 'number', min: 0, message: '预警阈值不能为负数', trigger: 'blur' }
  ]
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  Object.assign(productForm, {
    name: '',
    sku: '',
    price: 0,
    stock: 0,
    alertThreshold: 0
  })
}

// 提交表单
const handleSubmit = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid) => {
    if (valid) {
      // 提交表单数据
      emit('onSubmit', { ...productForm })
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