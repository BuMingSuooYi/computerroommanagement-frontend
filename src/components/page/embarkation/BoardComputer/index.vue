<template>
    <div class='container'>
        <div class='form-content'>
            <el-form :inline='true' :model='machineRoomForm' class='demo-form-inline'>
                <el-form-item label='机房名称'>
                    <el-input v-model.trim='machineRoomForm.name' placeholder='请输入机房名称'></el-input>
                </el-form-item>
                <el-form-item label='负责人'>
                    <el-input v-model.trim='machineRoomForm.principle' placeholder='请输入负责人'></el-input>
                </el-form-item>
                <el-form-item label='开放状态'>
                    <el-select v-model='machineRoomForm.state' placeholder='请选择开放状态'>
                        <el-option value='1' label='开放'></el-option>
                        <el-option value='0' label='关闭'></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' icon='el-icon-search' @click='querySubmit'>查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class='table-content'>
            <div class='room-list'>
                <div class='room-item' v-for='(data,index) in machineRoomData' :key='index'>
                    <div class='room-item-info'>
                        <div class='room-item-info-name'>{{ data.name }}</div>
                    </div>
                    <div class='room-item-operation'>
                        <el-button type='primary'>上机</el-button>
                    </div>

                </div>

            </div>
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

    </div>
</template>

<script>
import { getAccountByPage, deleteAccountById } from '@/api/basic/account';
import UploadForm from '@/components/page/common/UploadForm.vue';
import { mapMutations, mapState } from 'vuex';
import AccountForm from '@/components/page/basic/account/modules/AccountForm.vue';
import { getMachineRoomByPage } from '@/api/basic/machineRoom';

export default {
    name: 'BoardComputer',
    components: {
        AccountForm,
        UploadForm
    },
    created() {
        // 初始化数据
        this.initMachineRoomData();
        // 监听是否需要刷新书库
        this.$watch('uploadSuccess', this.refreshData);
    },
    data() {
        return {
            tableLoading: false,  // 加载动画
            // 角色表单信息(查询条件）
            machineRoomForm: {
                name: '',// 用户名
                principle: '',// 负责人类型
                state: '' // 开放状态
            },
            // 表格所有数据
            machineRoomData: [],
            showDialog: false,
            actionType: '',// 操作类型
            // 分页数据
            page: 1,  // 当前第几页
            pageSize: 8,  // 当前每页大小
            pageSizes: [8, 12, 15], // 每页大小
            totalDataSize: 0, // 数据总条数
            // 选中的账户
            selectedAccount: {},
            uploadFile: {}

        };
    },

    methods: {

        /**
         * 初始化账户表格信息
         * @returns {Promise<void>}
         */
        initMachineRoomData: async function() {
            this.tableLoading = true;
            // 定义请求参数 (查询条件)
            const params = {
                page: this.page,
                pageSize: this.pageSize,
                name: this.machineRoomForm.name ? this.machineRoomForm.name : '',
                principle: this.machineRoomForm.principle ? this.machineRoomForm.principle : '',
                state: this.machineRoomForm.state ? this.machineRoomForm.state : -1
            };
            await getMachineRoomByPage(params).then(res => {
                if (res.code === 200) {
                    // 存储请求到的后端数据
                    this.machineRoomData = res.data.records;

                    // 设置数据总条数
                    this.totalDataSize = res.data.total;
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
            this.initMachineRoomData();
        },
        /**
         * 切换第几页
         * @param val 第几页
         */
        handleCurrentChange(val) {
            this.page = val;
            this.initMachineRoomData();
        },

        /**
         * 条件查询
         */
        querySubmit() {
            this.page = 1;  // 设置查询第page页或者第一页
            this.initMachineRoomData();
        }

    }
};
</script>

<style scoped>

.table-content {
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-content: flex-start;
    flex-direction: column;
    flex-wrap: wrap;
}

.room-list {
    display: flex;
    width: 100%;
    align-content: center;
    flex-wrap: wrap;
    align-items: center;
}

.room-list .room-item {
    display: flex;
    align-content: center;
    justify-content: center;
    flex-direction: column;
    height: 200px;
    box-shadow: 0 8px 16px -4px #2c2d300c;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    margin-bottom: 0.5rem;
    margin-right: 5px;
    transition: all 0.3s ease 0s;
    background: #495f80;
}

.room-item-info {
    height: 150px;
    width: 95%;
    padding-left: 10px;
    padding-right: 10px;
}

.room-item-operation {
    display: flex;
    width: 95%;
    justify-content: space-around;

}

.room-item-info-name {
    color: white;
    font-size: 20px;
    font-weight: 600;
}

.room-list .room-item:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

@media screen and (min-width: 1300px) {
    .room-list .room-item {
        width: calc(100% / 4 - 0.5rem);
    }
}

@media screen and (max-width: 1300px) {
    .room-list .room-item {
        width: calc(100% / 3 - 0.5rem);
    }
}

@media screen and (max-width: 900px) {
    .room-list .room-item {
        width: calc(100% / 2 - 0.5rem);
    }
}

@media screen and (max-width: 768px) {
    .room-list .room-item {
        width: calc(100% - 0.5rem);
    }
}

.handle-group {
    height: 45px;
}

.el-pagination {
    border: none;
    margin-top: 0.5rem;
    height: 48px;
    display: flex;
    align-items: center;
}

/deep/ .el-table .cell {
    word-break: keep-all;
}
</style>
