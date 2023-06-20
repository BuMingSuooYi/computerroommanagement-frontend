<template>
    <div class='container'>
        <div class='form-content'>
            <el-form :inline='true' :model='studentForm' class='demo-form-inline'>

                <el-form-item label='学号'>
                    <el-input v-model='studentForm.studentNo' placeholder='请输入学号'></el-input>
                </el-form-item>
                <el-form-item label='学号'>
                    <el-input v-model='studentForm.name' placeholder='请输入学生姓名'></el-input>
                </el-form-item>
                <el-form-item label='学号'>
                    <el-input v-model='studentForm.clazz' placeholder='请输入班级'></el-input>
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
            <el-table v-loading='tableLoading' ref='multipleTable' :data='studentData' tooltip-effect='dark' border
                      stripe
                      style='width: 100%;background-color: #3A71A8' :header-cell-style="{ background: '#f5f7fa' }"
                      @selection-change='handleSelectionChange'>
                <el-table-column type='selection' width='55'>
                </el-table-column>
                <el-table-column label='序号' type='index' width='50'>
                </el-table-column>
                <el-table-column prop='studentNo' label='学号' width='120'>
                </el-table-column>

                <el-table-column prop='name' label='姓名' width='120'>
                </el-table-column>

                <el-table-column prop='sex' label='性别' width='120'>
                    <template slot-scope='scope'>
                        <span v-if='scope.row.sex === 0'>女</span>
                        <span v-else-if='scope.row.sex === 1'>男</span>
                    </template>
                </el-table-column>
                <el-table-column prop='clazz' label='班级' width='120'>
                </el-table-column>

                <el-table-column prop='telephone' label='联系电话' width='120'>
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

        <StudentForm v-if='showDialog' ref='studentForm' :action-type='actionType' :selected-student='selectedStudent'
                     @closeDialog='closeDialog' />

    </div>
</template>

<script>
import { deleteStudentById, getStudentByPage } from '@/api/basic/student';
import StudentForm from '@/components/page/student/modules/StudentForm.vue';


export default {
    name: 'Student',
    components: {
        StudentForm
    },
    created() {
        this.initStudentData();
    },
    data() {
        return {
            tableLoading: false,  // 加载动画
            showDialog: false,  // 对话框显隐
            actionType: '',  // 操作类型
            selectedStudent: {},  // 选中的学生数据
            // 学生表单信息(查询条件）
            studentForm: {
                studentNo: '', // 学号
                name: '',// 姓名
                clazz: ''  // 班级
            },
            // 分页数据
            page: 1,  // 当前第几页
            pageSize: 8,  // 当前每页大小
            pageSizes: [8, 10, 15], // 每页大小
            totalDataSize: 0,  // 数据总条数
            multipleSelectionStudent: [],  // 批量选中学生数据的id
            studentData: [] // 学生所有数据
        };
    },
    methods: {
        /**
         * 初始化所有学生数据
         * @returns {Promise<void>}
         */
        initStudentData: async function() {
            this.tableLoading = true;
            // 定义请求参数 (查询条件),看文档
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                studentNo: this.studentForm.studentNo ? this.studentForm.studentNo : '',
                name: this.studentForm.name ? this.studentForm.name : 0,
                clazz: this.studentForm.clazz ? this.studentForm.clazz : 0
            };
            await getStudentByPage(params).then(res => {
                if (res.code === 200) {
                    // 设置数据总条数
                    this.totalDataSize = res.data.total;
                    this.tableLoading = false;
                    // 存储请求到的数据
                    this.studentData = res.data.records;
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
            this.initStudentData();
        },
        /**
         * 切换第几页
         * @param val 第几页
         */
        handleCurrentChange(val) {
            this.page = val;
            this.initStudentData();
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
            this.multipleSelectionStudent = selected;
        },

        /**
         * 删除学生
         * @param type 批量或者单个删除
         * @param id  主键
         * @returns {ElMessageComponent}
         */
        handleDelete(type, id) {
            // 判断批量删除数据
            if (type === '批量' && id === null) {
                // 当前没有选中数据
                if (this.multipleSelectionStudent.length === 0) {
                    return this.$message({ type: 'error', message: '请选择删除对象' });
                }
            }
            this.$confirm('此操作将永久删除选中学生信息, 是否继续?', '确定删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 批量删除或单条数据删除，走同一个后端接口
                deleteStudentById(type === '批量' ? this.multipleSelectionStudent.join(',') : id).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '删除' + type === '批量' ? this.multipleSelectionStudent.length + '条数据成功！' : '成功！'
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
         * 条件查询学生
         */
        querySubmit() {
            this.page = 1;  // 设置查询第page页或者第一页
            this.initStudentData();
        },
        /**
         * 编辑或者添加学生
         * @param row 选中行
         * @param type 操作类型（新增，删除）
         */
        handleEditOrAdd(row, type) {
            this.actionType = type;
            if (this.actionType === '新增') {
                this.selectedStudent = {
                    studentNO: '',
                    name: '',
                    clazz: '',
                    sex: '',
                    telephone: ''
                };
            } else {
                this.selectedStudent = row;
            }
            this.showDialog = true;
            // 对话框展开
            this.$nextTick(() => {
                this.$refs['studentForm'].showDialog = true;
            });
        },
        /**
         * 关闭对话框
         * @param changeInfo 数据更新（0：未更新，1：更新）
         */
        closeDialog(changeInfo) {
            // 数据改变，重新刷新表格数据
            if (changeInfo) {
                this.initStudentData();
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
