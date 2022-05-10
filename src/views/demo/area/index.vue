<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="地域名称" prop="areaName">
        <el-input
          v-model="queryParams.areaName"
          placeholder="请输入地域名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地域等级" prop="areaLevel">
        <el-select v-model="queryParams.areaLevel" placeholder="请选择地域等级" clearable size="small">
          <el-option
            v-for="dict in dict.type.demo_area_level"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['demo:area:add']"
        >新增
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="areaList"
      row-key="areaId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="地域名称" prop="areaName"/>
      <el-table-column label="地域编码" align="center" prop="areaCode"/>
      <el-table-column label="地域面积" align="center" prop="areaSize"/>
      <el-table-column label="邮编" align="center" prop="areaPost"/>
      <el-table-column label="地域等级" align="center" prop="areaLevel">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.demo_area_level" :value="scope.row.areaLevel"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['demo:area:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['demo:area:add']"
          >新增
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['demo:area:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改地域信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="地域名称" prop="areaName">
          <el-input v-model="form.areaName" placeholder="请输入地域名称"/>
        </el-form-item>
        <el-form-item label="地域编码" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入地域编码"/>
        </el-form-item>
        <el-form-item label="地域面积" prop="areaSize">
          <el-input v-model="form.areaSize" placeholder="请输入地域面积"/>
        </el-form-item>
        <el-form-item label="邮编" prop="areaPost">
          <el-input v-model="form.areaPost" placeholder="请输入邮编"/>
        </el-form-item>
        <el-form-item label="地域等级" prop="areaLevel">
          <el-select v-model="form.areaLevel" placeholder="请选择地域等级">
            <el-option
              v-for="dict in dict.type.demo_area_level"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父节点ID" prop="parentId">
          <treeselect v-model="form.parentId" :options="areaOptions" :normalizer="normalizer" placeholder="请选择父节点ID"/>
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
import { listArea, getArea, delArea, addArea, updateArea } from '@/api/demo/area'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'Area',
  dicts: ['demo_area_level'],
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 地域信息表格数据
      areaList: [],
      // 地域信息树选项
      areaOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        areaName: null,
        areaLevel: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        areaName: [
          { required: true, message: '地域名称不能为空', trigger: 'blur' }
        ],
        areaSize: [
          { required: true, message: '地域面积不能为空', trigger: 'blur' }
        ],
        areaLevel: [
          { required: true, message: '地域等级不能为空', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询地域信息列表 */
    getList() {
      this.loading = true
      listArea(this.queryParams).then(response => {
        this.areaList = this.handleTree(response.data, 'areaId', 'parentId')
        this.loading = false
      })
    },
    /** 转换地域信息数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.areaId,
        label: node.areaName,
        children: node.children
      }
    },
    /** 查询地域信息下拉树结构 */
    getTreeselect() {
      listArea().then(response => {
        this.areaOptions = []
        const data = { areaId: 0, areaName: '顶级节点', children: [] }
        data.children = this.handleTree(response.data, 'areaId', 'parentId')
        this.areaOptions.push(data)
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
        areaId: null,
        areaName: null,
        areaCode: null,
        areaSize: null,
        areaPost: null,
        areaLevel: null,
        parentId: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null && row.areaId) {
        this.form.parentId = row.areaId
      } else {
        this.form.parentId = 0
      }
      this.open = true
      this.title = '添加地域信息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()
      if (row != null) {
        this.form.parentId = row.areaId
      }
      getArea(row.areaId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改地域信息'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.areaId != null) {
            updateArea(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addArea(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除地域信息编号为"' + row.areaId + '"的数据项？').then(function() {
        return delArea(row.areaId)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    }
  }
}
</script>

