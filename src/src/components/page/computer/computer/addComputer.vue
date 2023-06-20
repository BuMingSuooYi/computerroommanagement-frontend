<template>
  <div>
    <el-dialog
        :modal="true"
        :modal-append-to-body="true"
        :title="title"
        :visible.sync="addPage"
        :width="width"
        :height="height"
        :close-on-click-modal="false"
        :show-close="true"
        :close-on-press-escape="true"
        center
        @close="close">
      <el-form :model="form" :rules="rule" ref="form">
        <el-form-item label="配置信息" :label-width="formLabelWidth" prop="configurationId">
          <el-select v-model="form.configurationId" placeholder="请选择配置">
            <el-option v-for="item in configurationList"
                       :key="item.id"
                       :label="item.id"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="隶属机房" :label-width="formLabelWidth">
          <el-select v-model="form.machine_roomId" placeholder="请选择机房" @blur="getLocationNum()">
            <el-option v-for="item in machine_roomList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机位" :label-width="formLabelWidth">
          <el-select v-model="form.seatNum" placeholder="请选择机位">
            <el-option v-for="item in seatList"
                       :key="item.seatNum"
                       :label="item.seatNum"
                       :value="item.seatNum"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close()">取 消</el-button>
        <el-button type="primary" @click="submit('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

export default {
  props: {
    addPage: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '新增'
    }
  },
  data(){
    return {
      width:"45%",
      height:"2000px",
      formLabelWidth: '120px',
      form: {//提交的表单
        configurationId: null,
        machine_roomId: '',
        seatNum: ''
      },
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
  methods: {
    close(){
      this.form.seatNum = null
      this.form.configurationId = null
      this.form.machine_roomId = null
      this.addPage = false
      this.$emit('transfer')
    },
    submit(form) {
      this.$refs[form].validate(async (valid) => {
        console.log(valid)
        if (valid) {
          // const instance = await axios.post('http://124.223.47.7/', this.form)
          alert('submit')
          this.addPage = false
        } else {
          console.log('error submit!!');
          // return false;
        }
      })
    },
    getLocationNum() {
      console.log('abcd')
    }
  }
}
</script>
<style scoped>
</style>
