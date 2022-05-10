<template>
  <el-tabs class="viewer-container" v-model="active">
    <el-tab-pane label="流程图" name="graph">
      <div id="wf-viewer"></div>
    </el-tab-pane>
    <el-tab-pane label="流转记录" name="record">
      <el-table :data="recordList">
        <el-table-column label="节点" align="left" width="120" prop="nodeName"/>
        <el-table-column label="处理人" align="left" width="120" prop="userName"/>
        <el-table-column label="处理时间" align="center" width="150" prop="addDate">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.addDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理结果" align="center" width="120" prop="recordResult">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.wf_task_result" :value="scope.row.recordResult"/>
          </template>
        </el-table-column>
        <el-table-column label="处理意见" align="left" prop="recordContent"/>
      </el-table>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { logicFlow } from '@/views/wf/graph/logicFlow'
import { caseGraph } from '@/api/wf/graph'

export default {
  name: 'Viewer',
  dicts: ['wf_task_result'],
  data() {
    return {
      LogicFlow: null,// logicFlow绘图工具
      active: 'graph',// 当前激活的标签页
      // 处理记录表格数据
      recordList: []
    }
  },
  methods: {
    /** 选渲染页面数据 */
    renderViewer(caseId) {
      caseGraph(caseId).then(response => {
        this.LogicFlow.render(response.data.graphData || {}) // 加载流程图
        if (response.data.nodeId) this.LogicFlow.setProperties(response.data.nodeId, { isCurrent: true })// 标记当前节点
        this.recordList = response.data.records
      })
    }
  },
  mounted() {
    this.LogicFlow = logicFlow('wf-viewer', true)
  }
}
</script>

<style lang="scss" scoped>
.viewer-container {
  width: 100%;

  #wf-viewer {
    height: 500px;
    width: 100%;
  }
}
</style>
