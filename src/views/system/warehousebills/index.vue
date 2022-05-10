<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="客户名称，t_corps 中的no或 name，模糊查找选择后，存储id，显示name" prop="fCorpid">
        <el-input
          v-model="queryParams.fCorpid"
          placeholder="请输入客户名称，t_corps 中的no或 name，模糊查找选择后，存储id，显示name"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓库" prop="fWarehouseid">
        <el-input
          v-model="queryParams.fWarehouseid"
          placeholder="请输入仓库"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仓储计费日期" prop="fChargedate">
        <el-date-picker clearable size="small"
          v-model="queryParams.fChargedate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择仓储计费日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="入" prop="fBsdate">
        <el-date-picker clearable size="small"
          v-model="queryParams.fBsdate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择入">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="计费方式(数据字典)" prop="fBillingway">
        <el-input
          v-model="queryParams.fBillingway"
          placeholder="请输入计费方式(数据字典)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出库类别(字典表)" prop="fTrademodeid">
        <el-input
          v-model="queryParams.fTrademodeid"
          placeholder="请输入出库类别(字典表)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开票公司(客户列表)" prop="fSbu">
        <el-input
          v-model="queryParams.fSbu"
          placeholder="请输入开票公司(客户列表)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="保险金额" prop="fInsuranceamt">
        <el-input
          v-model="queryParams.fInsuranceamt"
          placeholder="请输入保险金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="付款方式" prop="fPaymode">
        <el-input
          v-model="queryParams.fPaymode"
          placeholder="请输入付款方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额合计" prop="fMoney">
        <el-input
          v-model="queryParams.fMoney"
          placeholder="请输入金额合计"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采购人" prop="fPurchase">
        <el-input
          v-model="queryParams.fPurchase"
          placeholder="请输入采购人"
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
          v-hasPermi="['system:warehousebills:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:warehousebills:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:warehousebills:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:warehousebills:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehousebillsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="left" prop="fId" />
      <el-table-column label="联系人" align="left" prop="fContacts" />
      <el-table-column label="电话" align="left" prop="fTel" />
      <el-table-column label="客户名称，t_corps 中的no或 name，模糊查找选择后，存储id，显示name" align="left" prop="fCorpid" />
      <el-table-column label="仓库" align="left" prop="fWarehouseid" />
      <el-table-column label="仓管人" align="left" prop="fStorekeeper" />
      <el-table-column label="仓储计费日期" align="center" prop="fChargedate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fChargedate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入" align="center" prop="fBsdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fBsdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计费方式(数据字典)" align="left" prop="fBillingway" />
      <el-table-column label="出库类别(字典表)" align="left" prop="fTrademodeid" />
      <el-table-column label="开票公司(客户列表)" align="left" prop="fSbu" />
      <el-table-column label="计费单位(数据字典),下拉选择毛重或净重" align="left" prop="fFeetunit" />
      <el-table-column label="提单号" align="left" prop="fMblno" />
      <el-table-column label="单据类型(数据字典)SJRK" align="left" prop="fBilltype" />
      <el-table-column label="状态(数据字典),0 录入 1确认订单" align="left" prop="fBillstatus" />
      <el-table-column label="备注" align="left" prop="remark" />
      <el-table-column label="运输条款" align="left" prop="fServiceitems" />
      <el-table-column label="开票人" align="left" prop="fInvoceobj" />
      <el-table-column label="发货人全称" align="left" prop="fShippername" />
      <el-table-column label="发货联系人" align="left" prop="fShipperattn" />
      <el-table-column label="发货人电话" align="left" prop="fShippertel" />
      <el-table-column label="收货人全称" align="left" prop="fConsigneername" />
      <el-table-column label="发货联系人" align="left" prop="fConsigneeattn" />
      <el-table-column label="收货人电话" align="left" prop="fConsigneetel" />
      <el-table-column label="是否办理保险" align="left" prop="fInsurance" />
      <el-table-column label="保险金额" align="left" prop="fInsuranceamt" />
      <el-table-column label="付款方式" align="left" prop="fPaymode" />
      <el-table-column label="金额合计" align="left" prop="fMoney" />
      <el-table-column label="采购人" align="left" prop="fPurchase" />
      <el-table-column label="拒绝理由" align="left" prop="fReason" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:warehousebills:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:warehousebills:remove']"
          >删除</el-button>
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

    <!-- 添加或修改仓库主(出入库)对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户名称，t_corps 中的no或 name，模糊查找选择后，存储id，显示name" prop="fCorpid">
          <el-input v-model="form.fCorpid" placeholder="请输入客户名称，t_corps 中的no或 name，模糊查找选择后，存储id，显示name" />
        </el-form-item>
        <el-form-item label="仓库" prop="fWarehouseid">
          <el-input v-model="form.fWarehouseid" placeholder="请输入仓库" />
        </el-form-item>
        <el-form-item label="仓储计费日期" prop="fChargedate">
          <el-date-picker clearable size="small"
            v-model="form.fChargedate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择仓储计费日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入" prop="fBsdate">
          <el-date-picker clearable size="small"
            v-model="form.fBsdate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择入">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计费方式(数据字典)" prop="fBillingway">
          <el-input v-model="form.fBillingway" placeholder="请输入计费方式(数据字典)" />
        </el-form-item>
        <el-form-item label="出库类别(字典表)" prop="fTrademodeid">
          <el-input v-model="form.fTrademodeid" placeholder="请输入出库类别(字典表)" />
        </el-form-item>
        <el-form-item label="开票公司(客户列表)" prop="fSbu">
          <el-input v-model="form.fSbu" placeholder="请输入开票公司(客户列表)" />
        </el-form-item>
        <el-form-item label="保险金额" prop="fInsuranceamt">
          <el-input v-model="form.fInsuranceamt" placeholder="请输入保险金额" />
        </el-form-item>
        <el-form-item label="付款方式" prop="fPaymode">
          <el-input v-model="form.fPaymode" placeholder="请输入付款方式" />
        </el-form-item>
        <el-form-item label="金额合计" prop="fMoney">
          <el-input v-model="form.fMoney" placeholder="请输入金额合计" />
        </el-form-item>
        <el-form-item label="采购人" prop="fPurchase">
          <el-input v-model="form.fPurchase" placeholder="请输入采购人" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listWarehousebills, getWarehousebills, delWarehousebills, addWarehousebills, updateWarehousebills } from "@/api/system/warehousebills";

