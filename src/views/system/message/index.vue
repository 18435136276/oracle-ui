<template xmlns="">
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="消息时间">
        <el-date-picker
          v-model="daterangeMessageDate"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="通知用户" prop="messageUser">
        <el-input
          v-model="queryParams.messageUser"
          placeholder="请输入通知用户"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <el-select v-model="queryParams.messageType" placeholder="请选择消息类型" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_message_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="已阅" prop="messageNoted">
        <el-select v-model="queryParams.messageNoted" placeholder="请选择已阅" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_yes_no"
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
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleNoted"
          v-hasPermi="['system:message:noted']"
        >已阅
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:message:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:message:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="messageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="消息类型" header-align="center" align="center" width="120" prop="messageType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_message_type" :value="scope.row.messageType"/>
        </template>
      </el-table-column>
      <el-table-column label="消息内容" align="left" prop="messageContent" min-width="200" show-overflow-tooltip/>
      <el-table-column label="通知用户" align="left" width="100" prop="messageUser"/>
      <el-table-column label="通知时间" align="center" prop="messageDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.messageDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联数据ID" align="left" width="150" prop="dataId"/>
      <el-table-column label="已阅" header-align="center" align="center" width="120" prop="messageNoted">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.messageNoted"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleNoted(scope.row)"
            v-if="scope.row.messageNoted === 'N'"
            v-hasPermi="['system:message:noted']"
          >已阅
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:message:remove']"
          >删除
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
  </div>
</template>

<script>
import { listMessage, delMessage, notedMessage } from '@/api/system/message'

export default {
  name: 'SysMessage',
  dicts: ['sys_yes_no', 'sys_message_type'],
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
      // 系统消息表格数据
      messageList: [],
      // 已阅时间范围
      daterangeMessageDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        messageDate: null,
        messageUser: null,
        messageType: null,
        messageNoted: null
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询系统消息列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.daterangeMessageDate && '' != this.daterangeMessageDate) {
        this.queryParams.params['beginMessageDate'] = this.daterangeMessageDate[0]
        this.queryParams.params['endMessageDate'] = this.daterangeMessageDate[1]
      }
      listMessage(this.queryParams).then(response => {
        this.messageList = response.rows
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
      this.daterangeMessageDate = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.messageId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleNoted(row) {
      const messageId = row.messageId || this.ids
      notedMessage(messageId).then(response => {
        this.getList()
        this.$modal.msgSuccess('更新成功')
      }).catch(() => {
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const messageIds = row.messageId || this.ids
      this.$modal.confirm('是否确认删除系统消息编号为"' + messageIds + '"的数据项？').then(function() {
        return delMessage(messageIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/message/export', {
        ...this.queryParams
      }, `message_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
