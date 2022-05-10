<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="processName">
        <el-input
          v-model="queryParams.processName"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标识" prop="processCode">
        <el-input
          v-model="queryParams.processCode"
          placeholder="请输入标识"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="processEnable">
        <el-select v-model="queryParams.processEnable" placeholder="请选择是否启用" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['wf:process:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['wf:process:edit']"
        >修改
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['wf:process:remove']"
              >删除
              </el-button>
            </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['wf:process:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="processList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="流程标识" align="left" width="120" prop="processCode"/>
      <el-table-column label="流程名称" align="left" min-width="150" prop="processName"/>
      <el-table-column label="表单路径" align="left" min-width="180" prop="formPath"/>
      <el-table-column label="当前版本" align="center" width="120" prop="graphVersion">
        <template slot-scope="scope">
          <el-tag :type="scope.row.graphVersion===0?'danger':'primary'">Version {{ scope.row.graphVersion }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="addDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="updateDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120" prop="processEnable">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.processEnable"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="0"
            :inactive-value="1"
            @change="enableChange(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wf:process:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-picture"
            @click="handleDesign(scope.row)"
            v-hasPermi="['wf:process:edit']"
          >设计
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改流程定义对话框 -->
    <el-dialog :visible.sync="open" width="800px" append-to-body>
      <div slot="title">
        {{ title }}
        <el-popover
          placement="bottom-start"
          width="400"
          trigger="hover"
        >
          <i slot="reference" class="el-icon-question"></i>
          <p>1. 流程标识和表单路径不允许修改</p>
          <p>2. 表单路径 @ 代表编译前源码路径</p>
          <p>3. 表单数据及默认值由json字符串指定</p>
          <p>4. 表单路径所对应的组件必须存在名为 validate 方法用于校验数据合法性陈</p>
          <p>5. 表单路径所对应的组件必须存在名为 formData 的参数用于加载数据</p>
        </el-popover>
      </div>
      <el-row :gutter="15">
        <el-form ref="form" :model="form" :rules="rules" label-width="90px">
          <el-col :span="12">
            <el-form-item label="流程标识" prop="processCode">
              <el-input v-model="form.processCode" placeholder="请输入标识" :disabled="!isAdd"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="流程名称" prop="processName">
              <el-input v-model="form.processName" placeholder="请输入名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="表单路径" prop="formPath">
              <el-input v-model="form.formPath" placeholder="请输入表单路径" :disabled="!isAdd"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前版本" prop="graphVersion">
              <el-tag v-if="isAdd || (!isAdd && form.graphVersion === 0)" type="danger">暂无流程图</el-tag>
              <el-select
                v-else
                style="width: 100%;"
                v-model="form.graphVersion"
                placeholder="请选择流程图版本"
              >
                <el-option
                  v-for="(item,index) in graphOptions"
                  :key="index"
                  :label="`Version ${item.graphVersion}`"
                  :value="item.graphVersion"
                >
                  <span style="float: left">{{ `Version ${item.graphVersion}` }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.graphTag }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="表单数据" prop="formData">
              <b-code-editor v-model="form.formData" ref="editor" theme="dracula" height="200px"></b-code-editor>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="封面图片" prop="processCover">
              <image-upload v-model="form.processCover" :limit="1" :is-show-tip="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="流程说明" prop="processDes">
              <el-input type="textarea" v-model="form.processDes" placeholder="请输入说明" :rows="6"/>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listProcess, updateProcess, addProcess, getProcess } from '@/api/wf/process'
import { listGraph } from '@/api/wf/graph'
import ImageUpload from '@/components/ImageUpload'
import { isJSON } from '@/utils/validate'

export default {
  name: 'Process',
  dicts: ['sys_normal_disable'],
  components: {
    ImageUpload
  },
  data() {
    // 自定义验证表单Json数据格式
    const checkJSON = (rule, value, callback) => {
      if (isJSON(value)) {
        callback()
      } else {
        callback(new Error('表单数据不是合法的JSON字符串'))
      }
    }
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 流程定义表格数据
      processList: [],
      // 流程图选项
      graphOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        processName: null,
        processCode: null,
        processEnable: null
      },
      // 表单校验
      rules: {
        processName: [
          { required: true, message: '流程名称不能为空', trigger: 'blur' }
        ],
        processCode: [
          { required: true, message: '流程标识不能为空', trigger: 'blur' }
        ],
        formPath: [
          { required: true, message: '表单路径不能为空', trigger: 'blur' }
        ],
        formData: [
          { required: true, message: '表单数据不能为空', trigger: 'blur' },
          { validator: checkJSON, trigger: 'blur' }
        ],
        graphVersion: [
          { required: true, message: '版本不能为空', trigger: 'blur' }
        ]
      },
      // 是否为新增
      isAdd: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询流程定义列表 */
    getList() {
      this.loading = true
      listProcess(this.queryParams).then(response => {
        this.processList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        processId: null,
        processName: null,
        processCode: null,
        processDes: null,
        graphVersion: 0,
        formPath: null,
        formData: '{\n}',
        processCover: null,
        processEnable: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.processId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.isAdd = true
      this.open = true
      this.title = '添加流程定义'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.isAdd = false
      const processId = row.processId || this.ids
      getProcess(processId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改流程定义'
      })
      // 搜索流程图版本
      listGraph(processId).then(response => {
        this.graphOptions = response.rows
      })
    },
    /** 设计流程图 */
    handleDesign(row) {
      this.$router.push(`/wf/graph/design/${row.processId}/${row.graphVersion}`)
    },
    /** 删除按钮操作 */
    /*handleDelete(row) {
      const processIds = row.processId || this.ids
      this.$modal.confirm('是否确认删除流程定义编号为"' + processIds + '"的数据项？').then(function() {
        return delProcess(processIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },*/
    /** 导出按钮操作 */
    handleExport() {
      this.download('wf/process/export', {
        ...this.queryParams
      }, `process_${new Date().getTime()}.xlsx`)
    },
    /** 流程状态改变 */
    enableChange(row) {
      updateProcess(row).then(response => {
        this.$modal.msgSuccess('流程状态修改成功')
        this.getList()
      }).catch(e => {
        this.getList()
      })
    },
    /** 确认提交 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.processId != null) {
            updateProcess(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addProcess(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// 设置树形下拉框样式
.menu-select {
  width: 204px;
  line-height: 31px;
  margin-top: 2px;
  font-size: 13px;

  ::v-deep .vue-treeselect--searchable, ::v-deep vue-treeselect__input-container {
    line-height: 31px;
  }

  ::v-deep .vue-treeselect__control {
    height: 31px;
  }
}
</style>

