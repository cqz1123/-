<template>
  <el-card class="product-card" @click="handleCardClick">
    <div class="card-content">
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-sku">SKU: {{ product.sku }}</p>
      </div>
      <div class="stock-info">
        <p class="stock-text">库存：{{ product.stock }} 件</p>
        <p class="price-text">价格：¥{{ product.price }}</p>
      </div>
      <div class="action-buttons">
        
      </div>
      <el-button type="primary" size="small" @click.stop="handleInStock">入库</el-button>
        <el-button type="warning" size="small" @click.stop="handleOutStock">出库</el-button>
        <el-button type="danger" size="small" @click.stop="handleDelete">删除</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// 定义组件属性
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// 定义事件
const emit = defineEmits([
  'onInStock',
  'onOutStock',
  'onDelete',
  'onCardClick'
])

// 处理卡片点击事件
const handleCardClick = () => {
  emit('onCardClick', props.product.id)
}

// 处理入库按钮点击事件
const handleInStock = () => {
  emit('onInStock', props.product)
}

// 处理出库按钮点击事件
const handleOutStock = () => {
  emit('onOutStock', props.product)
}

// 处理删除按钮点击事件
const handleDelete = () => {
  emit('onDelete', props.product.id)
}
</script>

<style scoped>
.product-card {
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 4px 0;
  color: #303133;
}

.product-sku {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.stock-info {
  flex: 1;
  text-align: center;
}

.stock-text {
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: #303133;
}

.price-text {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

.action-buttons {
  flex: 1;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .action-buttons {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>