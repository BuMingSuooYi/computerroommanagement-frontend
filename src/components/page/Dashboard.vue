<template>
    <div>
        <el-row :gutter='20'>
            <el-col :span='8'>
                <el-card :class='type+`student`' shadow='hover' class='mgb20'>
                    <div class='user-info'>
                        <img src='../../assets/img/img.jpg' class='user-avator' alt />
                        <div class='user-info-cont'>
                            <div class='user-info-name'>{{ name }}</div>
                            <div>{{ role }}</div>
                        </div>
                    </div>
                    <div class='user-info-list'>
                        上次登录时间：
                        <span>2023-06-27</span>
                    </div>
                    <div class='user-info-list'>
                        上次登录地点：
                        <span>南昌</span>
                    </div>
                    <div v-if='type===2' class='progress-info'>
                        <div class='progress-title'>学习进度:</div>
                        <el-progress style='display: flex;width: 72%;align-items: center' :text-inside='true'
                                     :stroke-width='18' :percentage='50' status='success'></el-progress>
                    </div>
                </el-card>
                <el-card id='chart1' shadow='hover' style='height:260px;'>
                </el-card>
            </el-col>
            <el-col :span='16'>
                <el-row :gutter='20'>
                    <el-col :span='8'>
                        <el-card shadow='hover' :body-style="{padding: '0px'}">
                            <div class='grid-content grid-con-1'>
                                <i class='el-icon-lx-people grid-con-icon'>
                                    <i class='iconfont icon-diannao'></i>
                                </i>
                                <div class='grid-cont-right'>
                                    <div class='grid-num'>30</div>
                                    <div>已上机学时</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span='8'>
                        <el-card shadow='hover' :body-style="{padding: '0px'}">
                            <div class='grid-content grid-con-2'>
                                <i class='el-icon-lx-notice grid-con-icon'>
                                    <i class='iconfont icon-mubiao'></i>
                                </i>
                                <div class='grid-cont-right'>
                                    <div class='grid-num'>60</div>
                                    <div>目标学时</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span='8'>
                        <el-card shadow='hover' :body-style="{padding: '0px'}">
                            <div class='grid-content grid-con-3'>
                                <i class='el-icon-lx-goods grid-con-icon'>
                                    <i class='iconfont icon-guanjun'></i>
                                </i>
                                <div class='grid-cont-right'>
                                    <div class='grid-num'>2</div>
                                    <div>排名</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow='hover' style='height:200px;'>
                    <div class='wrap-title'>
                        <div>学生</div>
                        <div>电脑</div>
                        <div>机位</div>
                        <div>起始时间</div>
                    </div>
                    <div class='wrap-contain'>
                        <vue-seamless-scroll :class-option='classOption' :data='listData' class='warp'>
                            <div class='item'>
                                <div class='item-line' v-for='(item, index) in listData' :key='index'>
                                    <div class='item-info'>{{ item.studentObject.name }}</div>
                                    <div class='item-info'>{{ item.computerObject.number }}</div>
                                    <div class='item-info'>{{ item.computerObject.cameraStand }}</div>
                                    <div class='item-info'>{{ item.startTime }}</div>
                                </div>
                            </div>
                        </vue-seamless-scroll>
                    </div>

                </el-card>
                <div class='statics-row'>
                    <el-col :span='12'>
                        <el-card id='chart2' shadow='hover' style='height: 240px;padding-top: 20px'></el-card>
                    </el-col>
                    <el-col :span='12'>
                        <el-card id='chart3' shadow='hover' style='height: 240px;padding-top: 20px'></el-card>
                    </el-col>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import * as echarts from 'echarts';
import { getComputerRecordByPage } from '@/api/basic/computerRecord';

export default {
    name: 'dashboard',
    data() {
        return {
            name: JSON.parse(localStorage.getItem('account')).username,
            type: JSON.parse(localStorage.getItem('account')).type,
            listData: [],
            data: [
                {
                    name: '2018/09/04',
                    value: 1083
                },
                {
                    name: '2018/09/05',
                    value: 941
                },
                {
                    name: '2018/09/06',
                    value: 1139
                },
                {
                    name: '2018/09/07',
                    value: 816
                },
                {
                    name: '2018/09/08',
                    value: 327
                },
                {
                    name: '2018/09/09',
                    value: 228
                },
                {
                    name: '2018/09/10',
                    value: 1065
                }
            ],
            classOption: {
                step: 1
            }
        };
    },
    components: {},
    computed: {
        role() {
            if (this.type === 0) {
                return '系统管理员';
            } else if (this.type === 1) {
                return '机房管理员';
            } else if (this.type === 2) {
                return '学生';
            }
            return '';
        }
    },
    mounted() {
        this.drawChart1();
        this.drawChart2();
        this.drawChart3();
    },
    created() {
        this.getComputerRecord();
    },
    methods: {
        getComputerRecord: async function() {
            // 定义请求参数 (查询条件),看文档
            const params = {
                page: 1,
                pageSize: 10,
                student: '',
                machineRoom: -1,
                computer: ''
            };
            await getComputerRecordByPage(params).then(res => {
                if (res.code === 200) {
                    // 存储请求到的数据
                    this.listData = res.data.records;
                    console.log(this.listData);
                }
            }).catch(err => {
                this.$message.error('请求出错了：' + err);
            });
        },
        drawChart1() {
            // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
            let myChart = echarts.init(document.getElementById('chart1'));
            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: '各机房自由上机总学时',
                    // subtext:'',
                    x: 'center',
                    y: '6px',
                    textStyle: {
                        color: '#3A7BD5',
                        fontSize: 16
                    },
                    textAlign: 'left'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['D301', 'D202', 'D303', 'D304', 'D305', 'D306', 'D307'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'Direct',
                        type: 'bar',
                        barWidth: '60%',
                        data: [10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        drawChart2() {
            // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
            let myChart = echarts.init(document.getElementById('chart2'));
            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: '各班级上机学时',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: 200, name: '202061' },
                            { value: 700, name: '202001' },
                            { value: 580, name: '202002' },
                            { value: 484, name: '202003' },
                            { value: 300, name: '202004' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
        drawChart3() {
            // 基于准备好的dom，初始化echarts实例  这个和上面的main对应
            let myChart = echarts.init(document.getElementById('chart3'));
            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: '机器维修次数',
                    left: 'center'
                },
                xAxis: {
                    type: 'category',
                    data: ['Air17-1', 'Air17-2', 'Air17-3', 'Air17-4', 'Air17-5']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: [150, 230, 224, 218, 135],
                        type: 'line'
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }

    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 60px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.grid-con-icon i {
    font-size: 30px;
    color: white !important;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    height: 260px;
    margin-bottom: 20px;
}

.el-card.mgb20.\32 student {
    height: 280px !important;
}


.progress-title {
    margin-right: 10px;
    color: #999;
}

.progress-info {
    display: flex;
    line-height: 25px;
    align-items: center;
}

.statics-row {
    margin-top: 20px;
    width: 100%;
    height: 260px;
    border-radius: 6px;
}

.wrap-title {
    font-size: 16px;
    font-weight: 700;
    display: flex;
    justify-content: space-around;
}

.warp {
    height: 100%;
    overflow: hidden;
    margin-top: 5px;
}

.item {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
}

.item-line {
    display: flex;
    justify-content: space-around;
    height: 30px;
    line-height: 30px;
}
</style>
