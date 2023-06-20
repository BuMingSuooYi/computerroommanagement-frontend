<template>
  <div class='container'>
    <div class='form-content'>
      <el-form :inline='true' :model='computerForm' class='demo-form-inline'>
        <el-form-item label='电脑编号 '>
          <el-input v-model.trim='computerForm.number' placeholder='请输入电脑编号'></el-input>
        </el-form-item>

        <el-form-item label='机器状态'>
          <el-select v-model='computerForm.state' placeholder='请选择机器状态'>
            <el-option value='0' label='空闲'></el-option>
            <el-option value='1' label='被占用'></el-option>
            <el-option value='2' label='维修中'></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label='所属机房'>
          <el-input v-model.trim='computerForm.machineRoom' placeholder='请输入机房编号'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' icon='el-icon-search' @click='querySubmit'>查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class='handle-group'>
      <el-button type='success'>下载<i class='el-icon-download el-icon--right'></i></el-button>
      <el-button type='primary' @click='handleEditOrAdd(-1,"新增")' plain>+ 新增</el-button>
    </div>
    <div class='table-content'>
      <el-table v-loading='tableLoading'
                :data='computerData'
                tooltip-effect='dark'
                border
                stripe
                style='width: 100%;background-color: #3A71A8'
                :header-cell-style="{ background: '#f5f7fa' }">
        <el-table-column label='序号' type='index' width='120'>

        </el-table-column>
        <el-table-column prop='number' label='电脑编号' width='170'>
        </el-table-column>

        <el-table-column prop='configuration' label='配置' width='170'>
        </el-table-column>

        <el-table-column prop='machine_room' label='机房名' width='170'>
        </el-table-column>

        <el-table-column prop='camera_stand' label='座位号' width='180'>
        </el-table-column>

        <el-table-column prop='state' label='状态' width='180'>
          <template slot-scope='scope'>
          <span v-if='scope.row.type === 0'>空闲</span>
          <span v-else-if='scope.row.type === 1'>使用中</span>
          <span v-else-if='scope.row.type === 2'>维修中</span>
        </template>
        </el-table-column>

        <el-table-column label='操作' fixed='right'>
          <template slot-scope='scope'>
            <el-button size='mini' type='danger' @click='handleDelete(null, scope.row.id)'>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     @size-change='handleSizeChange'
                     @current-change='handleCurrentChange'
                     :current-page.sync='page'
                     :page-sizes='pageSizes'
                     :page-size='pageSize'
                     layout='total, sizes, prev, pager, next, jumper'
                     :total='totalDataSize'>
      </el-pagination>
    </div>
    <UploadForm />
    <ComputerForm v-if='showDialog'
                 ref='computerForm'
                 :action-type='actionType'
                 @closeDialog='closeDialog' />
  </div>
</template>

<script>
import { getComputerByPage, deleteComputerById } from '@/api/basic/computer';
import { mapMutations, mapState } from 'vuex';
import ComputerForm from '@/components/page/computer/computer/modules/ComputerForm.vue';

/**
 * 参考教程 https://www.jianshu.com/p/01720959efdb/
 */
