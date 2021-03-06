<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">、
      <el-form-item label="流程" prop="processId">
        <el-select v-model="queryParams.processId" placeholder="请选择流程定义" clearable size="small">
          <el-option
            v-for="(item,index) in processList"
            :key="index"
            :label="item.processName"
            :value="item.processId"
          >
            <span style="float: left">{{ item.processName }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.processCode }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="taskStatus">
        <el-select v-model="queryParams.taskStatus" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.wf_task_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="处理结果" prop="taskResult">
        <el-select v-model="queryParams.taskResult" placeholder="请选择任务结果" clearable size="small">
          <el-option
            v-for="dict in dict.type.wf_task_result"
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="流程标识" align="left" width="120" prop="processCode"/>
      <el-table-column label="流程名称" align="left" min-width="120" prop="processName"/>
      <el-table-column label="实例标签" align="left" min-width="180" prop="caseTag"/>
      <el-table-column label="节点名称" align="left" min-width="120" prop="nodeName"/>
      <el-table-column label="开始时间" align="center" prop="addDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="taskStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wf_task_status" :value="scope.row.taskStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="处理结果" align="center" prop="taskResult">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wf_task_result" :value="scope.row.taskResult"/>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" align="center" prop="endDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-success"
            v-hasPermi="['wf:task:audit']"
            v-if="scope.row.taskStatus === 0"
            @click="handleTaskDeal(scope.row)"
          >处理
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="handleFlow(scope.row)"
            v-hasPermi="['wf:task:flow']"
          >追踪
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

    <el-dialog class="flow-dialog" title="流程实例追踪" :visible.sync="flowOpen" width="1000px" @opened="flowDialogOpened"
               append-to-body
    >
      <graph-viewer ref="viewer"></graph-viewer>
    </el-dialog>
  </div>
</template>

<script>
import { listTask } from '@/api/wf/task'
import GraphViewer from '@/views/wf/graph/viewer'
import { selectProcess } from '@/api/wf/process'

export default {
  name: 'Task',
  dicts: ['wf_task_status', 'wf_task_result'],
  components: {
    GraphViewer
  },
  data() {
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
      // 流程任务表格数据
      taskList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        taskStatus: null,
        processId: null,
        taskResult: null
      },
      // 是否打开跟踪窗口
      flowOpen: false,
      caseId: null,
      // 流程列表
      processList: []
    }
  },
  created() {
    this.getList()
    selectProcess().then(response => {
      this.processList = response.rows
    })
  },
  methods: {
    /** 查询流程任务列表 */
    getList() {
      this.loading = true
      listTask(this.queryParams).then(response => {
        this.taskList = response.rows
        this.total = response.total
        this.loading = false
      })
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
      this.ids = selection.map(item => item.taskId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 处理任务提交按钮 */
    handleTaskDeal(row) {
      const taskId = row.taskId || this.ids
      this.$router.push(`/wf/task-edit/form/${taskId}`)
    },
    /** 流程追踪 */
    handleFlow(row) {
      this.caseId = row.caseId || this.ids
      this.flowOpen = true
    },
    // 流程跟踪被打开
    flowDialogOpened() {
      this.$refs['viewer'].renderViewer(this.caseId)
    }
  }
}
</script>

