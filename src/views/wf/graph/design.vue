<template>
  <div class="app-container">
    <div class="wf-container">
      <div id="wf-editor"></div>
      <div class="footer-container">
        <el-button type="primary" @click="openAudit">提交</el-button>
        <el-button type="danger" @click="closeBack">返回</el-button>
      </div>
      <!--节点属性面板-->
      <el-dialog title="属性面板"
                 append-to-body
                 :visible.sync="panelShow"
                 width="600px"
      >
        <div slot="title">
          属性面板
          <el-popover
            placement="bottom-start"
            width="400"
            trigger="hover"
          >
            <i slot="reference" class="el-icon-question"></i>
            <p>1. 节点参数必须为json格式</p>
            <p>2. 用户任务节点提示消息中可以使用以下此默认值</p>
            <ul>
              <li><label>流程名称：</label>${processName}</li>
              <li><label>实例说明：</label>${caseDes}</li>
              <li><label>当前节点：</label>${taskName}</li>
              <li><label>申请人：</label>${auditUser}</li>
              <li><label>待处理人：</label>${taskUser}</li>
            </ul>
            <p>3. 用户任务节点提示消息中可以使用表单数据，格式为${property}</p>
          </el-popover>
        </div>
        <el-form v-model="panelData" label-width="70px" label-position="left" v-if="panelData">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="文本">
                <el-input v-model="panelData.properties.name" placeholder="请输入节点名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="提示消息" v-if="panelData.type==='userTask'">
                <el-input type="textarea" v-model="panelData.properties.message" placeholder="请输入提示消息模板"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="受理方式" v-if="panelData.type==='userTask'">
                <el-select style="width:100%" v-model="panelData.properties.mode" placeholder="请选择记录结果">
                  <el-option
                    v-for="dict in dict.type.wf_assign_mode"
                    :key="dict.value"
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="受理对象" v-if="panelData.type==='userTask'&& panelData.properties.mode < 4">
                <el-select style="width:100%" multiple v-model="panelData.properties.assign">
                  <el-option
                    v-if="panelData.properties.mode===1"
                    v-for="item in userOptions"
                    :key="item.userId"
                    :label="item.nickName"
                    :value="item.userId"
                  >
                    <span style="float: left">{{ item.nickName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.userName }}</span>
                  </el-option>
                  <el-option
                    v-if="panelData.properties.mode===2"
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                  >
                    <span style="float: left">{{ item.roleName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.roleKey }}</span>
                  </el-option>
                  <el-option
                    v-if="panelData.properties.mode===3"
                    v-for="item in postOptions"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId"
                  >
                    <span style="float: left">{{ item.postName }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.postCode }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="完成策略" v-if="panelData.type==='userTask'">
                <el-select style="width:100%" v-model="panelData.properties.strategy" placeholder="请选择记录结果">
                  <el-option
                    v-for="dict in dict.type.wf_assign_strategy"
                    :key="dict.value"
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="比率" v-if="panelData.type==='userTask'&& panelData.properties.strategy===2">
                <el-input-number :min="0" :max="100" v-model="panelData.properties.rate"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量" v-if="panelData.type==='userTask'&& panelData.properties.strategy===3">
                <el-input-number :min="0" :max="100" v-model="panelData.properties.count"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="条件" v-if="panelData.type==='sequence'">
                <el-input v-model="panelData.properties.condition" placeholder="${money} > 3000"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="执行类" v-if="panelData.type ==='serviceTask' ||
            (panelData.type ==='userTask' && panelData.properties.mode === 4)"
              >
                <el-input v-model="panelData.properties.invoke" placeholder="com.ruoyi.system.TestInvoke"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="节点参数" v-if="panelData.type ==='serviceTask' ||panelData.type ==='userTask'">
                <b-code-editor v-model="panelData.properties.params" ref="editor" theme="dracula" height="200px"
                ></b-code-editor>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer">
        <el-button @click="panelShow=false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { logicFlow } from '@/views/wf/graph/logicFlow'
import { addGraph, getGraph } from '@/api/wf/graph'
import { listRole } from '@/api/system/role'
import { listUser } from '@/api/system/user'
import { listPost } from '@/api/system/post'

export default {
  name: 'GraphDesign',
  dicts: ['wf_assign_mode', 'wf_assign_strategy'],
  data() {
    return {
      LogicFlow: null,// logicFlow绘图工具
      panelShow: false,// 是否需要显示属性面板
      nodeList: [],// 节点信息
      panelData: null,// 属性面板数据
      userOptions: [],// 用户选项
      roleOptions: [],// 角色选项
      postOptions: []// 岗位选项
    }
  },
  methods: {
    /** 设置节点流转属性 */
    handleConfirm() {
      this.LogicFlow.setProperties(this.panelData.id, this.panelData.properties)
      this.LogicFlow.updateText(this.panelData.id, this.panelData.properties.name)
      this.panelShow = false
    },
    /**
     * 流程图合法性验证
     */
    validate() {

    },
    /** 提交按钮 */
    openAudit() {
      this.$prompt('请输入此次改动信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        let graph = {
          graphData: this.LogicFlow.getGraphData(),
          processId: this.$route.params.processId,
          graphTag: value
        }
        addGraph(graph).then(response => {
          this.$modal.msgSuccess('提交成功')
          this.closeBack()
        })
      })
    },
    /** 返回按钮 */
    closeBack() {
      const obj = { path: '/tool/process' }
      this.$tab.closeOpenPage(obj)
    },
    /** 打开节点/边属性面板 */
    openPropertiesDialog(node) {
      if (!node.properties.params) node.properties.params = '{}'
      this.panelData = node
      if (node.type === 'userTask') {
        // 查询用户
        listUser().then(response => {
          this.userOptions = response.rows
        })
        // 查询角色
        listRole().then(response => {
          this.roleOptions = response.rows
        })
        // 查询岗位
        listPost().then(response => {
          this.postOptions = response.rows
        })
      }
      this.panelShow = true
    }
  },
  mounted() {
    this.LogicFlow = logicFlow('wf-editor', false)
    // 注册事件
    this.LogicFlow.on('connection:not-allowed', (event) => {// 连接节点不符合校验规则
      if (event.msg) this.$modal.msgError(event.msg)
    })
    this.LogicFlow.on('custom:prop', (event) => {// 打开属性设置
      this.openPropertiesDialog(event)
    })
    // 渲染
    const processId = this.$route.params.processId
    const version = this.$route.params.version
    getGraph(processId, version).then(response => {
      // 若已有图数据直接渲染
      if (response.data && response.data.graphData) {
        this.LogicFlow.render(response.data.graphData)
      } else {// 无图创建开始节点，结束节点
        this.LogicFlow.render()
        this.LogicFlow.addNode({ type: 'start', x: 150, y: 100 })
        this.LogicFlow.addNode({ type: 'end', x: 500, y: 100 })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 0;

  .wf-container {
    height: calc(100vh - 85px);

    #wf-editor {
      width: 100%;
      height: 100%;
    }

    .footer-container {
      position: absolute;
      text-align: right;
      right: 20px;
      bottom: 20px;
      width: 200px;
    }
  }
}
</style>
