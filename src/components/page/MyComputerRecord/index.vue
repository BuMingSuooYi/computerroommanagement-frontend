<template>
    <div class='container'>
        <div class='form-content'>
            <el-form :inline='true' :model='computerRecordForm' class='demo-form-inline'>

                <el-form-item label='机房'>
                    <el-select v-model='computerRecordForm.machineRoom' placeholder='请选择机房'
                               @visible-change='queryAllMachineRoom'>
                        <el-option v-for='(item, index) in machineRoomOptions' :label='item.name'
                                   :value='item.id'
                                   :key='index'></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label='电脑编号'>
                    <el-input v-model='computerRecordForm.computer' placeholder='请输入电脑编号'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' icon='el-icon-search' @click='querySubmit'>查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class='table-content'>
            <el-table v-loading='tableLoading' ref='multipleTable' :data='computerRecordData' tooltip-effect='dark'
                      border stripe
                      style='width: 100%;background-color: #3A71A8' :header-cell-style="{ background: '#f5f7fa' }"
            >
                <el-table-column label='序号' type='index' width='80'>
                    <template slot-scope='scope'>
                        <!-- 自定义索引列的内容 -->
                        <span>{{ scope.$index + (page - 1) * pageSize + 1 }}</span>
                    </template>
                </el-table-column>

                <el-table-column prop='computer' label='电脑' width='160'>
                    <template slot-scope='scope'>
                        <span>{{ scope.row.computerObject.number }}</span>
                    </template>
                </el-table-column>

                <el-table-column label='起始时间' prop='startTime' width='220'>
                </el-table-column>

                <el-table-column label='结束时间' prop='endTime' width='220'>
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
import { getComputerRecordByPage } from '@/api/basic/computerRecord';
import { getAllMachineRoom } from '@/api/basic/machineRoom';
import { getAllComputer } from '@/api/basic/computer';
import ComputerRecordForm from '@/components/page/embarkation/computerRecord/modules/ComputerRecordForm.vue';
import { getStudentByAccount } from '@/api/basic/student';

export default {
    name: 'ComputerRecord',
    components: {
        ComputerRecordForm
    },
    created() {
        this.initComputerRecord();
    },
    data() {
        return {
            tableLoading: false,  // 加载动画
            showDialog: false,  // 对话框显隐
            actionType: '',  // 操作类型
            machineRoomOptions: [],
            computerOptions: [],
            selectedComputerRecord: {},  // 选中的上机记录数据
            // 上机记录表单信息(查询条件）
            computerRecordForm: {
                student: '', // 姓名
                machineRoom: '',//上机记录状态
                computer: ''  // 类型
            },
            // 分页数据
            page: 1,  // 当前第几页
            pageSize: 8,  // 当前每页大小
            pageSizes: [8, 10, 15], // 每页大小
            totalDataSize: 0,  // 数据总条数
            multipleSelectionComputerRecord: [],  // 批量选中上机记录数据的id
            computerRecordData: [] // 上机记录所有数据
        };
    },
    methods: {
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
         * 查询所有机房
         */
        queryAllComputer() {
            getAllComputer().then(res => {
                if (res.code === 200) {
                    this.computerOptions = res.data;
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },
        /**
         * 初始化所有上机记录数据
         * @returns {Promise<void>}
         */
        initComputerRecord: function() {
            this.tableLoading = true;
            // 定义请求参数 (查询条件),看文档
            getStudentByAccount(JSON.parse(localStorage.getItem('account')).id).then(res => {
                console.log(res.data);
                const params = {
                    page: this.page,
                    pageSize: this.pageSize,
                    student: res.data.name,
                    machineRoom: this.computerRecordForm.machineRoom ? this.computerRecordForm.machineRoom : -1,
                    computer: this.computerRecordForm.computer ? this.computerRecordForm.computer : ''
                };
                console.log(params)
                getComputerRecordByPage(params).then(res => {
                    if (res.code === 200) {
                        // 设置数据总条数
                        this.totalDataSize = res.data.total;
                        this.tableLoading = false;
                        // 存储请求到的数据
                        this.computerRecordData = res.data.records;
                    }
                }).catch(err => {
                    this.$message.error('请求出错了：' + err);
                });
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
            this.initComputerRecord();
        },
        /**
         * 切换第几页
         * @param val 第几页
         */
        handleCurrentChange(val) {
            this.page = val;
            this.initComputerRecord();
        },

        /**
         * 条件查询上机记录
         */
        querySubmit() {
            this.page = 1;  // 设置查询第page页或者第一页
            this.initComputerRecord();
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
