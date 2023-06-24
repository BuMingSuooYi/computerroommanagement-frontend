import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // 控制文件上传对话框隐藏显示
        showUploadDialog: false,
        // 文件上传成功
        uploadSuccess: false,
        machineRoomData: {},
    },
    mutations: {
        /**
         * 文件上传对话框
         * @param state
         * @param value
         */
        toggleUploadDialog(state, value) {
            state.showUploadDialog = value;
        },
        /**
         * 刷新表格数据
         * @param state
         * @param value
         */
        refreshTableData(state, value) {
            state.uploadSuccess = value;
        },
        Set_MachineRoom(state, data) {
            state.machineRoomData = data;
        },
        Clear_MachineRoom(state) {
            state.machineRoomData = {};
        },
    }
});

