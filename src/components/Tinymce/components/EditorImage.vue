<template>
  <div class="upload-container">
    <el-button
      :style="{ background: color, borderColor: color }"
      icon="el-icon-upload"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
    >
      上传
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <!-- https://httpbin.org/post  -->
      <el-upload
        action="#"
        list-type="picture-card"
        :file-list="fileList"
        :multiple="true"
        :show-file-list="true"
        :http-request="requestUpload"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
      >
        <el-button size="small" type="primary"> 点击上传 </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false"> 取消 </el-button>
      <el-button type="primary" @click="handleSubmit"> 确认 </el-button>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

export default {
  name: "EditorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#1890ff",
    },
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
    };
  },
  methods: {
    // 覆盖默认的上传行为
    requestUpload(param) {
      // console.log(param)
      return param;
    },
    // 验证文件全部上传至浏览器完成
    checkAllSuccess() {
      return Object.keys(this.listObj).every(
        (item) => this.listObj[item].hasSuccess
      );
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map((v) => this.listObj[v]);
      if (!this.checkAllSuccess()) {
        this.$message(
          "请等待所有图片上传成功。 如果有网络问题，请刷新页面并重新上传!"
        );
        return;
      }

      console.log("arr", arr);
      for (let i = 0, len = arr.length; i < len; i++) {
        console.log(arr[i]);
      }

      this.$emit("successCBK", arr);
      this.listObj = {};
      this.fileList = [];
      this.dialogVisible = false;
    },

    // 文件上传至浏览器成功钩子函数
    handleSuccess(response, file) {
      console.log("-->handleSuccess<--");
      console.log("上传成功！");
      console.log("response", response);
      console.log("file", file);
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      console.log(objKeyArr);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response.files.file;
          this.listObj[objKeyArr[i]].hasSuccess = true;
          return;
        }
      }
    },

    // 文件列表移除文件时的钩子
    handleRemove(file) {
      console.log(file)
      const uid = file.uid;
      const objKeyArr = Object.keys(this.listObj);
      console.log("handleRemove objKeyArr", objKeyArr);
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]];
          return;
        }
      }
    },

    beforeUpload(file) {
      console.log("-->beforeUpload<--");
      const _self = this;
      const _URL = window.URL || window.webkitURL;
      const fileName = file.uid;
      this.listObj[fileName] = {};

      console.log("浏览器读取文件开始：", file.uid);
      this.listObj[fileName] = {
        uid: '',
        url: "",
        width: '',
        height: '',
        hasSuccess: false,
      };
      return new Promise((resolve, reject) => {
        // 读取文件
        // const reader =  new Image()
        // reader.src = _URL.createObjectURL(file)
        const reader = new FileReader();
        reader.url = reader.readAsDataURL(file);
        reader.onload =  function() {
          console.log(reader);
          console.log(file);
          console.log("浏览器读取文件完成：", file.uid);
          _self.listObj[file.uid].uid = file.uid;
          _self.listObj[file.uid].width = this.width;
          _self.listObj[file.uid].height = this.height;
          _self.listObj[file.uid].hasSuccess = true;
          _self.listObj[file.uid].url = reader.result;
        };
        resolve(true);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
