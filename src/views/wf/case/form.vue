<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" v-hasPermi="['wf:case:edit','wf:case:add']"
                   @click="handleSave"
        >保 存
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" size="mini" plain icon="el-icon-refresh" @click="handleReset">重 置
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button size="mini" type="warning" plain @click="cancel" icon="el-icon-refresh-left">返 回</el-button>
      </el-col>
    </el-row>
    <div>
      <component ref="component" :formData="formData" :is="myComponent"></component>
    </div>
  </div>
</template>

<script>

import { getProcess } from '@/api/wf/process'
import { addCase, getCase, updateCase } from '@/api/wf/case'

export default {
  name: 'CaseForm',
  data() {
    return {
      // 表单参数
      formData: {},
      // 表单组件
      myComponent: null,
      // 流程版本
      version: null,
      // 标签说明
      caseTag: null,
      // 是否打开流程图
      open: false
    }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$tab.closeOpenPage({ path: '/wf/case' })
    },
    // 处理保存按钮点击
    handleSave() {
      this.$refs['component'].validate(valid => {// 表单合法性验证
        if (valid) {
          this.$prompt('填写流程实例标签/说明信息', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValidator: value => {
              return Boolean(value)
            },
            inputErrorMessage: '流程实例标签/说明信息不能为空',
            inputValue: this.caseTag
          }).then(({ value }) => {
            if (this.$route.params.type === 'update') {
              this.saveCase(value)
            } else if (this.$route.params.type === 'add') {
              this.addCase(value)
            }
          })
        }
      })
    },
    // 重置
    handleReset() {
      this.init()
    },
    // 保存表单实例
    saveCase(tag) {
      updateCase({
        caseId: this.$route.params.id,
        formData: this.formData,
        caseTag: tag
      }).then(response => {
        this.$modal.msgSuccess('修改成功')
        this.cancel()
      })
    },
    // 新增表单实例
    addCase(tag) {
      addCase({
        processId: this.$route.params.id,
        graphVersion: this.version,
        formData: this.formData,
        caseTag: tag
      }).then(response => {
        this.$modal.msgSuccess('新增成功')
        this.cancel()
      })
    },
    // 挂载自定义组件
    renderComponent(path) {
      if (!path) return
      path = path.substring(2, path.length - 4)
      this.myComponent = resolve => require([`@/${path}.vue`], resolve)// 动态加载组件
    },
    // 初始化页面
    init() {
      let type = this.$route.params.type
      let id = this.$route.params.id
      if (type === 'add') { // 新增实例
        getProcess(id).then(response => {
          this.formData = JSON.parse(response.data.formData)
          this.version = response.data.graphVersion
          this.renderComponent(response.data.formPath)
        })
      } else if (type === 'update') { // 修改实例
        getCase(id).then(response => {
          this.formData = response.data.formData
          this.caseTag = response.data.caseTag
          this.renderComponent(response.data.formPath)
        })
      }
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>

</style>
