<template>
    <div class='container'>
        <div class='form-content'>
            <el-form :inline='true' :model='computerConfigurationForm' class='demo-form-inline'>

                <el-form-item label='硬件配置'>
                    <el-input v-model='computerConfigurationForm.hardware' placeholder='请输入硬件配置'></el-input>
                </el-form-item>

                <el-form-item label='软件配置'>
                    <el-input v-model='computerConfigurationForm.software' placeholder='请输入软件配置'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' icon='el-icon-search' @click='querySubmit'>查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class='handle-group'>
            <el-button type='primary' @click="handleEditOrAdd(null, '新增')" plain>+ 新增</el-button>
            <el-button type='danger' @click="handleDelete('批量', null)">批量删除</el-button>
        </div>
        <div class='table-content'>
            <el-table v-loading='tableLoading' ref='multipleTable' :data='computerConfigurationData'
                      tooltip-effect='dark' border stripe
                      style='width: 100%;background-color: #3A71A8' :header-cell-style="{ background: '#f5f7fa' }"
                      @selection-change='handleSelectionChange'>
                <el-table-column type='selection' width='55'>
                </el-table-column>
                <el-table-column label='序号' type='index' width='50'>
                </el-table-column>
                <el-table-column prop='number' label='电脑配置编号' width='120'>
                </el-table-column>
                <el-table-column prop='licensePlate' label='电脑配置号码' width='120'>
                </el-table-column>
                <el-table-column prop='type' label='车型' width='120'>
                    <template slot-scope='scope'>
                        <span v-if='scope.row.type === 1'>平板卡车</span>
                        <span v-else-if='scope.row.type === 2'>冷藏卡车</span>
                        <span v-else-if='scope.row.type === 3'>集装箱卡车</span>
                    </template>
                </el-table-column>
                <el-table-column prop='maxLoad' label='最大载重' width='120'>
                </el-table-column>
                <el-table-column prop='description' label='电脑配置描述' width='120'>
                </el-table-column>
                <el-table-column prop='driver' label='驾驶员' width='120'>
                    <template slot-scope='scope'>
                        <span>{{ scope.row.driverObject.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop='status' label='电脑配置状态' width='120'>
                    <template slot-scope='scope'>
                        <span v-if='scope.row.status === 1'>空闲</span>
                        <span v-else-if='scope.row.status === 2'>任务中</span>
                        <span v-else-if='scope.row.status === 3'>维修中</span>
                    </template>
                </el-table-column>

                <el-table-column label='操作'>
                    <template slot-scope='scope'>
                        <el-button size='mini' @click="handleEditOrAdd(scope.row, '编辑')">编辑
                        </el-button>
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

        <ComputerConfigurationForm v-if='showDialog' ref='computerConfigurationForm' :action-type='actionType'
                                   :selected-computerConfiguration='selectedComputerConfiguration'
                                   @closeDialog='closeDialog' />

    </div>
</template>

<script>
import { deleteComputerConfiguration, getComputerConfigurationByPage } from '@/api/basic/computerConfiguration';
import ComputerConfigurationForm
    from '@/components/page/computer/ComputerConfiguration/modules/computerConfigurationForm.vue';

export default {
    name: 'ComputerConfiguration',
    components: {
        ComputerConfigurationForm
    },
    created() {
        this.initComputerConfiguration();
    },
    data() {
        return {
            tableLoading: false,  // 加载动画
            showDialog: false,  // 对话框显隐
            actionType: '',  // 操作类型
            selectedComputerConfiguration: {},  // 选中的电脑配置数据
            // 电脑配置表单信息(查询条件）
            computerConfigurationForm: {
                hardware: '', // 硬件
                software: ''// 软件
            },
            // 分页数据
            page: 1,  // 当前第几页
            pageSize: 8,  // 当前每页大小
            pageSizes: [8, 10, 15], // 每页大小
            totalDataSize: 0,  // 数据总条数
            multipleSelectionComputerConfiguration: [],  // 批量选中电脑配置数据的id
            computerConfigurationData: [] // 电脑配置所有数据
        };
    },
    methods: {
        /**
         * 初始化所有电脑配置数据
         * @returns {Promise<void>}
         */
        initComputerConfiguration: async function() {
            this.tableLoading = true;
            // 定义请求参数 (查询条件),看文档
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                hardware: this.computerConfigurationForm.hardware ? this.computerConfigurationForm.hardware : '',
                software: this.computerConfigurationForm.software ? this.computerConfigurationForm.software : ''
            };
            await getComputerConfigurationByPage(params).then(res => {
                if (res.code === 200) {
                    // 设置数据总条数
                    this.totalDataSize = res.data.total;
                    this.tableLoading = false;
                    // 存储请求到的数据
                    this.computerConfigurationData = res.data.records;
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
            this.initComputerConfiguration();
        },
        /**
         * 切换第几页
         * @param val 第几页
         */
        handleCurrentChange(val) {
            this.page = val;
            this.initComputerConfiguration();
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
            this.multipleSelectionComputerConfiguration = selected;
        },

        /**
         * 删除电脑配置
         * @param type 批量或者单个删除
         * @param id  主键
         * @returns {ElMessageComponent}
         */
        handleDelete(type, id) {
            // 判断批量删除数据
            if (type === '批量' && id === null) {
                // 当前没有选中数据
                if (this.multipleSelectionComputerConfiguration.length === 0) {
                    return this.$message({ type: 'error', message: '请选择删除对象' });
                }
            }
            this.$confirm('此操作将永久删除选中电脑配置信息, 是否继续?', '确定删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 批量删除或单条数据删除，走同一个后端接口
                deleteComputerConfiguration(type === '批量' ? this.multipleSelectionComputerConfiguration.join(',') : id).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除' + type === '批量' ? this.multipleSelectionComputerConfiguration.length + '条数据成功！' : '成功！'
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
         * 条件查询电脑配置
         */
        querySubmit() {
            this.page = 1;  // 设置查询第page页或者第一页
            this.initComputerConfiguration();
        },
        /**
         * 编辑或者添加电脑配置
         * @param row 选中行
         * @param type 操作类型（新增，删除）
         */
        handleEditOrAdd(row, type) {
            this.actionType = type;
            if (this.actionType === '新增') {
                this.selectedComputerConfiguration = {
                    hardware: '',
                    software: ''
                };
            } else {
                this.selectedComputerConfiguration = row;
            }
            this.showDialog = true;
            // 对话框展开
            this.$nextTick(() => {
                this.$refs['computerConfigurationForm'].showDialog = true;
            });
        },
        /**
         * 关闭对话框
         * @param changeInfo 数据更新（0：未更新，1：更新）
         */
        closeDialog(changeInfo) {
            // 数据改变，重新刷新表格数据
            if (changeInfo) {
                this.initComputerConfiguration();
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
