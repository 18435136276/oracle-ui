<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="PID,对应主表id" prop="fPid">
        <el-input
          v-model="queryParams.fPid"
          placeholder="请输入PID,对应主表id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="货物品名，存储id 显示名称	t_goods 中的no或 name，模糊查找选择后，存储f_id，显示name" prop="fGoodsid">
        <el-input
          v-model="queryParams.fGoodsid"
          placeholder="请输入货物品名，存储id 显示名称	t_goods 中的no或 name，模糊查找选择后，存储f_id，显示name"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="原始入库日期" prop="fOriginalbilldate">
        <el-date-picker clearable size="small"
          v-model="queryParams.fOriginalbilldate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择原始入库日期">
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
      <el-form-item label="件数" prop="fQty">
        <el-input
          v-model="queryParams.fQty"
          placeholder="请输入件数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额" prop="fAmt">
        <el-input
          v-model="queryParams.fAmt"
          placeholder="请输入金额"
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
          v-hasPermi="['system:warehousebillsitems:add']"
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
          v-hasPermi="['system:warehousebillsitems:edit']"
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
          v-hasPermi="['system:warehousebillsitems:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:warehousebillsitems:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="warehousebillsitemsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="left" prop="fId" />
      <el-table-column label="PID,对应主表id" align="left" prop="fPid" />
      <el-table-column label="业务编号,保存主表的" align="left" prop="fBillno" />
      <el-table-column label="货物品名，存储id 显示名称	t_goods 中的no或 name，模糊查找选择后，存储f_id，显示name" align="left" prop="fGoodsid" />
      <el-table-column label="提单号" align="left" prop="fMblno" />
      <el-table-column label="原始入库日期" align="center" prop="fOriginalbilldate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fOriginalbilldate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入" align="center" prop="fBsdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.fBsdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计费方式(数据字典)" align="left" prop="fBillingway" />
      <el-table-column label="件数" align="left" prop="fQty" />
      <el-table-column label="状态(数据字典),0 录入 1确认订单" align="left" prop="fBillstatus" />
      <el-table-column label="备注" align="left" prop="remark" />
      <el-table-column label="金额" align="left" prop="fAmt" />
      <el-table-column label="单据类型(数据字典)SJRK" align="left" prop="fBilltype" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:warehousebillsitems:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:warehousebillsitems:remove']"
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

    <!-- 添加或修改仓库明细从对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="PID,对应主表id" prop="fPid">
          <el-input v-model="form.fPid" placeholder="请输入PID,对应主表id" />
        </el-form-item>
        <el-form-item label="货物品名，存储id 显示名称	t_goods 中的no或 name，模糊查找选择后，存储f_id，显示name" prop="fGoodsid">
          <el-input v-model="form.fGoodsid" placeholder="请输入货物品名，存储id 显示名称	t_goods 中的no或 name，模糊查找选择后，存储f_id，显示name" />
        </el-form-item>
        <el-form-item label="原始入库日期" prop="fOriginalbilldate">
          <el-date-picker clearable size="small"
            v-model="form.fOriginalbilldate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择原始入库日期">
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
        <el-form-item label="件数" prop="fQty">
          <el-input v-model="form.fQty" placeholder="请输入件数" />
        </el-form-item>
        <el-form-item label="金额" prop="fAmt">
          <el-input v-model="form.fAmt" placeholder="请输入金额" />
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
import { listWarehousebillsitems, getWarehousebillsitems, delWarehousebillsitems, addWarehousebillsitems, updateWarehousebillsitems } from "@/api/system/warehousebillsitems";

export default {
  name: "Warehousebillsitems",
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
      // 仓库明细从表格数据
      warehousebillsitemsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fPid: null,
        fBillno: null,
        fGoodsid: null,
        fMblno: null,
        fOriginalbilldate: null,
        fBsdate: null,
        fBillingway: null,
        fQty: null,
        fBillstatus: null,
        fAmt: null,
        fBilltype: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fBillstatus: [
          { required: true, message: "状态(数据字典),0 录入 1确认订单不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询仓库明细从列表 */
    getList() {
      this.loading = true;
      listWarehousebillsitems(this.queryParams).then(response => {
        this.warehousebillsitemsList = response.rows;
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
        fPid: null,
        fBillno: null,
        fGoodsid: null,
        fMblno: null,
        fOriginalbilldate: null,
        fBsdate: null,
        fBillingway: null,
        fQty: null,
        fBillstatus: 0,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        fAmt: null,
        fBilltype: null
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
      this.title = "添加仓库明细从";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const fId = row.fId || this.ids
      getWarehousebillsitems(fId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改仓库明细从";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.fId != null) {
            updateWarehousebillsitems(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWarehousebillsitems(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除仓库明细从编号为"' + fIds + '"的数据项？').then(function() {
        return delWarehousebillsitems(fIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/warehousebillsitems/export', {
        ...this.queryParams
      }, `warehousebillsitems_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
