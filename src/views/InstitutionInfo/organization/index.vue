<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="机构名称" prop="orgName">
        <el-input
          v-model="queryParams.orgName"
          placeholder="请输入机构名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="机构地址" prop="orgAddress">
        <el-input
          v-model="queryParams.orgAddress"
          placeholder="请输入机构地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="联系电话" prop="contactPhone">-->
<!--        <el-input-->
<!--          v-model="queryParams.contactPhone"-->
<!--          placeholder="请输入联系电话"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="联系邮箱" prop="contactEmail">-->
<!--        <el-input-->
<!--          v-model="queryParams.contactEmail"-->
<!--          placeholder="请输入联系邮箱"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="创建人 ID" prop="createdBy">-->
<!--        <el-input-->
<!--          v-model="queryParams.createdBy"-->
<!--          placeholder="请输入创建人 ID"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="创建时间" prop="createdTime">-->
<!--        <el-date-picker clearable-->
<!--          v-model="queryParams.createdTime"-->
<!--          type="date"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          placeholder="请选择创建时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="修改人 ID" prop="updatedBy">-->
<!--        <el-input-->
<!--          v-model="queryParams.updatedBy"-->
<!--          placeholder="请输入修改人 ID"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="修改时间" prop="updatedTime">-->
<!--        <el-date-picker clearable-->
<!--          v-model="queryParams.updatedTime"-->
<!--          type="date"-->
<!--          value-format="yyyy-MM-dd"-->
<!--          placeholder="请选择修改时间">-->
<!--        </el-date-picker>-->
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
          v-hasPermi="['InstitutionInfo:organization:add']"
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
          v-hasPermi="['InstitutionInfo:organization:edit']"
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
          v-hasPermi="['InstitutionInfo:organization:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['InstitutionInfo:organization:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="organizationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="机构 ID" align="center" prop="orgId" />
      <el-table-column label="机构名称" align="center" prop="orgName" />
      <el-table-column label="机构地址" align="center" prop="orgAddress" />
      <el-table-column label="机构简介" align="center" prop="description" />
      <el-table-column label="机构图片路径" align="center" prop="orgImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.orgImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="contactPhone" />
      <el-table-column label="联系邮箱" align="center" prop="contactEmail" />
<!--      <el-table-column label="创建人 ID" align="center" prop="createdBy" />-->
      <el-table-column label="创建时间" align="center" prop="createdTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="修改人 ID" align="center" prop="updatedBy" />-->
      <el-table-column label="修改时间" align="center" prop="updatedTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['InstitutionInfo:organization:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['InstitutionInfo:organization:remove']"
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

    <!-- 添加或修改养老机构信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="机构名称" prop="orgName">
          <el-input v-model="form.orgName" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="机构地址" prop="orgAddress">
          <el-input v-model="form.orgAddress" placeholder="请输入机构地址" />
        </el-form-item>
        <el-form-item label="机构简介" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="机构图片路径" prop="orgImage">
          <image-upload v-model="form.orgImage"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="联系邮箱" prop="contactEmail">
          <el-input v-model="form.contactEmail" placeholder="请输入联系邮箱" />
        </el-form-item>
<!--        <el-form-item label="创建人 ID" prop="createdBy">-->
<!--          <el-input v-model="form.createdBy" placeholder="请输入创建人 ID" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="创建时间" prop="createdTime">-->
<!--          <el-date-picker clearable-->
<!--            v-model="form.createdTime"-->
<!--            type="date"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            placeholder="请选择创建时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="修改人 ID" prop="updatedBy">-->
<!--          <el-input v-model="form.updatedBy" placeholder="请输入修改人 ID" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="修改时间" prop="updatedTime">-->
<!--          <el-date-picker clearable-->
<!--            v-model="form.updatedTime"-->
<!--            type="date"-->
<!--            value-format="yyyy-MM-dd"-->
<!--            placeholder="请选择修改时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrganization, getOrganization, delOrganization, addOrganization, updateOrganization } from "@/api/InstitutionInfo/organization";

export default {
  name: "Organization",
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
      // 养老机构信息表格数据
      organizationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orgName: null,
        orgAddress: null,
        description: null,
        orgImage: null,
        contactPhone: null,
        contactEmail: null,
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orgName: [
          { required: true, message: "机构名称不能为空", trigger: "blur" }
        ],
        orgAddress: [
          { required: true, message: "机构地址不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询养老机构信息列表 */
    getList() {
      this.loading = true;
      listOrganization(this.queryParams).then(response => {
        this.organizationList = response.rows;
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
        orgId: null,
        orgName: null,
        orgAddress: null,
        description: null,
        orgImage: null,
        contactPhone: null,
        contactEmail: null,
        createdBy: null,
        createdTime: null,
        updatedBy: null,
        updatedTime: null
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
      this.ids = selection.map(item => item.orgId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加养老机构信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const orgId = row.orgId || this.ids
      getOrganization(orgId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改养老机构信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.orgId != null) {
            updateOrganization(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrganization(this.form).then(response => {
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
      const orgIds = row.orgId || this.ids;
      this.$modal.confirm('是否确认删除养老机构信息编号为"' + orgIds + '"的数据项？').then(function() {
        return delOrganization(orgIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/InstitutionInfo/organization/export', {
        ...this.queryParams
      }, `organization_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
