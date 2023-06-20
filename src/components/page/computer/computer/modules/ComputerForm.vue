<template>
  <div>
    <el-dialog :title="actionType + '账户'" :visible.sync='showDialog' @close='closeDialog(false)'>
      <el-form :model="computerForm"
               :rules="rule"
               ref="computerForm">
        <el-form-item label="配置信息" :label-width="formLabelWidth" prop="configurationId">
          <el-select v-model="computerForm.configurationId" placeholder="请选择配置">
            <el-option v-for="item in configurationList"
                       :key="item.id"
                       :label="item.id"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="隶属机房" :label-width="formLabelWidth">
          <el-select v-model="computerForm.machine_roomId" placeholder="请选择机房" @blur="getLocationNum()">
            <el-option v-for="item in machine_roomList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机位" :label-width="formLabelWidth">
          <el-select v-model="computerForm.seatNum" placeholder="请选择机位">
            <el-option v-for="item in seatList"
                       :key="item.seatNum"
                       :label="item.seatNum"
                       :value="item.seatNum"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click='closeDialog(false)'>取 消</el-button>
        <el-button type="primary" @click="submit('computerForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

import { addComputer } from '@/api/basic/computer';

export default {
  name: 'ComputerForm',
  props: {
    actionType: {
      type: String,
      default: ''
    },
    selectedComputer: {
      type: Object
    }
  },
  data(){
    return {
      showDialog: false,
      computerForm: { ...this.selectedComputer },
      width:"45%",
      height:"2000px",
      formLabelWidth: '120px',
      configurationList: [{
        id: '1'
      }],//所有的配置信息
      machine_roomList: [{
        // id: '',
        // name: '',
        // pattern: '',
        // totalSeatNum: 1//默认位置数为0
      }],//获取机房数据
      seatList: [{
        seatNum: 1
      },{
        seatNum: 2
      }],
      rule: {
        configurationId:[
          { required:true,message:'请选择配置',trigger: 'blur' }
        ]
      },
    }
  },
  created() {
  },
  methods: {
    /**
     * 关闭对话框
     * @param changeInfo 数据更新, true:更新，false:未更新
     */
    closeDialog(changeInfo) {
      // 重置表单
      this.$refs['computerForm'].resetFields();
      // 关闭对话框
      this.showDialog = false;
      // 传递事件给父组件
      this.$emit('closeDialog', changeInfo);
    },
    /**
     * 提交表单
     * @param formName
     */
    submit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = { ...this.computerForm };
          console.log(params);
          if(this.actionType === '新增'){
            /**
             * 新增电脑信息
             */
            addComputer(params).then(res => {
              if (res.code === 200) {
                this.$message({ type: 'success', message: '添加成功！' });
                // 关闭对话框同时需要刷新数据
                this.closeDialog(true);
              }
            }).catch(err => {
              this.$message.error('请求出错了：' + err);
            });
          }
          // const instance = await axios.post('http://124.223.47.7/', this.form)
          alert('submit')
          this.addPage = false
        } else {
          console.log('dada');
          this.$message({ type: 'error', message: '提交失败，请检验数据是否合法！' });
          return false;
          // return false;
        }
      });
    },
    getLocationNum() {
      console.log('abcd')
    }
  }
}
</script>
<style scoped>
</style>
