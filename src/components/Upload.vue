<template>
  <div class="upload-wrap">
    <label v-for="(file, index) in fileList" class="upload upload-active">
      <span class="upload-img" :style="{backgroundImage:`url(${file.img_source})`}"></span>
      <span @click.prevent="imgReduce(file, index, fileList)" class="upload-del iconfont icon-reduce"></span>
      <input @change="mUploadImgOne(fileList, index, $event)" style="display: none;" type="file" accept="image/jpeg,image/gif,image/png">
    </label>
    <label v-if="fileList.length !== maxLen" class="upload">
      <span class="upload-img"></span>
      <span class="upload-del iconfont icon-reduce"></span>
      <input @change="mUploadImg(fileList, $event)" style="display: none;" type="file" accept="image/jpeg,image/gif,image/png" multiple>
    </label>
    <span class="upload-desc">上传凭证（最多{{maxLen}}张）</span>
  </div>
</template>

<script>
  import uploadImg from 'api/upload-img';

  export default {
    name: 'Upload',

    props: {
      fileList: {
        type: Array,
        default: () => [],
      },
      maxLen: {
        type: Number,
        default: 5,
      },
      params: {
        type: Object,
        default: () => ({
          site_id: 84664,
        }),
      },
    },

    methods: {
      mUploadImg(fileList, { target }) {
        const files = target.files;
        if (fileList.length < this.maxLen) {
          uploadImg.postData(files, this.params.site_id).then((data) => {
            data.forEach((v2) => {
              if (fileList.length < this.maxLen) {
                fileList.push(v2);
              }
            });
            this.$emit('on-change', fileList);
          }).catch((error) => {
            console.log(error);
          });
        }
      },
      mUploadImgOne(fileList, index, { target }) {
        const files = target.files;
        uploadImg.postData(files, this.params.site_id).then((data) => {
          fileList.splice(index, 1, data[0]);
          this.$emit('on-change', fileList);
        }).catch((error) => {
          console.log(error);
        });
      },
      imgReduce(v, i, fileList) {
        fileList.splice(i, 1);
        this.$emit('on-change', fileList);
      },
    },
  };
</script>

<style lang="scss">
  .upload-wrap {
    display: inline-block;

    .upload {
      cursor: pointer;
      background: white;
      border: 2px dashed #dddddd;
      width: 56px;
      height: 56px;
      position: relative;
      float: left;
      box-sizing: border-box;
      margin-right: 10px;

      &::before,
      &::after {
        display: block;
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        background: #d8d8d8;
      }

      &::before {
        width: 22px;
        height: 4px;
        margin-top: -2px;
        margin-left: -11px;
      }

      &::after {
        height: 22px;
        width: 4px;
        margin-top: -11px;
        margin-left: -2px;
      }

      .upload-img {
        display: none;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: center center no-repeat #cccccc;
        background-size: cover;
        z-index: 2;
      }

      .upload-del {
        display: none;
        position: absolute;
        font-size: 14px;
        width: 16px;
        height: 16px;
        line-height: 16px;
        text-align: center;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.4);
        color: white;
        right: -8px;
        top: -8px;
        z-index: 3;
      }

      &.upload-active {
        border: none;
        .upload-img {
          display: block;
        }
        .upload-del {
          display: block;
        }
      }
    }

    .upload-desc {
      float: left;
      margin-top: 18px;
      font-size: 12px;
      color: #333333;
      line-height: 20px;
      text-align: left;
    }
  }
</style>
