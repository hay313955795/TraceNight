<template>
  <div class="role-dialog">
    <el-dialog :title="title" :visible="dialogFormVisible" :show-close="false" width="45%">
      <el-form :model="form">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="form.introduce" type="textarea" :rows="3" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('cancel');">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="btnOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'RoleEdit',
    props: {
      dialogFormVisible: Boolean,
      data: [Object, Boolean],
      title: String,
    },
    data() {
      return {
        form: {
          id: 0,
          roleName: '',
          introduce: '',
        },
        btnLoading: false,
      }
    },
    watch: {
      'data': {
        handler: function () {
          if (this.data) {
            //编辑
            this.form = this.data;
          } else {
            //新增
            this.form ={};
          }
        },
        deep: true
      }
    },
    methods: {
      handleChange() {
      },
      btnOk() {
        let errorMsg = false;
        let formData = this.form;

        if (formData.roleName.length <= 2) errorMsg = '角色名称必须大于2个字符';

        if (errorMsg) {
          this.$message.error(errorMsg);
          return;
        }
        //子组件将事件发送到父组件中
        this.$emit('val-change', this.form);
        this.btnLoading = true;
        setTimeout(() => {
          this.btnLoading = false
        }, 1000)
      },
    },
    components: {}
  }
</script>
<style lang="scss">
  .role-dialog {

  }
</style>
