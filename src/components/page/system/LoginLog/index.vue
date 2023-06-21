<template>
    <div class='container'>
        <div class='form-content'>
            <el-form :inline='true' :model='loginLogForm' class='demo-form-inline'>
                <el-form-item label='用户名'>
                    <el-input v-model='loginLogForm.username' placeholder='请输入用户名'></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' icon='el-icon-search' @click='querySubmit'>查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class='handle-group'>
            <el-button type='danger' @click="handleDelete('批量', null)">批量删除</el-button>
        </div>
        <div class='table-content'>
            <el-table v-loading='tableLoading' ref='multipleTable' :data='loginLogData' tooltip-effect='dark' border
                      stripe
                      style='width: 100%;background-color: #3A71A8' :header-cell-style="{ background: '#f5f7fa' }"
                      @selection-change='handleSelectionChange'>
                <el-table-column type='selection' width='55'>
                </el-table-column>
                <el-table-column label='序号' type='index' width='55'>
                </el-table-column>
                <el-table-column prop='username' label='用户' width='160'>

                </el-table-column>
                <el-table-column prop='loginTime' label='登陆时间' width='160'>

                </el-table-column>

                <el-table-column prop='loginIp' label='登陆IP' width='160'>

                </el-table-column>

                <el-table-column prop='status' label='登陆状态' width='160'>
                    <template slot-scope='scope'>
                        <span v-if='scope.row.status === 1'>登陆成功</span>
                        <span v-else-if='scope.row.status === 0'>登录失败</span>
                    </template>
                </el-table-column>

                <el-table-column prop='info' label='其他说明' width='160'>
                </el-table-column>

                <el-table-column label='操作' width='180' fixed='right'>
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
import { deleteLoginLogById, getLoginLogByPage } from '@/api/basic/loiginLog';

export default {
    name: 'LoginLog',

    created() {
        this.initLoginLog();
    },
    data() {
        return {
            tableLoading: false,  // 加载动画
            showDialog: false,  // 对话框显隐
            selectedLoginLog: {},  // 选中的登录日志数据
            // 登录日志表单信息(查询条件）
            loginLogForm: {
                username: '' // 姓名
            },
            // 分页数据
            page: 1,  // 当前第几页
            pageSize: 8,  // 当前每页大小
            pageSizes: [8, 10, 15], // 每页大小
            totalDataSize: 0,  // 数据总条数
            multipleSelectionLoginLog: [],  // 批量选中登录日志数据的id
            loginLogData: [] // 登录日志所有数据
        };
    },
    methods: {
        /**
         * 初始化所有登录日志数据
         * @returns {Promise<void>}
         */
        initLoginLog: async function() {
            this.tableLoading = true;
            // 定义请求参数 (查询条件),看文档
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                username: this.loginLogForm.username ? this.loginLogForm.username : ''
            };
            await getLoginLogByPage(params).then(res => {
                if (res.code === 200) {
                    // 设置数据总条数
                    this.totalDataSize = res.data.total;
                    this.tableLoading = false;
                    // 存储请求到的数据
                    this.loginLogData = res.data.records;
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
            this.initLoginLog();
        },
        /**
         * 切换第几页
         * @param val 第几页
         */
        handleCurrentChange(val) {
            this.page = val;
            this.initLoginLog();
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
            this.multipleSelectionLoginLog = selected;
        },

        /**
         * 删除登录日志
         * @param type 批量或者单个删除
         * @param id  主键
         * @returns {ElMessageComponent}
         */
        handleDelete(type, id) {
            // 判断批量删除数据
            if (type === '批量' && id === null) {
                // 当前没有选中数据
                if (this.multipleSelectionLoginLog.length === 0) {
                    return this.$message({ type: 'error', message: '请选择删除对象' });
                }
            }
            this.$confirm('此操作将永久删除选中登录日志信息, 是否继续?', '确定删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 批量删除或单条数据删除，走同一个后端接口
                deleteLoginLogById(type === '批量' ? this.multipleSelectionLoginLog.join(',') : id).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除' + type === '批量' ? this.multipleSelectionLoginLog.length + '条数据成功！' : '成功！'
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
         * 条件查询登录日志
         */
        querySubmit() {
            this.page = 1;  // 设置查询第page页或者第一页
            this.initLoginLog();
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
