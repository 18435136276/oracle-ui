<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" v-hasPermi="['wf:task:audit']" icon="el-icon-success"
                   @click="handleAudit"
        >提 交
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
      <component ref="component" :formData="form.formData" :params="form.params" :is="myComponent"></component>
    </div>

    <!-- 添加或修改流程任务对话框 -->
    <el-dialog title="提交任务" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="处理结果" prop="taskResult">
          <el-radio-group v-model="form.taskResult">
            <el-radio
              v-for="(dict,index) in dict.type.wf_task_result"
              v-if="index!==0"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理意见" prop="taskContent">
          <el-input resize="both" :rows="5" v-model="form.taskContent" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { auditTask, getTask } from '@/api/wf/task'

export default {
  name: 'TaskForm',
  dicts: ['wf_task_result'],
  data() {
    return {
      open: false,
      // 任务信息
      form: {},
      // 表单校验
      rules: {
        taskResult: [
          { required: true, message: '任务结果不能为空', trigger: 'blur' }
        ]
      },
      // 表单组件
      myComponent: null
    }
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$tab.closeOpenPage({ path: '/wf/task' })
    },
    // 处理保存按钮点击
    handleAudit() {
      this.$refs['component'].validate(valid => {// 表单合法性验证
        if (valid) this.open = true
      })
    },
    // 提交数据
    submitForm() {
      this.$refs['form'].validate(valid => {// 表单合法性验证
        if (valid) {
          auditTask(this.form).then(response => {
            this.$modal.msgSuccess('任务提交成功')
            this.cancel()
          })
        }
      })
    },
    // 重置
    handleReset() {
      this.init()
    },
    // 挂载自定义组件
    renderComponent(path) {
      if (!path) return
      path = path.substring(2, path.length - 4)
      this.myComponent = resolve => require([`@/${path}.vue`], resolve)// 动态加载组件
    },
    // 初始化页面
    init() {
      let id = this.$route.params.id
      getTask(id).then(response => {
        this.form = response.data
        this.renderComponent(response.data.formPath)
      })
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss" scoped>

</style>
