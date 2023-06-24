<template>
    <div class='container'>
        <div class='form-content'>
            <el-form :inline='true' :model='accountForm' class='demo-form-inline'>
                <el-form-item label='用户名'>
                    <el-input v-model.trim='accountForm.username' placeholder='请输入用户名'></el-input>
                </el-form-item>
                <el-form-item label='人员类型'>
                    <el-select v-model='accountForm.type' placeholder='请选择人员类型' clearable>
                        <el-option value='0' label='系统管理员'></el-option>
                        <el-option value='1' label='机房管理员'></el-option>
                        <el-option value='2' label='学生'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='是否账户禁用'>
                    <el-select v-model='accountForm.isDisabled' placeholder='请选择是否账户禁用' clearable>
                        <el-option value='0' label='未禁用'></el-option>
                        <el-option value='1' label='禁用'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' icon='el-icon-search' @click='querySubmit'>查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class='handle-group'>
            <el-button type='success' @click='showUploadFileDialog'>上传<i class='el-icon-upload el-icon--right'></i>
            </el-button>
            <el-button type='success' @click='exportExcel'>下载<i class='el-icon-download el-icon--right'></i>
            </el-button>
            <el-button type='primary' @click='handleEditOrAdd(null,"新增")' plain>+ 新增</el-button>
        </div>
        <div class='table-content'>
            <el-table v-loading='tableLoading'
                      :data='accountData'
                      tooltip-effect='dark'
                      border
                      stripe
                      style='width: 100%;background-color: #3A71A8'
                      :header-cell-style="{ background: '#f5f7fa' }">
                <el-table-column label='序号' type='index' width='120'>

                </el-table-column>
                <el-table-column prop='username' label='用户名' width='170'>
                </el-table-column>

                <el-table-column prop='type' label='人员类型' width='170'>
                    <template slot-scope='scope'>
                        <span v-if='scope.row.type === 0'>系统管理员</span>
                        <span v-else-if='scope.row.type === 1'>机房管理员</span>
                        <span v-else-if='scope.row.type === 2'>学生</span>
                    </template>
                </el-table-column>

                <el-table-column prop='isDisabled' label='账户禁用' width='170'>
                    <template slot-scope='scope'>
                        <el-switch v-model='scope.row.isDisabled' @change='changeStatus($event, scope.row)'></el-switch>
                    </template>
                </el-table-column>

                <el-table-column prop='createTime' label='创建时间' width='180'>
                </el-table-column>

                <el-table-column prop='updateTime' label='更新时间' width='180'>
                </el-table-column>

                <el-table-column label='操作' fixed='right'>
                    <template slot-scope='scope'>
                        <el-button size='mini' type='danger' @click='handleDelete( scope.row.id)'>删除
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
        <UploadForm :upload-url='uploadUrl' />
        <AccountForm v-if='showDialog'
                     ref='accountForm'
                     :action-type='actionType'
                     @closeDialog='closeDialog' />
    </div>
</template>

<script>
import { getAccountByPage, deleteAccountById, editAccount, exportAccount } from '@/api/basic/account';
import UploadForm from '@/components/page/common/UploadForm.vue';
import { mapMutations, mapState } from 'vuex';
import AccountForm from '@/components/page/basic/account/modules/AccountForm.vue';

export default {
    name: 'Account',
    components: {
        AccountForm,
        UploadForm
    },
    created() {
        // 初始化数据
        this.initAccountData();
        // 监听是否需要刷新书库
        this.$watch('uploadSuccess', this.refreshData);
    },
    data() {
        return {
            uploadUrl: '/account/uploadExcel',
            tableLoading: false,  // 加载动画
            // 角色表单信息(查询条件）
            accountForm: {
                username: '',// 用户名
                type: '',// 人员类型
                isDisabled: '' // 账户是否禁用
            },
            // 表格所有数据
            accountData: [],
            showDialog: false,
            actionType: '',// 操作类型
            // 分页数据
            page: 1,  // 当前第几页
            pageSize: 6,  // 当前每页大小
            pageSizes: [6, 10, 15], // 每页大小
            totalDataSize: 0, // 数据总条数
            // 选中的账户
            selectedAccount: {}
        };
    },
    computed: {
        ...mapState(['uploadSuccess'])
    },
    methods: {
        exportExcel() {
            exportAccount().then(res => {
                const downloadUrl = window.URL.createObjectURL(new Blob([res]));
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', 'Account.xlsx'); // 设置文件名
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                this.$message.success('导出成功');

            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },
        // 使用了mapMutations辅助函数将toggleUploadDialog mutation映射到组件中的toggleUploadDialog方法。
        ...mapMutations(['toggleUploadDialog', 'refreshTableData']),
        /**
         * 展示上传文件对话框
         */
        showUploadFileDialog() {
            this.toggleUploadDialog(true);
        },
        /**
         * 刷新数据监听
         * @param newVal
         * @param oldVal
         */
        refreshData(newVal, oldVal) {
            // 在shouldRefreshData状态变化时执行的操作
            if (newVal) {
                this.initAccountData();
                this.refreshTableData(false);
            }
        },
        /**
         * 初始化账户表格信息
         * @returns {Promise<void>}
         */
        initAccountData: async function() {
            this.tableLoading = true;
            // 定义请求参数 (查询条件)
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                username: this.accountForm.username ? this.accountForm.username : '',
                type: this.accountForm.type ? this.accountForm.type : -1,
                isDisabled: this.accountForm.isDisabled ? this.accountForm.isDisabled : -1
            };
            await getAccountByPage(params).then(res => {
                if (res.code === 200) {
                    // 存储请求到的后端数据
                    this.accountData = res.data.records;
                    for (let index = 0; index < this.accountData.length; index++) {
                        this.accountData[index].isDisabled === 1 ? this.accountData[index].isDisabled = true : this.accountData[index].isDisabled = false;
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
                this.selectedAccount = {
                    username: '',
                    password: '',
                    type: ''
                };
            } else {
                this.selectedAccount = row;
            }
            this.showDialog = true;
            // 对话框展开
            this.$nextTick(() => {
                this.$refs['accountForm'].showDialog = true;
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
                // 单条数据删除
                deleteAccountById(id).then(res => {
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
         * 禁用操作
         * @param $event
         * @param row
         */
        changeStatus($event, row) {
            //前端显示的数据
            row.isDisabled === true ? row.isDisabled = 1 : row.isDisabled = 0; //true为1，false为0
            editAccount(row).then(res => {
                if (res.code === 200) {
                    this.$message({ type: 'success', message: '账户信息更新成功！' });
                    this.querySubmit();
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },
        /**
         * 切换每页多少条数据
         * @param val  每页数据量
         */
        handleSizeChange(val) {
            this.pageSize = val;
            this.initAccountData();
        },
        /**
         * 切换第几页
         * @param val 第几页
         */
        handleCurrentChange(val) {
            this.page = val;
            this.initAccountData();
        },

        /**
         * 条件查询角色
         */
        querySubmit() {
            this.page = 1;  // 设置查询第page页或者第一页
            this.initAccountData();
        },

        /**
         * 关闭对话框
         * @param changeInfo 数据更新, true:更新，false:未更新
         */
        closeDialog(changeInfo) {
            // 数据改变，重新刷新表格数据
            if (changeInfo) {
                this.initAccountData();
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
    margin-top: 0;
    height: 48px;
    display: flex;
    align-items: center;
}

/deep/ .el-table .cell {
    word-break: keep-all;
}
</style>
