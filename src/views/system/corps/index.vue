<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="结算方式,结算表票结、月结" prop="fStltypeid">
        <el-input
          v-model="queryParams.fStltypeid"
          placeholder="请输入结算方式,结算表票结、月结"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="结费天数" prop="fStldays">
        <el-input
          v-model="queryParams.fStldays"
          placeholder="请输入结费天数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账期天数(订单结束后最迟结款天数) " prop="paymentDays">
        <el-input
          v-model="queryParams.paymentDays"
          placeholder="请输入账期天数(订单结束后最迟结款天数) "
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司车辆数" prop="carNum">
        <el-input
          v-model="queryParams.carNum"
          placeholder="请输入公司车辆数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="成立日期" prop="dateOfEstablishment">
        <el-date-picker clearable size="small"
          v-model="queryParams.dateOfEstablishment"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择成立日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="营业期限" prop="businessDeadline">
        <el-date-picker clearable size="small"
          v-model="queryParams.businessDeadline"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择营业期限">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核年检日期" prop="annualDate">
        <el-date-picker clearable size="small"
          v-model="queryParams.annualDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择审核年检日期">
        </el-date-picker>
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
          v-hasPermi="['system:corps:add']"
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
          v-hasPermi="['system:corps:edit']"
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
          v-hasPermi="['system:corps:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:corps:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="corpsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="left" prop="fId" />
      <el-table-column label="编号" align="left" prop="fNo" />
      <el-table-column label="简称" align="left" prop="fCname" />
      <el-table-column label="名称" align="left" prop="fName" />
      <el-table-column label="英文名称" align="left" prop="fEname" />
      <el-table-column label="电话" align="left" prop="fTel" />
      <el-table-column label="传真" align="left" prop="fFax" />
      <el-table-column label="邮箱" align="left" prop="fEmail" />
      <el-table-column label="联系人" align="left" prop="fManage" />
      <el-table-column label="地址" align="left" prop="fAddr" />
      <el-table-column label="英文地址" align="left" prop="fEaddr" />
      <el-table-column label="省" align="left" prop="fProvince" />
      <el-table-column label="市" align="left" prop="fCity" />
      <el-table-column label="结算方式,结算表票结、月结" align="left" prop="fStltypeid" />
      <el-table-column label="结费天数" align="left" prop="fStldays" />
      <el-table-column label="税号" align="left" prop="fTax" />
      <el-table-column label="开票电话" align="left" prop="fInvtel" />
      <el-table-column label="开票地址" align="left" prop="fInvaddr" />
      <el-table-column label="本位币账号" align="left" prop="fBankno" />
      <el-table-column label="本位币银行" align="left" prop="fBankname" />
      <el-table-column label="外币账号" align="left" prop="fUbankno" />
      <el-table-column label="外币银行" align="left" prop="fUbankname" />
      <el-table-column label="状态默认0有效1无效" align="left" prop="fStatus" />
      <el-table-column label="备注" align="left" prop="remark" />
      <el-table-column label="客户类别(拼接起来的)" align="left" prop="fTypename" />
      <el-table-column label="登陆账号" align="left" prop="loginAccount" />
      <el-table-column label="信用等级" align="left" prop="creditLv" />
      <el-table-column label="账期天数(订单结束后最迟结款天数) " align="left" prop="paymentDays" />
      <el-table-column label="公司车辆数" align="left" prop="carNum" />
      <el-table-column label="总公司" align="left" prop="headOffice" />
      <el-table-column label="注册资本" align="left" prop="registerdCapital" />
      <el-table-column label="法人" align="left" prop="legalPerson" />
      <el-table-column label="所属行业" align="left" prop="insdustry" />
      <el-table-column label="社会统一信用代码" align="left" prop="creditNum" />
      <el-table-column label="纳税人识别号" align="left" prop="taxpayerNum" />
      <el-table-column label="工商注册号" align="left" prop="industryCommerceNum" />
      <el-table-column label="组织机构代码" align="left" prop="organizationNum" />
      <el-table-column label="登记机关" align="left" prop="registerOrganization" />
      <el-table-column label="成立日期" align="center" prop="dateOfEstablishment" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dateOfEstablishment, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营业期限" align="center" prop="businessDeadline" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.businessDeadline, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营业区域" align="left" prop="businessArea" />
      <el-table-column label="审核年检日期" align="center" prop="annualDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.annualDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册地址" align="left" prop="registerdAddress" />
      <el-table-column label="经营范围" align="left" prop="manageScope" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:corps:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:corps:remove']"
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

    <!-- 添加或修改客户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="结算方式,结算表票结、月结" prop="fStltypeid">
          <el-input v-model="form.fStltypeid" placeholder="请输入结算方式,结算表票结、月结" />
        </el-form-item>
        <el-form-item label="结费天数" prop="fStldays">
          <el-input v-model="form.fStldays" placeholder="请输入结费天数" />
        </el-form-item>
        <el-form-item label="账期天数(订单结束后最迟结款天数) " prop="paymentDays">
          <el-input v-model="form.paymentDays" placeholder="请输入账期天数(订单结束后最迟结款天数) " />
        </el-form-item>
        <el-form-item label="公司车辆数" prop="carNum">
          <el-input v-model="form.carNum" placeholder="请输入公司车辆数" />
        </el-form-item>
        <el-form-item label="成立日期" prop="dateOfEstablishment">
          <el-date-picker clearable size="small"
            v-model="form.dateOfEstablishment"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择成立日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="营业期限" prop="businessDeadline">
          <el-date-picker clearable size="small"
            v-model="form.businessDeadline"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择营业期限">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="审核年检日期" prop="annualDate">
          <el-date-picker clearable size="small"
            v-model="form.annualDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择审核年检日期">
          </el-date-picker>
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
import { listCorps, getCorps, delCorps, addCorps, updateCorps } from "@/api/system/corps";

