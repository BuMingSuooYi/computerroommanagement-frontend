<template>
    <!--  上传文件弹窗  -->
    <el-dialog title='上传文件'
               center
               :before-close='handleClose'
               :visible.sync='showUploadDialog'>
        <el-upload
            ref='upload'
            class='upload-demo'
            drag
            :limit='this.fileNumLimit'

            :on-remove='handleRemove'
            :before-remove='beforeRemove'
            :auto-upload='false'
            :before-upload='beforeUploadFile'
            :on-exceed='handleExceed'
            :on-success='handleUploadSuccess'
            :on-error='handleUploadError'

            :file-list='uploadFile'
            :action='url'>
            <i class='el-icon-upload'></i>
            <div class='el-upload__text'>将文件拖到此处，或<em>点击上传</em></div>
            <div class='el-upload__tip' slot='tip'>只能上传excel文件，且不超过1个</div>
        </el-upload>
        <span slot='footer' class='dialog-footer'>
            <el-button @click='closeDialog'>取 消</el-button>
            <el-button type='primary' @click='submitUpload'>确 定</el-button>
        </span>
    </el-dialog>

</template>
<script>
import request from '@/utils/axios';
import { mapState, mapMutations } from 'vuex';

export default {
    props: {
        uploadUrl: {
            type: String
        }
    },
    data() {
        return {
            fileNumLimit: 2,// 文件数量限制
            uploadFile: [],
            uploadFlag: false,
            url: request.defaults.baseURL+this.uploadUrl
        };
    },
    created() {
    },
    computed: {
        // 使用了mapState辅助函数将showDialog状态映射到组件的showDialog计算属性中
        ...mapState(['showUploadDialog'])
    },
    methods: {
        request,
        ...mapMutations(['toggleUploadDialog', 'refreshTableData']),
        closeDialog() {
            this.toggleUploadDialog(false);
        },
        /**
         * 提交上传
         */
        submitUpload() {
            this.$refs.upload.submit();
        },
        /**
         * 移除文件
         * @param file
         * @param fileList
         * @returns {Promise<MessageBoxData>}
         */
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        /**
         * 已经移除结果提示
         * @param file
         * @param fileList
         * @returns {ElMessageComponent}
         */
        handleRemove(file, fileList) {
            return this.$message.success(`移除 ${file.name} 成功`);
        },
        /**
         * 限制上传文件
         * @param file
         */
        beforeUploadFile(file) {
            let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
            // 不是是excel文件
            if (extension !== 'xlsx') {
                this.$message.warning('只能上传后缀是.xlsx的文件');
                this.uploadFlag = false;
                // return;
            }
            // this.uploadFlag = true;
        },
        /**
         * 处理超过文件数量限制
         * @param files
         * @param fileList
         */
        handleExceed(files, fileList) {
            this.$message.warning(`当前已选择了 ${files.length} 个文件，超出 ${this.fileNumLimit} 个文件`);
        },
        handleUploadSuccess(response, file, fileList) {
            // 文件上传成功的处理逻辑
            this.$message.success('上传成功');
            this.closeDialog();
            this.refreshTableData(true);
            console.log('文件上传成功', response, file, fileList);
        },
        handleUploadError(error, file, fileList) {
            // 文件上传失败的处理逻辑
            this.uploadFlag = false;
            console.log('文件上传失败', error, file, fileList);
        },
        /**
         * 关闭对话框
         */
        handleClose() {
            this.closeDialog();
        }
    }
};
</script>
<style scoped>
/deep/ .el-dialog--center .el-dialog__body {
    padding: 25px 0;
}

.upload-demo {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
}
</style>
