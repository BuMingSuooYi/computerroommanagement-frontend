<template>
    <div class='container'>
        <div class='form-content'>
            <el-form :inline='true' :model='accountForm' class='demo-form-inline'>
                <el-form-item label='用户名'>
                    <el-input placeholder='请输入用户名'></el-input>
                </el-form-item>
                <el-form-item label='是否账户禁用'>
                    <el-select v-model='accountForm.isDisabled' placeholder='请选择是否账户禁用'>
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
            <el-button type='success'>上传<i class='el-icon-upload el-icon--right'></i></el-button>
            <el-button type='success'>下载<i class='el-icon-download el-icon--right'></i></el-button>
            <el-button type='primary' @click="handleAdd(null, '新增')" plain>+ 新增</el-button>
        </div>
        <div class='table-content'>
            <el-table v-loading='tableLoading' ref='multipleTable' :data='accountData' tooltip-effect='dark' border
                      stripe
                      style='width: 100%;background-color: #3A71A8' :header-cell-style="{ background: '#f5f7fa' }"
                      @selection-change='handleSelectionChange'>
                <el-table-column label='序号' type='index' width='120'>
                </el-table-column>
                <el-table-column prop='username' label='用户名' width='170'>
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
                        <el-button size='mini' type='danger' @click='handleDelete(null, scope.row.id)'>删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background @size-change='handleSizeChange' @current-change='handleCurrentChange'
                           :current-page.sync='page' :page-sizes='pageSizes' :page-size='pageSize'
                           layout='total, sizes, prev, pager, next, jumper' :total='totalDataSize'>
            </el-pagination>
        </div>

    </div>
</template>

<script>
/**
 * 参考教程 https://www.jianshu.com/p/01720959efdb/
 */
export default {
    name: 'Account',
    components: {
        // AccountForm,
    },
    created() {
        // this.initAccount()
    },
    data() {
        return {
            tableLoading: false,  // 加载动画
            showDialog: false,  // 对话框显隐
            actionType: '',  // 操作类型
            selectedAccount: {},  // 选中的角色数据
            // 角色表单信息(查询条件）
            accountForm: {
                isDisabled: '', // 编号
                isStaff: ''  // 名称
            },
            // 分页数据
            page: 1,  // 当前第几页
            pageSize: 8,  // 当前每页大小
            pageSizes: [8, 10, 15], // 每页大小
            totalDataSize: 0,  // 数据总条数
            multipleSelectionAccount: [],  // 批量选中角色数据的id
            accountData: [] // 角色所有数据
        };
    },
    methods: {

        /**
         * 切换每页多少条数据
         * @param val  每页数据量
         */
        handleSizeChange(val) {
            this.pageSize = val;
            // this.initAccount()
        },
        /**
         * 切换第几页
         * @param val 第几页
         */
        handleCurrentChange(val) {
            this.page = val;
            // this.initAccount()
        },
        /**
         * 获取所有选中的数据
         * @param val 所有选中行
         */
        handleSelectionChange(val) {
            // 遍历循环取出所有选中项的主键
            let selected = [];
            val.forEach((i) => {
                selected.push(i.id);
            });
            // this.multipleSelectionAccount = selected
        },

        /**
         * 删除角色
         * @param type 批量或者单个删除
         * @param id  主键
         * @returns {ElMessageComponent}
         */
        handleDelete(type, id) {
            // 判断批量删除数据
            if (type === '批量' && id === null) {
                // 当前没有选中数据
                if (this.multipleSelectionAccount.length === 0) {
                    return this.$message({ type: 'error', message: '请选择删除对象' });
                }
            }
            this.$confirm('此操作将永久删除选中角色信息, 是否继续?', '确定删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 批量删除或单条数据删除，走同一个后端接口
                deleteAccount(type === '批量' ? this.multipleSelectionAccount.join(',') : id).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除' + type === '批量' ? this.multipleSelectionAccount.length + '条数据成功！' : '成功！'
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
         * 条件查询角色
         */
        querySubmit() {
            this.page = 1;  // 设置查询第page页或者第一页
            // this.initAccount()
        },
        /**
         * 编辑或者添加角色
         * @param row 选中行
         * @param type 操作类型（新增，删除）
         */
        handleAdd(row, type) {
            this.selectedAccount = {
                username: '',
                password: '',
                isStaff: '',
                userId: ''
            };
            this.showDialog = true;
            // 对话框展开
            this.$nextTick(() => {
                this.$refs['accountForm'].showDialog = true;
            });
        },
        /**
         * 关闭对话框
         * @param changeInfo 数据更新（0：未更新，1：更新）
         */
        closeDialog(changeInfo) {
            // 数据改变，重新刷新表格数据
            if (changeInfo) {
                // this.initAccount()
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
