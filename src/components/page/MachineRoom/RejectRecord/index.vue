<template>
    <div class='container'>
        <div class='form-content'>
            <el-form :inline='true' :model='RoomStateForm' class='demo-form-inline'>

                <el-form-item label='机房名称'>
                    <el-input v-model='RoomStateForm.machineRoom' placeholder='请输入机房名称'></el-input>
                </el-form-item>

                <el-form-item label='节次'>
                    <el-select v-model='RoomStateForm.section' placeholder='请选择节次'>

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
            <el-button type='danger' @click="handleDelete('批量', null)">批量删除</el-button>
        </div>

        <div class='table-content'>
            <el-table
                      ref='multipleTable'
                      :data='RoomStateData'
                      tooltip-effect='dark'
                      border
                      stripe
                      style='width: 100%;background-color: #3A71A8' :header-cell-style="{ background: '#f5f7fa' }"
                      @selection-change='handleSelectionChange'>
                <el-table-column type='selection' width='60'>
                </el-table-column>
                <el-table-column label='序号' type='index' width='100'>
                </el-table-column>

                <el-table-column prop='clazz' label='机房名称' width='150'>
                </el-table-column>
                <el-table-column prop='principle' label='负责人' width='150'>
                </el-table-column>
                <el-table-column prop='date' label='日期' width='150'>
                </el-table-column>
                <el-table-column prop='time' label='不可用节次' width='150'>
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

        <RoomStateForm v-if='showDialog'
                       ref='RoomStateForm'
                       :action-type='actionType'
                       :selected-RoomState='selectedRoomState'
                       @closeDialog='closeDialog' />

    </div>
</template>

<script>
import RoomStateForm from '@/components/page/MachineRoom/RejectRecord/modules/RoomStateForm.vue';

export default {
    name: 'RoomState',
    components: {
        RoomStateForm
    },
    created() {
        this.initRoomStateData();
    },
    data() {
        return {
            tableLoading: false,  // 加载动画
            showDialog: false,  // 对话框显隐
            actionType: '',  // 操作类型
            selectedRoomState: {},  // 选中的班级学时数据
            // 班级学时表单信息(查询条件）
            RoomStateForm: {
                machineRoom: '', // 班级名称
                section: [], //节次
            },
            // 分页数据
            page: 1,  // 当前第几页
            pageSize: 8,  // 当前每页大小
            pageSizes: [8, 10, 15], // 每页大小
            totalDataSize: 0,  // 数据总条数
            multipleSelectionRoomState: [],  // 批量选中班级学时数据的id
            RoomStateData: [] // 班级学时所有数据
        };
    },
    methods: {
        /**
         * 初始化所有班级学时数据
         * @returns {Promise<void>}
         */
        initRoomStateData: async function() {
            this.tableLoading = true;
            // 定义请求参数 (查询条件),看文档
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                clazz: this.RoomStateForm.clazz ? this.RoomStateForm.clazz : '',
                time: this.RoomStateForm.time ? this.RoomStateForm.time : 0
            };
            // await getRoomStateByPage(params).then(res => {
            //     if (res.code === 200) {
            //         // 设置数据总条数
            //         this.totalDataSize = res.data.total;
            //         this.tableLoading = false;
            //         // 存储请求到的数据
            //         this.RoomStateData = res.data.records;
            //     }
            // }).catch(err => {
            //     this.$message.error('请求出错了：' + err);
            // });
        },


        /**
         * 编辑或者添加班级学时
         * @param row 选中行
         * @param type 操作类型（新增，删除）
         */
        handleEditOrAdd(row, type) {
            this.actionType = type;
            if (this.actionType === '新增') {
                this.selectedRoomState = {
                    clazz: '',
                    time: 0
                };
                console.log(this.selectedRoomState);
            } else {
                this.selectedRoomState = row;
            }
            this.showDialog = true;
            // 对话框展开
            this.$nextTick(() => {
                this.$refs['RoomStateForm'].showDialog = true;
            });
        },

        /**
         * 删除班级学时
         * @param type 批量或者单个删除
         * @param id  主键
         * @returns {ElMessageComponent}
         */
        handleDelete(type, id) {
            // 判断批量删除数据
            if (type === '批量' && id === null) {
                // 当前没有选中数据
                if (this.multipleSelectionRoomState.length === 0) {
                    return this.$message({ type: 'error', message: '请选择删除对象' });
                }
            }
            this.$confirm('此操作将永久删除选中班级学时信息, 是否继续?', '确定删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 批量删除或单条数据删除，走同一个后端接口
                deleteRoomState(type === '批量' ? this.multipleSelectionRoomState.join(',') : id).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除' + type === '批量' ? this.multipleSelectionRoomState.length + '条数据成功！' : '成功！'
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
         * 条件查询班级学时
         */
        querySubmit() {
            this.page = 1;  // 设置查询第page页或者第一页
            this.initRoomStateData();
        },
        /**
         * 切换每页多少条数据
         * @param val  每页数据量
         */
        handleSizeChange(val) {
            this.pageSize = val;
            this.initRoomStateData();
        },
        /**
         * 切换第几页
         * @param val 第几页
         */
        handleCurrentChange(val) {
            this.page = val;
            this.initRoomStateData();
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
            this.multipleSelectionRoomState = selected;
        },

        /**
         * 关闭对话框
         * @param changeInfo 数据更新（0：未更新，1：更新）
         */
        closeDialog(changeInfo) {
            // 数据改变，重新刷新表格数据
            if (changeInfo) {
                this.initRoomStateData();
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