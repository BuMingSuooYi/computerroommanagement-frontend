<template>
    <div class='container'>
        <div class='form-content'>
            <el-form :inline='true' :model='computerForm' class='demo-form-inline'>
                <el-form-item label='电脑编号'>
                    <el-input v-model='computerForm.number' placeholder='请输入电脑编号'></el-input>
                </el-form-item>

                <el-form-item label='隶属机房'>
                    <el-select v-model='computerForm.machineRoom' placeholder='请选择机房'
                               @visible-change='queryAllMachineRoom' clearable>
                        <el-option v-for='(item, index) in machineRoomOptions' :label='item.name'
                                   :value='item.id'
                                   :key='index'></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label='开放状态' prop='state'>
                    <el-select v-model='computerForm.state' placeholder='请选择状态' clearable>
                        <el-option key='0' label='空闲' value='0'>
                        </el-option>
                        <el-option key='1' label='使用中' value='1'>
                        </el-option>
                        <el-option key='2' label='维修中' value='1'>
                        </el-option>
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
            <el-button type='success'>下载<i class='el-icon-download el-icon--right'></i></el-button>
            <el-button type='primary' @click="handleEditOrAdd(null, '新增')" plain>+ 新增</el-button>
        </div>
        <div class='table-content'>
            <el-table v-loading='tableLoading' ref='multipleTable' :data='computerData' tooltip-effect='dark' border
                      stripe
                      style='width: 100%;background-color: #3A71A8' :header-cell-style="{ background: '#f5f7fa' }"
                      @selection-change='handleSelectionChange'>
                
                <el-table-column label='序号' type='index' width='100'>
                    <template slot-scope='scope'>
                        <!-- 自定义索引列的内容 -->
                        <span>{{ scope.$index + (page - 1) * pageSize + 1 }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop='number' label='电脑编号' width='120'>
                </el-table-column>

                <el-table-column prop='machineRoom' label='隶属机房' width='180'>
                    <template slot-scope='scope'>
                        <span v-if='scope.row.machineRoomObject!=null'>{{ scope.row.machineRoomObject.name }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop='configuration' label='电脑配置' width='180'>
                    <template slot-scope='scope'>
                        <span
                            v-if='scope.row.computerConfigurationObject!=null'>{{ scope.row.computerConfigurationObject.name
                            }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop='cameraStand' label='机位' width='120'>
                </el-table-column>

                <el-table-column prop='state' label='状态' width='120'>
                    <template slot-scope='scope'>
                        <span v-if='scope.row.state === 0'>空闲</span>
                        <span v-else-if='scope.row.state === 1'>使用中</span>
                        <span v-else-if='scope.row.state === 2'>维修中</span>
                    </template>
                </el-table-column>


                <el-table-column label='操作' fixed='right'>
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

        <UploadForm :upload-url='uploadUrl' />
        <ComputerForm v-if='showDialog' ref='computerForm' :action-type='actionType'
                      :selected-computer='selectedComputer'
                      @closeDialog='closeDialog' />

    </div>
</template>

<script>
import { deleteComputerById, getAllComputer, getComputerByPage } from '@/api/basic/computer';
import ComputerForm from '@/components/page/computer/computer/modules/ComputerForm.vue';
import { getAllMachineRoom } from '@/api/basic/machineRoom';
import { mapMutations, mapState } from 'vuex';
import UploadForm from '@/components/page/common/UploadForm.vue';

export default {
    name: 'Computer',
    components: {
        UploadForm,
        ComputerForm
    },
    created() {
        this.initComputerData();
        this.$watch('uploadSuccess', this.refreshData);
    },
    data() {
        return {
            uploadUrl: '/computer/uploadExcel',
            tableLoading: false,  // 加载动画
            showDialog: false,  // 对话框显隐
            actionType: '',  // 操作类型
            selectedComputer: {},  // 选中的电脑数据
            machineRoomOptions: [],
            // 电脑表单信息(查询条件）
            computerForm: {
                number: '', // 电脑编号
                machineRoom: '',  // 隶属机房
                state: ''// 状态
            },
            // 分页数据
            page: 1,  // 当前第几页
            pageSize: 6,  // 当前每页大小
            pageSizes: [6, 10, 15], // 每页大小
            totalDataSize: 0,  // 数据总条数
            multipleSelectionComputer: [],  // 批量选中电脑数据的id
            computerData: [] // 电脑所有数据
        };
    },
    computed: {
        ...mapState(['uploadSuccess'])
    },
    methods: {
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
                this.initComputerData();
                this.refreshTableData(false);
            }
        },
        /**
         * 查询所有机房
         */
        queryAllMachineRoom() {
            getAllMachineRoom().then(res => {
                if (res.code === 200) {
                    this.machineRoomOptions = res.data;
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },

        /**
         * 初始化所有电脑数据
         * @returns {Promise<void>}
         */
        initComputerData: async function() {
            this.tableLoading = true;
            // 定义请求参数 (查询条件),看文档
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                number: this.computerForm.number ? this.computerForm.number : '',
                machineRoom: this.computerForm.machineRoom ? this.computerForm.machineRoom : -1,
                state: this.computerForm.state ? this.computerForm.state : -1
            };
            await getComputerByPage(params).then(res => {
                if (res.code === 200) {
                    // 存储请求到的数据
                    this.computerData = res.data.records;
                    // 设置数据总条数
                    this.totalDataSize = res.data.records.length;
                    this.tableLoading = false;
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
         * 获取所有选中的数据
         * @param val 所有选中行
         */
        handleSelectionChange(val) {
            // 遍历循环取出所有选中项的主键
            let selected = [];
            val.forEach((i) => {
                selected.push(i.id);
            });
            this.multipleSelectionComputer = selected;
        },

        /**
         * 删除电脑
         * @param type 批量或者单个删除
         * @param id  主键
         * @returns {ElMessageComponent}
         */
        handleDelete(type, id) {
            // 判断批量删除数据
            if (type === '批量' && id === null) {
                // 当前没有选中数据
                if (this.multipleSelectionComputer.length === 0) {
                    return this.$message({ type: 'error', message: '请选择删除对象' });
                }
            }
            this.$confirm('此操作将永久删除选中电脑信息, 是否继续?', '确定删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 批量删除或单条数据删除，走同一个后端接口
                deleteComputerById(type === '批量' ? this.multipleSelectionComputer.join(',') : id).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除' + type === '批量' ? this.multipleSelectionComputer.length + '条数据成功！' : '成功！'
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
         * 条件查询电脑
         */
        querySubmit() {
            this.page = 1;  // 设置查询第page页或者第一页
            this.initComputerData();
        },
        /**
         * 编辑或者添加电脑
         * @param row 选中行
         * @param type 操作类型（新增，删除）
         */
        handleEditOrAdd(row, type) {
            this.actionType = type;
            if (this.actionType === '新增') {
                this.selectedComputer = {
                    number: '',
                    configuration: '',
                    computerConfigurationObject: { id: '', name: '' },
                    machineRoomObject: { id: '', name: '' },
                    machineRoom: '',
                    cameraStand: '',
                    state: ''
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
         * 关闭对话框
         * @param changeInfo 数据更新（0：未更新，1：更新）
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
    margin-top: 0;
    height: 48px;
    display: flex;
    align-items: center;
}

/deep/ .el-table .cell {
    word-break: keep-all;
}
</style>