export default {
  name: "Warehousebills",
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
      // 仓库主(出入库)表格数据
      warehousebillsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fContacts: null,
        fTel: null,
        fCorpid: null,
        fWarehouseid: null,
        fStorekeeper: null,
        fChargedate: null,
        fBsdate: null,
        fBillingway: null,
        fTrademodeid: null,
        fSbu: null,
        fFeetunit: null,
        fMblno: null,
        fBilltype: null,
        fBillstatus: null,
        fServiceitems: null,
        fInvoceobj: null,
        fShippername: null,
        fShipperattn: null,
        fShippertel: null,
        fConsigneername: null,
        fConsigneeattn: null,
        fConsigneetel: null,
        fInsurance: null,
        fInsuranceamt: null,
        fPaymode: null,
        fMoney: null,
        fPurchase: null,
        fReason: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询仓库主(出入库)列表 */
    getList() {
      this.loading = true;
      listWarehousebills(this.queryParams).then(response => {
        this.warehousebillsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        fId: null,
        fContacts: null,
        fTel: null,
        fCorpid: null,
        fWarehouseid: null,
        fStorekeeper: null,
        fChargedate: null,
        fBsdate: null,
        fBillingway: null,
        fTrademodeid: null,
        fSbu: null,
        fFeetunit: null,
        fMblno: null,
        fBilltype: null,
        fBillstatus: 0,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        fServiceitems: null,
        fInvoceobj: null,
        fShippername: null,
        fShipperattn: null,
        fShippertel: null,
        fConsigneername: null,
        fConsigneeattn: null,
        fConsigneetel: null,
        fInsurance: null,
        fInsuranceamt: null,
        fPaymode: null,
        fMoney: null,
        fPurchase: null,
        fReason: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.fId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加仓库主(出入库)";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const fId = row.fId || this.ids
      getWarehousebills(fId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改仓库主(出入库)";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.fId != null) {
            updateWarehousebills(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWarehousebills(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const fIds = row.fId || this.ids;
      this.$modal.confirm('是否确认删除仓库主(出入库)编号为"' + fIds + '"的数据项？').then(function() {
        return delWarehousebills(fIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/warehousebills/export', {
        ...this.queryParams
      }, `warehousebills_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
