// 圆形
import { CircleNode, CircleNodeModel } from '@logicflow/core'
import { uuid } from '@/utils/ruoyi'

// 开始节点
export class StartModel extends CircleNodeModel {

  createId() {
    return uuid(8, 16)
  }

  initNodeData(data) {
    super.initNodeData(data)
    this.r = 30
    this.text.value = '开始'
    this.text.editable = false
    this.menu = []
    // 有且仅有一条连出线
    this.sourceRules.push({
      message: '开始节点有且仅有一条连出线',
      validate: (source, target) => {
        for (let edge of this.graphModel.edges) {
          if (edge.sourceNodeId === source.id) return false
        }
        return true
      }
    })
    this.targetRules.push({
      message: '开始节点只允许连出',
      validate: (source, target) => {
        return false
      }
    })
  }

  getNodeStyle() {
    const style = super.getNodeStyle()
    style.stroke = this.properties.isCurrent ? 'lawngreen' : '#1ab394'
    style.strokeWidth = 10
    return style
  }
}

export default {
  type: 'start',
  view: CircleNode,
  model: StartModel
}