export default {
  name: 'Computer',
  components: {
    ComputerForm
  },
  created() {
    // 初始化数据
    this.initComputerData();
    // 监听是否需要刷新书库
    this.$watch('uploadSuccess', this.refreshData);
  },
  data() {
    return {
      tableLoading: false,  // 加载动画
      //电脑表单（查询条件）
      computerForm: {
        number: '',//编号
        state: '0',//状态
        machineRoom: ''//所属机房
      },
      // 表格所有数据
      computerData: [
        {
          id: 1,
          number: '0001',
          configuration: 0,
          machine_room: 1,
          camera_stand: 20,
          state: 0,
        }
      ],
      showDialog: false,
      actionType: '',// 操作类型
      // 分页数据
      page: 1,  // 当前第几页
      pageSize: 8,  // 当前每页大小
      pageSizes: [8, 10, 15], // 每页大小
      totalDataSize: 0, // 数据总条数
      // 选中的账户
      selectedComputer: {},
    };
  },
  computed: {
    ...mapState(['uploadSuccess'])
  },
  methods: {
    // 使用了mapMutations辅助函数将toggleUploadDialog mutation映射到组件中的toggleUploadDialog方法。
    ...mapMutations(['toggleUploadDialog', 'refreshTableData']),
    /**
     * 刷新数据监听
     * @param newVal
     * @param oldVal
     */
    refreshData(newVal, oldVal) {
      // 在shouldRefreshData状态变化时执行的操作
      if (newVal) {
        this.initComputerData();
        this.refreshTableData(false);
      }
    },
    /**
     * 初始化电脑表格信息
     * @returns {Promise<void>}
     */
    initComputerData: async function() {
      this.tableLoading = true;
      // 定义请求参数 (查询条件)
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        number: this.computerForm.number ? this.computerForm.number : '',
        state: this.computerForm.state ? this.computerForm.state : -1,
        machineRoom: this.computerForm.machineRoom ? this.computerForm.machineRoom : ''
      };
      await getComputerByPage(params).then(res => {
        if (res.code === 200) {
          // 存储请求到的后端数据
          this.computerData = res.data.records;
          for (let index = 0; index < this.computerData.length; index++) {
            this.computerData[index].isDisabled === 1 ? this.computerData[index].isDisabled = true : this.computerData[index].isDisabled = false;
          }
          // 设置数据总条数
          this.totalDataSize = res.data.total;
          this.tableLoading = false;
        }
      }).catch(err => {
        this.$message.error('请求出错了：' + err);
      });
    },
    /**
     * 添加账户
     */
    handleEditOrAdd(row, type) {
      this.actionType = type;
      if (this.actionType === '新增') {
        this.selectedComputer = {
          configurationId: '',//配置号
          machine_roomId: '',//机房
          seatNum: ''//座位号
        };
      } else {
        this.selectedComputer = row;
      }
      this.showDialog = true;
      // 对话框展开
      this.$nextTick(() => {
        this.$refs['computerForm'].showDialog = true;
      });

    },
    /**
     * 根据id删除账户
     * @param id
     */
    handleDelete(id) {
      this.$confirm('此操作将永久删除账户信息, 是否继续?', '确定删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 批量删除或单条数据删除，走同一个后端接口
        deleteComputerById(id).then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            });
            // 重新查询更新数据
            this.querySubmit();
          } else {
            this.$message({ type: 'error', message: res.msg || '操作失败' });
          }
        }).catch(err => {
          this.$message({ type: 'error', message: '请求出错了：' + err });
        });
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    },
    /**
     * 切换每页多少条数据
     * @param val  每页数据量
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.initComputerData();
    },
    /**
     * 切换第几页
     * @param val 第几页
     */
    handleCurrentChange(val) {
      this.page = val;
      this.initComputerData();
    },

    /**
     * 条件查询角色
     */
    querySubmit() {
      this.page = 1;  // 设置查询第page页或者第一页
      this.initComputerData();
    },

    /**
     * 关闭对话框
     * @param changeInfo 数据更新, true:更新，false:未更新
     */
    closeDialog(changeInfo) {
      // 数据改变，重新刷新表格数据
      if (changeInfo) {
        this.initComputerData();
      }
      // 关闭对话框
      this.showDialog = false;
    }
  }
};
</script>

<style scoped>

.table-content {
  padding-right: 20px;
}

.handle-group {
  height: 45px;
}

.el-pagination {
  border-bottom: 1px solid #dfe6ec;
  border-left: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  margin-top: 0px;
  height: 48px;
  display: flex;
  align-items: center;
}

/deep/ .el-table .cell {
  word-break: keep-all;
}
</style>
