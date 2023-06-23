<template>
    <div class='container'>
        <div id='tool-tip'>
            <div class='instruct'>
                <div class='back'>
                    <el-button type='primary' @click='returnBack'>返回</el-button>
                </div>
                <div class='tip'>
                    <div class='free-contain'>
                        <div id='free'></div>
                        <span>空闲</span>
                    </div>
                    <div class='use-contain'>
                        <div id='use'></div>
                        <span>使用中</span>
                    </div>
                    <div class='repair-contain'>
                        <div id='repair'></div>
                        <span>维修中</span>
                    </div>
                    <div class='null-contain'>
                        <div id='null'></div>
                        <div>无电脑</div>
                    </div>
                </div>

            </div>
            <div class='room-title'>{{ machineRoom.name }}</div>
        </div>
        <div class='table-content'>
            <div class='flight-list'>
                <div v-if='computerData' v-for='(r,index) in row' :key='index' class='row'>
                    <div v-for='(c,index) in col' :key='index' class='col item'>
                        <div class='free-computer'
                             v-if='hasComputer((r - 1) * col + c)&&hasComputer((r - 1) * col + c)-1===0'>
                            <div class='item-info'>机位{{ (r - 1) * col + c }}</div>
                            <div class='operation-group'>
                                <el-button type='primary'
                                           @click='assignmentComputer(computerData[ (r - 1) * col + c-1])'>上机
                                </el-button>
                            </div>
                        </div>
                        <div class='use-computer'
                             v-else-if='hasComputer((r - 1) * col + c)&&hasComputer((r - 1) * col + c)-1===1'>
                            <div class='item-info'>机位{{ (r - 1) * col + c }}</div>
                            <el-button type='warning'
                                       @click='disembark(computerData[ (r - 1) * col + c-1])'>下机
                            </el-button>
                        </div>
                        <div class='repair-computer'
                             v-else-if='hasComputer((r - 1) * col + c)&&hasComputer((r - 1) * col + c)-1===2'>
                            <div class='item-info'>机位{{ (r - 1) * col + c }}</div>
                        </div>
                        <div v-else class='null-computer'>
                            <div class='item-info'>机位{{ (r - 1) * col + c }}</div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
        <add-computer-record v-if='showDialog'
                             ref='addComputerRecordForm'
                             :selected-computer='selectedComputer'
                             :machine-room='machineRoom'
                             @closeDialog='closeDialog' />
    </div>
</template>

<script>
import { getComputerByMachineRoom } from '@/api/basic/machineRoom';
import addComputerRecord from '@/components/page/embarkation/BoardComputerDetail/modules/addComputerRecordForm.vue';
import { deleteStudentById } from '@/api/basic/student';
import { logoutComputerRecord } from '@/api/basic/computerRecord';

