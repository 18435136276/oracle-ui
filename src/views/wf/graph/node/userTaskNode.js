import { HtmlNode, HtmlNodeModel } from '@logicflow/core'
import { uuid } from '@/utils/ruoyi'

// 用户任务节点
export class UserTaskModel extends HtmlNodeModel {
  createId() {
    return uuid(8, 16)
  }

  setAttributes() {
    super.setAttributes()
    this.text.y = this.y + 15
  }

  initNodeData(data) {
    super.initNodeData(data)
    this.width = 160
    this.height = 80
    this.text.editable = true
    this.menu = [
      {
        text: '删除',
        callback: (node) => this.graphModel.deleteNode(node.id)
      },
      {
        text: '复制',
        callback: (node) => this.graphModel.cloneNode(node.id)
      },
      {
        text: '设置属性',
        callback: (node) => this.graphModel.eventCenter.emit('custom:prop', node)
      }
    ]
    // 有且仅有一条连出线
    this.sourceRules.push({
      message: '用户任务节点有且仅有一条连出线',
      validate: (source, target) => {
        for (let edge of this.graphModel.edges) {
          if (edge.sourceNodeId === source.id) return false
        }
        return true
      }
    })
  }
}

// 用户任务节点
export class UserTaskNode extends HtmlNode {

  setHtml(rootEl) {
    const { properties } = this.props.model
    rootEl.innerHTML = `
      <div class="task-container ${properties.isCurrent ? 'current' : ''}">
        <div class="task-header user"><i class="el-icon-user-solid"></i>&emsp;用户任务</div>
      </div>
    `
  }
}

export default {
  type: 'userTask',
  view: UserTaskNode,
  model: UserTaskModel
}