export default {
  name: "Corps",
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
      // 客户表格数据
      corpsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fNo: null,
        fCname: null,
        fName: null,
        fEname: null,
        fTel: null,
        fFax: null,
        fEmail: null,
        fManage: null,
        fAddr: null,
        fEaddr: null,
        fProvince: null,
        fCity: null,
        fStltypeid: null,
        fStldays: null,
        fTax: null,
        fInvtel: null,
        fInvaddr: null,
        fBankno: null,
        fBankname: null,
        fUbankno: null,
        fUbankname: null,
        fStatus: null,
        fTypename: null,
        loginAccount: null,
        creditLv: null,
        paymentDays: null,
        carNum: null,
        headOffice: null,
        registerdCapital: null,
        legalPerson: null,
        insdustry: null,
        creditNum: null,
        taxpayerNum: null,
        industryCommerceNum: null,
        organizationNum: null,
        registerOrganization: null,
        dateOfEstablishment: null,
        businessDeadline: null,
        businessArea: null,
        annualDate: null,
        registerdAddress: null,
        manageScope: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
        fStatus: [
          { required: true, message: "状态默认0有效1无效不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询客户列表 */
    getList() {
      this.loading = true;
      listCorps(this.queryParams).then(response => {
        this.corpsList = response.rows;
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
        fNo: null,
        fCname: null,
        fName: null,
        fEname: null,
        fTel: null,
        fFax: null,
        fEmail: null,
        fManage: null,
        fAddr: null,
        fEaddr: null,
        fProvince: null,
        fCity: null,
        fStltypeid: null,
        fStldays: null,
        fTax: null,
        fInvtel: null,
        fInvaddr: null,
        fBankno: null,
        fBankname: null,
        fUbankno: null,
        fUbankname: null,
        fStatus: "0",
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        fTypename: null,
        loginAccount: null,
        creditLv: null,
        paymentDays: null,
        carNum: null,
        headOffice: null,
        registerdCapital: null,
        legalPerson: null,
        insdustry: null,
        creditNum: null,
        taxpayerNum: null,
        industryCommerceNum: null,
        organizationNum: null,
        registerOrganization: null,
        dateOfEstablishment: null,
        businessDeadline: null,
        businessArea: null,
        annualDate: null,
        registerdAddress: null,
        manageScope: null
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
      this.title = "添加客户";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const fId = row.fId || this.ids
      getCorps(fId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改客户";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.fId != null) {
            updateCorps(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCorps(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除客户编号为"' + fIds + '"的数据项？').then(function() {
        return delCorps(fIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/corps/export', {
        ...this.queryParams
      }, `corps_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
