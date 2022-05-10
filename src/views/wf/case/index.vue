<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="标签" prop="caseTag">
        <el-input
          v-model="queryParams.caseTag"
          placeholder="请输入实例标签 "
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="processId">
        <el-select v-model="queryParams.caseStatus" placeholder="请选择实例状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.wf_case_status"
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
          v-hasPermi="['wf:case:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="caseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="流程标识" align="left" width="120" prop="processCode"/>
      <el-table-column label="流程名称" align="left" width="150" prop="processName"/>
      <el-table-column label="标签/说明" align="left" min-width="120" prop="caseTag"/>
      <el-table-column label="实例状态" align="left" prop="caseStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.wf_case_status" :value="scope.row.caseStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="addDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="完结时间" align="center" prop="addDate" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.caseStatus === 1 || scope.row.caseStatus === 2"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['wf:case:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-success"
            v-if="scope.row.caseStatus === 1 || scope.row.caseStatus === 2"
            @click="handleAudit(scope.row)"
            v-hasPermi="['wf:case:audit']"
          >提交
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-promotion"
            @click="handleFlow(scope.row)"
            v-hasPermi="['wf:case:flow']"
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
    <el-dialog title="流程选择" :visible.sync="open" width="800px" append-to-body>
      <el-row :gutter="30" type="flex" style="flex-wrap: wrap" class="process-select">
        <el-col :span="8" v-for="(item,index) in processList" :key="index">
          <el-card :body-style="{ padding:'0px'}" shadow="hover" @click.native="handleProcessCardClick(item.processId)">
            <el-image fit="cover" lazy :src="baseUrl + item.processCover">
              <div slot="error" class="image-error">
                <i class="el-icon-picture-outline"></i>暂无封面
              </div>
            </el-image>
            <div class="process-name">
              {{ item.processName }}
            </div>
            <div class="process-des">
              {{ item.processDes }}
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog class="flow-dialog" title="流程实例追踪" :visible.sync="flowOpen" width="1000px" @opened="flowDialogOpened"
               append-to-body
    >
      <graph-viewer ref="viewer"></graph-viewer>
    </el-dialog>
  </div>
</template>

<script>
import { auditCase, listCase } from '@/api/wf/case'
import { selectProcess } from '@/api/wf/process'
import GraphViewer from '@/views/wf/graph/viewer'

export default {
  name: 'Case',
  dicts: ['wf_case_status'],
  components: {
    GraphViewer
  },
  data() {
    return {
      // 后台项目跟路径
      baseUrl: process.env.VUE_APP_BASE_API,
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
      // 流程实例表格数据
      caseList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        processId: null,
        graphVersion: null,
        caseTag: null,
        formData: null,
        caseStatus: null,
        nodeId: null,
        userId: null,
        addDate: null
      },
      // 流程列表
      processList: [],
      // 是否打开申请选择窗口
      open: false,
      // 是否打开跟踪窗口
      flowOpen: false,
      // 当前要看的流程图ID
      caseId: null
    }
  },
  created() {
    this.getList()
    selectProcess().then(response => {
      this.processList = response.rows
    })
  },
  methods: {
    /** 查询流程实例列表 */
    getList() {
      this.loading = true
      listCase(this.queryParams).then(response => {
        this.caseList = response.rows
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
      this.ids = selection.map(item => item.caseId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('wf/case/export', {
        ...this.queryParams
      }, `case_${new Date().getTime()}.xlsx`)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const caseId = row.caseId || this.ids
      this.$router.push(`/wf/case-edit/form/update/${caseId}`)
    },
    /** 提交按钮操作 */
    handleAudit(row) {
      this.$confirm('将提交此流程实例?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const caseId = row.caseId || this.ids
        auditCase(caseId).then(response => {
          this.$modal.msgSuccess('提交成功')
          this.getList()
        })
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
    },
    // 流程卡片被点击
    handleProcessCardClick(processId) {
      this.$router.push(`/wf/case-edit/form/add/${processId}`)
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

<style lang="scss">

// 实例追踪dialog
.flow-dialog .el-dialog__body {
  padding-top: 0;
}

// 流程选择弹框中的样式
.process-select {
  .el-col {
    margin-bottom: 30px;
  }

  .el-card {
    cursor: pointer;

    .el-image {
      width: 100%;
      height: 120px;

      .image-error {
        color: #909399;
        background-color: #F5F7FA;
        width: 100%;
        line-height: 120px;
        text-align: center;
      }
    }

    .process-name {
      line-height: 30px;
      height: 30px;
      font-weight: bold;
      padding: 0 10px
    }

    .process-des {
      line-height: 20px;
      height: 20px;
      color: #A69999;
      padding: 0 10px;
      font-size: 12px
    }
  }
}
</style>
