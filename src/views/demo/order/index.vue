<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="orderCode">
        <el-input
          v-model="queryParams.orderCode"
          placeholder="请输入订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeOrderDate"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="收件人" prop="orderUser">
        <el-input
          v-model="queryParams.orderUser"
          placeholder="请输入收件人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['demo:order:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['demo:order:edit']"
        >修改
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
          v-hasPermi="['demo:order:remove']"
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
          v-hasPermi="['demo:order:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          :disabled="single"
          size="mini"
          @click="handleChart1"
          v-hasPermi="['demo:order:chart1']"
        >订单明细
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          size="mini"
          @click="handleChart2"
          v-hasPermi="['demo:order:chart2']"
        >订单统计
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="left" width="150" prop="orderId"/>
      <el-table-column label="订单编号" align="left" width="180" prop="orderCode"/>
      <el-table-column label="订单金额" align="left" prop="orderMoney"/>
      <el-table-column label="收件人" align="left" prop="orderUser"/>
      <el-table-column label="联系方式" align="left" prop="orderPhone"/>
      <el-table-column label="创建时间" align="center" prop="orderDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配送地址" align="left" min-width="150" prop="orderAddress"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['demo:order:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['demo:order:remove']"
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

    <!-- 添加或修改订单管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="收件人" prop="orderUser">
              <el-input v-model="form.orderUser" placeholder="请输入收件人"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="orderPhone">
              <el-input v-model="form.orderPhone" placeholder="请输入联系方式"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="配送地址" prop="orderAddress">
              <el-input v-model="form.orderAddress" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">货物明细信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDemoGoods">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteDemoGoods">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="demoGoodsList" :row-class-name="rowDemoGoodsIndex"
                  @selection-change="handleDemoGoodsSelectionChange" ref="demoGoods"
        >
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="货物编号" prop="goodsCode" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.goodsCode" placeholder="请输入货物编号"/>
            </template>
          </el-table-column>
          <el-table-column label="货物名称" prop="goodsName" min-width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.goodsName" placeholder="请输入货物名称"/>
            </template>
          </el-table-column>
          <el-table-column label="所属仓库" prop="goodsStore" width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.goodsStore" placeholder="请选择所属仓库">
                <el-option
                  v-for="dict in dict.type.demo_goods_store"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="货物数量" prop="goodsNum" width="120">
            <template slot-scope="scope">
              <el-input-number style="width: 100%" :min="1" controls-position="right" v-model="scope.row.goodsNum"
                               placeholder="请输入货物数量"
              />
            </template>
          </el-table-column>
          <el-table-column label="货物单价" prop="goodsPrice" width="120">
            <template slot-scope="scope">
              <el-input-number style="width: 100%" :min="1" controls-position="right" v-model="scope.row.goodsPrice"
                               placeholder="请输入货物单价"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <jm-report-view ref="jmReportView"></jm-report-view>
  </div>
</template>

<script>
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from '@/api/demo/order'
import { getToken } from '@/utils/auth'
import JmReportView from '@/components/JmReportView'

export default {
  name: 'Order',
  dicts: ['demo_goods_store'],
  components: {
    JmReportView: JmReportView
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedDemoGoods: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 订单管理表格数据
      orderList: [],
      // 货物明细表格数据
      demoGoodsList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 货物单价时间范围
      daterangeOrderDate: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderCode: null,
        orderDate: null,
        orderUser: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderAddress: [
          { required: true, message: '配送地址不能为空', trigger: 'blur' }
        ],
        orderUser: [
          { required: true, message: '收件人不能为空', trigger: 'blur' }
        ],
        orderPhone: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur' },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请输入正确的手机号码'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询订单管理列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.daterangeOrderDate && '' != this.daterangeOrderDate) {
        this.queryParams.params['beginOrderDate'] = this.daterangeOrderDate[0]
        this.queryParams.params['endOrderDate'] = this.daterangeOrderDate[1]
      }
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        orderId: null,
        orderCode: null,
        orderMoney: null,
        orderAddress: null,
        orderDate: null,
        orderUser: null,
        orderPhone: null
      }
      this.demoGoodsList = []
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeOrderDate = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.orderId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加订单管理'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const orderId = row.orderId || this.ids
      getOrder(orderId).then(response => {
        this.form = response.data
        this.demoGoodsList = response.data.demoGoodsList
        this.open = true
        this.title = '修改订单管理'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.demoGoodsList = this.demoGoodsList
          if (this.form.orderId != null) {
            updateOrder(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addOrder(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderIds = row.orderId || this.ids
      this.$modal.confirm('是否确认删除订单管理编号为"' + orderIds + '"的数据项？').then(function() {
        return delOrder(orderIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 货物明细序号 */
    rowDemoGoodsIndex({ row, rowIndex }) {
      row.index = rowIndex + 1
    },
    /** 货物明细添加按钮操作 */
    handleAddDemoGoods() {
      let obj = {}
      obj.goodsCode = ''
      obj.goodsName = ''
      obj.goodsStore = ''
      obj.goodsNum = ''
      obj.goodsPrice = ''
      this.demoGoodsList.push(obj)
    },
    /** 货物明细删除按钮操作 */
    handleDeleteDemoGoods() {
      if (this.checkedDemoGoods.length == 0) {
        this.$modal.msgError('请先选择要删除的货物明细数据')
      } else {
        const demoGoodsList = this.demoGoodsList
        const checkedDemoGoods = this.checkedDemoGoods
        this.demoGoodsList = demoGoodsList.filter(function(item) {
          return checkedDemoGoods.indexOf(item.index) == -1
        })
      }
    },
    /** 复选框选中数据 */
    handleDemoGoodsSelectionChange(selection) {
      this.checkedDemoGoods = selection.map(item => item.index)
    },
    /** 明细报表 */
    handleChart1(row) {
      const orderId = row.orderId || this.ids
      this.$refs.jmReportView.openView('679866127789387776', { id: orderId })
    },
    /** 订单统计 */
    handleChart2() {
      this.$refs.jmReportView.openView('679851222919081984')
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('demo/order/export', {
        ...this.queryParams
      }, `order_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>

