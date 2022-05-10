import { BezierEdge, BezierEdgeModel } from '@logicflow/core'
import { uuid } from '@/utils/ruoyi'

// 节点模型
export class SequenceModel extends BezierEdgeModel {

  createId() {
    return uuid(8, 16)
  }

  initEdgeData(data) {
    super.initEdgeData(data)
    this.menu = [
      {
        text: '删除',
        callback: (edge) => this.graphModel.deleteEdgeById(edge.id)
      }
    ]
    if (this.graphModel.getNodeModelById(this.sourceNodeId).type === 'condition') {
      this.menu.push({
        text: '设置属性',
        callback: (edge) => this.graphModel.eventCenter.emit('custom:prop', edge)
      })
    }
  }

  getTextStyle() {
    const style = super.getTextStyle()
    style.color = '#3451F1'
    style.fontWeight = 'bold'
    style.fontSize = 14
    style.background.fill = 'white'
    return style
  }
}

export default {
  type: 'sequence',
  view: BezierEdge,
  model: SequenceModel
}
