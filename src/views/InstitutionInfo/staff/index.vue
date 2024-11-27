<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="服务人员姓名" prop="staffName">
        <el-input
          v-model="queryParams.staffName"
          placeholder="服务人员姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input
          v-model="queryParams.phoneNumber"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="邮箱" prop="email">-->
<!--        <el-input-->
<!--          v-model="queryParams.email"-->
<!--          placeholder="请输入邮箱"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="机构" prop="orgId">
        <el-input
          v-model="queryParams.orgId"
          placeholder="所属机构ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职位" prop="position">
        <el-input
          v-model="queryParams.position"
          placeholder="请输入职位"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="入职日期" prop="hireDate">-->
<!--        <el-date-picker clearable-->
<!--          v-model="queryParams.hireDate"-->
<!--          type="date"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          placeholder="请选择入职日期">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="创建人" prop="createdBy">-->
<!--        <el-input-->
<!--          v-model="queryParams.createdBy"-->
<!--          placeholder="创建人 ID"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="修改人" prop="updatedBy">-->
<!--        <el-input-->
<!--          v-model="queryParams.updatedBy"-->
<!--          placeholder="修改人 ID"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
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
          v-hasPermi="['InstitutionInfo:staff:add']"
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
          v-hasPermi="['InstitutionInfo:staff:edit']"
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
          v-hasPermi="['InstitutionInfo:staff:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['InstitutionInfo:staff:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="staffList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="服务人员ID" align="center" prop="id" />
      <el-table-column label="服务人员姓名" align="center" prop="staffName" />
      <el-table-column label="性别 (M: 男, F: 女)" align="center" prop="gender" />
      <el-table-column label="联系电话" align="center" prop="phoneNumber" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="所属机构ID" align="center" prop="orgId" />
      <el-table-column label="职位" align="center" prop="position" />
      <el-table-column label="入职日期" align="center" prop="hireDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.hireDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态 (active: 在职, inactive: 离职)" align="center" prop="status" />
      <el-table-column label="创建人 ID" align="center" prop="createdBy" />
      <el-table-column label="修改人 ID" align="center" prop="updatedBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['InstitutionInfo:staff:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['InstitutionInfo:staff:remove']"
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

    <!-- 添加或修改服务人员管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="服务人员姓名" prop="staffName">
          <el-input v-model="form.staffName" placeholder="请输入服务人员姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="机构ID" prop="orgId">
          <el-input v-model="form.orgId" placeholder="请输入所属机构ID，关联gc_organization表" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="入职日期" prop="hireDate">
          <el-date-picker clearable
            v-model="form.hireDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择入职日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建人 ID" prop="createdBy">
          <el-input v-model="form.createdBy" placeholder="请输入创建人 ID" />
        </el-form-item>
        <el-form-item label="修改人 ID" prop="updatedBy">
          <el-input v-model="form.updatedBy" placeholder="请输入修改人 ID" />
        </el-form-item>
        <el-divider content-position="center">养老机构信息信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddGcOrganization">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteGcOrganization">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="gcOrganizationList" :row-class-name="rowGcOrganizationIndex" @selection-change="handleGcOrganizationSelectionChange" ref="gcOrganization">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="机构名称" prop="orgName" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.orgName" placeholder="请输入机构名称" />
            </template>
          </el-table-column>
          <el-table-column label="机构地址" prop="orgAddress" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.orgAddress" placeholder="请输入机构地址" />
            </template>
          </el-table-column>
          <el-table-column label="联系电话" prop="contactPhone" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.contactPhone" placeholder="请输入联系电话" />
            </template>
          </el-table-column>
          <el-table-column label="联系邮箱" prop="contactEmail" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.contactEmail" placeholder="请输入联系邮箱" />
            </template>
          </el-table-column>
          <el-table-column label="创建人 ID" prop="createdBy" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.createdBy" placeholder="请输入创建人 ID" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createdTime" width="240">
            <template slot-scope="scope">
              <el-date-picker clearable v-model="scope.row.createdTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择创建时间" />
            </template>
          </el-table-column>
          <el-table-column label="修改人 ID" prop="updatedBy" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.updatedBy" placeholder="请输入修改人 ID" />
            </template>
          </el-table-column>
          <el-table-column label="修改时间" prop="updatedTime" width="240">
            <template slot-scope="scope">
              <el-date-picker clearable v-model="scope.row.updatedTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择修改时间" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStaff, getStaff, delStaff, addStaff, updateStaff } from "@/api/InstitutionInfo/staff";

export default {
  name: "Staff",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedGcOrganization: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 服务人员管理表格数据
      staffList: [],
      // 养老机构信息表格数据
      gcOrganizationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        staffName: null,
        gender: null,
        phoneNumber: null,
        email: null,
        orgId: null,
        position: null,
        hireDate: null,
        status: null,
        createdBy: null,
        updatedBy: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        staffName: [
          { required: true, message: "服务人员姓名不能为空", trigger: "blur" }
        ],
        gender: [
          { required: true, message: "性别 (M: 男, F: 女)不能为空", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" }
        ],
        orgId: [
          { required: true, message: "所属机构ID", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询服务人员管理列表 */
    getList() {
      this.loading = true;
      listStaff(this.queryParams).then(response => {
        this.staffList = response.rows;
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
        id: null,
        staffName: null,
        gender: null,
        phoneNumber: null,
        email: null,
        orgId: null,
        position: null,
        hireDate: null,
        status: null,
        createTime: null,
        updateTime: null,
        createdBy: null,
        updatedBy: null
      };
      this.gcOrganizationList = [];
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加服务人员管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getStaff(id).then(response => {
        this.form = response.data;
        this.gcOrganizationList = response.data.gcOrganizationList;
        this.open = true;
        this.title = "修改服务人员管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.gcOrganizationList = this.gcOrganizationList;
          if (this.form.id != null) {
            updateStaff(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStaff(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除服务人员管理编号为"' + ids + '"的数据项？').then(function() {
        return delStaff(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 养老机构信息序号 */
    rowGcOrganizationIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 养老机构信息添加按钮操作 */
    handleAddGcOrganization() {
      let obj = {};
      obj.orgName = "";
      obj.orgAddress = "";
      obj.description = "";
      obj.orgImage = "";
      obj.contactPhone = "";
      obj.contactEmail = "";
      obj.createdBy = "";
      obj.createdTime = "";
      obj.updatedBy = "";
      obj.updatedTime = "";
      this.gcOrganizationList.push(obj);
    },
    /** 养老机构信息删除按钮操作 */
    handleDeleteGcOrganization() {
      if (this.checkedGcOrganization.length == 0) {
        this.$modal.msgError("请先选择要删除的养老机构信息数据");
      } else {
        const gcOrganizationList = this.gcOrganizationList;
        const checkedGcOrganization = this.checkedGcOrganization;
        this.gcOrganizationList = gcOrganizationList.filter(function(item) {
          return checkedGcOrganization.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleGcOrganizationSelectionChange(selection) {
      this.checkedGcOrganization = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('InstitutionInfo/staff/export', {
        ...this.queryParams
      }, `staff_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
