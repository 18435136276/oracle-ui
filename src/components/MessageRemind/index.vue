<template>
  <el-popover
    placement="bottom-start"
    trigger="click"
    @show="popoverShowHandle"
  >
    <div slot="reference">
      <el-badge :value="messageCount" class="bell-badge" :max="10" :hidden="messageCount===0">
        <svg-icon icon-class="bell"/>
      </el-badge>
    </div>
    <el-menu :default-active="queryParams.messageType" class="el-menu-demo" mode="horizontal"
             @select="menuSelectHandle"
    >
      <el-menu-item :index="item.value" v-for="item in dict.type.sys_message_type"
                    :key="item.value"
      >{{ item.label }}
      </el-menu-item>
    </el-menu>
    <el-table v-loading="loading" :data="messageList" :show-header="false" @select="notedSelectHandle">
      <el-table-column align="left">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.messageContent" placement="bottom">
            <div class="content">{{ scope.row.messageContent }}</div>
          </el-tooltip>
          <div class="datetime">{{ parseTime(scope.row.messageDate, '{y}-{m}-{d} {h}:{i}') }}</div>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="50" align="center"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      small
      layout="prev, pager, next"
      @pagination="getList"
    />
  </el-popover>
</template>

<script>
import { count, notedMessage, selfListMessage } from '@/api/system/message'

export default {
  name: 'MessageRemind',
  dicts: ['sys_message_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      // 系统消息表格数据
      messageList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        messageType: 'task'
      },
      // 消息数量
      messageCount: 0,
      // 定时器
      timer: null
    }
  },
  created() {
    this.getMessageCount()
    // 五分钟获取一次未阅消息
    this.timer = setInterval(this.getMessageCount, 1000 * 60 * 5)
  },
  destroyed() {
    if (this.timer) clearInterval(this.timer)
  },
  methods: {
    /** 查询系统消息列表 */
    getList() {
      this.getMessageCount()
      this.loading = true
      selfListMessage(this.queryParams).then(response => {
        this.messageList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 气泡显示 */
    popoverShowHandle() {
      this.getList()
    },
    /** 消息类型改变 */
    menuSelectHandle(index) {
      this.queryParams.messageType = index
      this.getList()
    },
    /** 勾选数据行 */
    notedSelectHandle(selection, row) {
      notedMessage(row.messageId).then(response => {
        this.getList()
      })
    },
    /** 获取消息数量 */
    getMessageCount() {
      count().then(response => {
        this.messageCount = response
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  color: black;
  font-size: 13px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.datetime {
  color: #00000073;
  font-size: 12px;
}

.el-menu-item {
  height: 35px !important;
  line-height: 35px !important;
}

.bell-badge {
  margin-right: 20px;

  ::v-deep .el-badge__content.is-fixed {
    top: 10px !important;
  }
}
</style>
