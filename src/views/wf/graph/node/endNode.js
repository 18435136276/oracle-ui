// 圆形
import { CircleNode, CircleNodeModel } from '@logicflow/core'
import { uuid } from '@/utils/ruoyi'

// 开始节点
export class EndModel extends CircleNodeModel {

  createId() {
    return uuid(8, 16)
  }

  initNodeData(data) {
    super.initNodeData(data)
    this.r = 30
    this.text.value = '结束'
    this.text.editable = false
    this.menu = []
    // 结束节点只允许连入
    this.sourceRules.push({
      message: '结束节点只允许连入',
      validate: (source, target) => {
        return false
      }
    })
  }

  getNodeStyle() {
    const style = super.getNodeStyle()
    style.stroke = this.properties.isCurrent ? 'lawngreen' : 'rgba(179, 26, 80, 0.75)'
    style.strokeWidth = 10
    return style
  }
}

export default {
  type: 'end',
  view: CircleNode,
  model: EndModel
}
