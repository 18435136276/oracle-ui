// 菱形
import { DiamondNode, DiamondNodeModel } from '@logicflow/core'
import { uuid } from '@/utils/ruoyi'

// 条件节点
export class ConditionModel extends DiamondNodeModel {

  createId() {
    return uuid(8, 16)
  }

  initNodeData(data) {
    super.initNodeData(data)
    this.rx = 40
    this.ry = 30
    this.text.value = '?'
    this.text.editable = false
    this.menu = [
      {
        text: '删除',
        callback: (node) => this.graphModel.deleteNode(node.id)
      }
    ]
  }

  getNodeStyle() {
    const style = super.getNodeStyle()
    style.fill = '#7E3ED6'
    style.stroke = 'white'
    style.strokeWidth = 1
    return style
  }

  getTextStyle() {
    const style = super.getTextStyle()
    style.fontSize = 25
    style.color = 'white'
    style.fontWeight = 'bold'
    return style
  }

}

export default {
  type: 'condition',
  view: DiamondNode,
  model: ConditionModel
}
