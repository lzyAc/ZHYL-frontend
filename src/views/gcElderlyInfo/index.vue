<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="老人姓名" prop="elderlyName">
        <el-input
          v-model="queryParams.elderlyName"
          placeholder="请输入老人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出生日期" prop="birthDate">
        <el-date-picker clearable
          v-model="queryParams.birthDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择出生日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="所属机构 ID" prop="orgId">
        <el-input
          v-model="queryParams.orgId"
          placeholder="请输入所属机构 ID"
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
      <el-form-item label="紧急联系人姓名" prop="emergencyContact">
        <el-input
          v-model="queryParams.emergencyContact"
          placeholder="请输入紧急联系人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="紧急联系人电话" prop="emergencyPhone">
        <el-input
          v-model="queryParams.emergencyPhone"
          placeholder="请输入紧急联系人电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="家庭住址" prop="address">
        <el-input
          v-model="queryParams.address"
          placeholder="请输入家庭住址"
          clearable
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
          v-hasPermi="['gcElderlyInfo:gcElderlyInfo:add']"
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
          v-hasPermi="['gcElderlyInfo:gcElderlyInfo:edit']"
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
          v-hasPermi="['gcElderlyInfo:gcElderlyInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['gcElderlyInfo:gcElderlyInfo:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gcElderlyInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="老人 ID" align="center" prop="elderlyId" />
      <el-table-column label="老人姓名" align="center" prop="elderlyName" />
      <el-table-column label="性别 (M: 男, F: 女)" align="center" prop="gender" />
      <el-table-column label="出生日期" align="center" prop="birthDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属机构 ID" align="center" prop="orgId" />
      <el-table-column label="联系电话" align="center" prop="phoneNumber" />
      <el-table-column label="紧急联系人姓名" align="center" prop="emergencyContact" />
      <el-table-column label="紧急联系人电话" align="center" prop="emergencyPhone" />
      <el-table-column label="家庭住址" align="center" prop="address" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['gcElderlyInfo:gcElderlyInfo:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['gcElderlyInfo:gcElderlyInfo:remove']"
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

    <!-- 添加或修改老人信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="老人姓名" prop="elderlyName">
          <el-input v-model="form.elderlyName" placeholder="请输入老人姓名" />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <el-date-picker clearable
            v-model="form.birthDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择出生日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属机构 ID" prop="orgId">
          <el-input v-model="form.orgId" placeholder="请输入所属机构 ID" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="紧急联系人姓名" prop="emergencyContact">
          <el-input v-model="form.emergencyContact" placeholder="请输入紧急联系人姓名" />
        </el-form-item>
        <el-form-item label="紧急联系人电话" prop="emergencyPhone">
          <el-input v-model="form.emergencyPhone" placeholder="请输入紧急联系人电话" />
        </el-form-item>
        <el-form-item label="家庭住址" prop="address">
          <el-input v-model="form.address" placeholder="请输入家庭住址" />
        </el-form-item>
        <el-divider content-position="center">健康档案记录信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddgcHealthRecord">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeletegcHealthRecord">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="gcHealthRecordList" :row-class-name="rowgcHealthRecordIndex" @selection-change="handlegcHealthRecordSelectionChange" ref="gcHealthRecord">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="记录日期" prop="recordDate" width="240">
            <template slot-scope="scope">
              <el-date-picker clearable v-model="scope.row.recordDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择记录日期" />
            </template>
          </el-table-column>
          <el-table-column label="健康状况描述" prop="healthStatus" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.healthStatus" placeholder="请选择健康状况描述">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="身高 (cm)" prop="height" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.height" placeholder="请输入身高 (cm)" />
            </template>
          </el-table-column>
          <el-table-column label="体重 (kg)" prop="weight" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.weight" placeholder="请输入体重 (kg)" />
            </template>
          </el-table-column>
          <el-table-column label="血压" prop="bloodPressure" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bloodPressure" placeholder="请输入血压" />
            </template>
          </el-table-column>
          <el-table-column label="血糖 (mmol/L)" prop="bloodSugar" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.bloodSugar" placeholder="请输入血糖 (mmol/L)" />
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
import { listGcElderlyInfo, getGcElderlyInfo, delGcElderlyInfo, addGcElderlyInfo, updateGcElderlyInfo } from "@/api/gcElderlyInfo/gcElderlyInfo/gcElderlyInfo";

export default {
  name: "GcElderlyInfo",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedgcHealthRecord: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 老人信息表格数据
      gcElderlyInfoList: [],
      // 健康档案记录表格数据
      gcHealthRecordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        elderlyName: null,
        gender: null,
        birthDate: null,
        orgId: null,
        phoneNumber: null,
        emergencyContact: null,
        emergencyPhone: null,
        address: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        elderlyName: [
          { required: true, message: "老人姓名不能为空", trigger: "blur" }
        ],
        gender: [
          { required: true, message: "性别 (M: 男, F: 女)不能为空", trigger: "blur" }
        ],
        birthDate: [
          { required: true, message: "出生日期不能为空", trigger: "blur" }
        ],
        orgId: [
          { required: true, message: "所属机构 ID不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询老人信息列表 */
    getList() {
      this.loading = true;
      listGcElderlyInfo(this.queryParams).then(response => {
        this.gcElderlyInfoList = response.rows;
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
        elderlyId: null,
        elderlyName: null,
        gender: null,
        birthDate: null,
        orgId: null,
        phoneNumber: null,
        emergencyContact: null,
        emergencyPhone: null,
        address: null,
        status: null,
        createTime: null,
        updateTime: null
      };
      this.gcHealthRecordList = [];
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
      this.ids = selection.map(item => item.elderlyId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加老人信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const elderlyId = row.elderlyId || this.ids
      getGcElderlyInfo(elderlyId).then(response => {
        this.form = response.data;
        this.gcHealthRecordList = response.data.gcHealthRecordList;
        this.open = true;
        this.title = "修改老人信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.gcHealthRecordList = this.gcHealthRecordList;
          if (this.form.elderlyId != null) {
            updateGcElderlyInfo(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGcElderlyInfo(this.form).then(response => {
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
      const elderlyIds = row.elderlyId || this.ids;
      this.$modal.confirm('是否确认删除老人信息编号为"' + elderlyIds + '"的数据项？').then(function() {
        return delGcElderlyInfo(elderlyIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
	/** 健康档案记录序号 */
    rowgcHealthRecordIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 健康档案记录添加按钮操作 */
    handleAddgcHealthRecord() {
      let obj = {};
      obj.recordDate = "";
      obj.healthStatus = "";
      obj.height = "";
      obj.weight = "";
      obj.bloodPressure = "";
      obj.bloodSugar = "";
      obj.remarks = "";
      this.gcHealthRecordList.push(obj);
    },
    /** 健康档案记录删除按钮操作 */
    handleDeletegcHealthRecord() {
      if (this.checkedgcHealthRecord.length == 0) {
        this.$modal.msgError("请先选择要删除的健康档案记录数据");
      } else {
        const gcHealthRecordList = this.gcHealthRecordList;
        const checkedgcHealthRecord = this.checkedgcHealthRecord;
        this.gcHealthRecordList = gcHealthRecordList.filter(function(item) {
          return checkedgcHealthRecord.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handlegcHealthRecordSelectionChange(selection) {
      this.checkedgcHealthRecord = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('gcElderlyInfo/gcElderlyInfo/export', {
        ...this.queryParams
      }, `gcElderlyInfo_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
