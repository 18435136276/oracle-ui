<template>
  <div class="app-container">
    <el-form ref="elForm" :model="formData" :rules="rules" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名" clearable :style="{width: '100%'}"></el-input>
      </el-form-item>
      <el-form-item label="请假原因" prop="reason">
        <el-input v-model="formData.reason" type="textarea" placeholder="请输入请假原因"
                  :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"
        ></el-input>
      </el-form-item>
      <el-form-item label="时间范围" prop="timerange" value-format="yyyy-MM-dd">
        <el-date-picker v-model="formData.timerange" type="daterange"
                        :style="{width: '100%'}" start-placeholder="开始时间" end-placeholder="结束时间" range-separator="至"
                        clearable
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="请假类型" prop="type">
        <el-radio-group v-model="formData.type" size="medium">
          <el-radio v-for="(item, index) in typeOptions" :key="index" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    formData: Object,
    params: Object
  },
  data() {
    return {
      rules: {
        name: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        reason: [{
          required: true,
          message: '请输入请假原因',
          trigger: 'blur'
        }],
        timerange: [{
          required: true,
          message: '时间范围不能为空',
          trigger: 'change'
        }],
        type: [{
          required: true,
          message: '请假类型不能为空',
          trigger: 'change'
        }]
      },
      typeOptions: [{
        'label': '事假',
        'value': 1
      }, {
        'label': '病假',
        'value': 2
      }]
    }
  },
  methods: {
    /**
     * 传入校验函数
     * @param fun
     */
    validate(fun) {
      this.$refs['elForm'].validate(fun)// 表单校验函数
    }
  }
}

</script>