export default {
    name: 'MachineRoomDetail',
    components: {
        addComputerRecord
    },
    watch: {
        $route(to, from) {
            // 在路由切换时执行相应的操作
            // 重新获取数据或重新初始化页面状态
            if (from.path === '/boardComputer') {
                this.machineRoom = this.$store.state.machineRoomData;
                this.initLayout();
                this.initComputerData();
            }
        }
    },
    mounted() {
        this.machineRoom = this.$store.state.machineRoomData;
        this.initLayout();
        this.initComputerData();
    },
    created() {
        // 初始化数据
    },
    data() {
        return {
            showDialog: false,
            // 表格所有数据
            computerData: [],
            machineRoom: {},
            row: 0,
            col: 0,
            selectedComputer: ''
        };
    },
    methods: {
        /**
         * 当前机位有电脑，返回电脑机状态+1(为了bool值)
         * @param cameraStand
         * @returns {number}
         */
        hasComputer(cameraStand) {
            for (let i = 0; i < this.computerData.length; i++) {
                if (this.computerData[i].cameraStand === cameraStand) {
                    return this.computerData[i].state + 1;
                }
            }
            return -1;
        },
        /**
         * 返回上一步
         */
        returnBack() {
            this.$store.commit('Clear_MachineRoom');
            this.$router.push('/boardComputer');
        },
        /**
         * 初始化布局
         */
        initLayout() {
            // 使用split方法拆分字符串
            if (this.machineRoom.pattern) {
                const parts = this.machineRoom.pattern.split('*');
                // 将拆分后的结果转换为数字(10进制)
                this.row = parseInt(parts[0], 10);
                this.col = parseInt(parts[1], 10);
            }
        },

        /**
         * 初始化机房表格信息
         * @returns {Promise<void>}
         */
        initComputerData() {
            if (this.machineRoom.id) {
                let id = this.machineRoom.id;
                getComputerByMachineRoom(id).then(res => {
                    if (res.code === 200) {
                        // 存储请求到的后端数据
                        this.computerData = res.data;
                    }
                }).catch(err => {
                    this.$message.error('请求出错了：' + err);
                });
            }
        },
        /**
         * 上机
         */
        assignmentComputer(computer) {
            this.selectedComputer = computer;
            this.showDialog = true;
            // 对话框展开
            this.$nextTick(() => {
                this.$refs['addComputerRecordForm'].showDialog = true;
            });
        },
        /**
         * 下机
         * @param computer
         */
        disembark(computer) {
            this.$confirm('你确定要下机嘛, 是否继续?', '确定下机', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 下机操作
                logoutComputerRecord(computer.id).then(res => {
                    if (res.code === 200) {
                        this.$message.success(res.msg);
                        this.initLayout();
                        this.initComputerData();
                    }
                }).catch(err => {
                    this.$message.error('请求出错了：' + err);
                });
            }).catch(() => {
                this.$message({ type: 'info', message: '已取消操作' });
            });
        },

        /**
         * 关闭对话框
         * @param changeInfo 数据更新（0：未更新，1：更新）
         */
        closeDialog(changeInfo) {
            // 数据改变，重新刷新表格数据
            if (changeInfo) {
                this.initLayout();
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
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-content: flex-start;
    flex-direction: column;
    flex-wrap: wrap;
}

#tool-tip {
    display: flex;
    margin-bottom: 30px;
    flex-direction: column;
}

/* 设置字体标题样式 */
.room-title {
    font-family: "Helvetica Neue", Arial, sans-serif;
    font-size: 32px;
    font-weight: bold;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
    display: flex;
    justify-content: center;
    background: linear-gradient(45deg, #FFC107, #FF9800, #FF5722, #E91E63);

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* 给标题添加动画效果 */
@keyframes scaleIn {
    0% {
        transform: scale(0.5);
        opacity: 0;
    }
    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.room-title, .table-content, #tool-tip {
    animation: scaleIn 0.5s ease-in-out;
}

.instruct {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.tip {
    display: flex;
}

.free-contain, .use-contain, .repair-contain, .null-contain {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 30px;
}

#free, #use, #repair, #null {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    margin-right: 3px;
}

#free, .free-computer {
    background-color: rgba(40, 201, 40, 0.6);
}

#use, .use-computer {
    background-color: rgba(224, 12, 12, 0.6);
}

#repair, .repair-computer {
    background-color: rgb(218, 241, 10, 0.4);
}

#null, .null-computer {
    background-color: rgba(108, 104, 104, 0.4);
}

.free-computer, .use-computer, .repair-computer, .null-computer {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    transition: all 0.3s ease 0s;
}


.flight-list {
    display: flex;
    width: 100%;
    align-content: center;
    flex-wrap: wrap;
    align-items: center;
    flex-direction: column;
}

.flight-list .item {
    display: flex;
    align-content: center;
    justify-content: center;
    flex-direction: column;
    height: 100px;
    width: 100px;
    box-shadow: 0 8px 16px -4px #2c2d300c;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    margin-bottom: 1rem;
    margin-right: 20px;
    transition: all 0.3s ease 0s;
}

.row {
    display: flex;
}

.flight-list .item:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    transform: scale(1.1);
}

.el-button--small {
    padding: 8px 10px;
}

</style>
