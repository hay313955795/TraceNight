<template>
    <div class="user-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="editUser(false)">添加</el-button>
            <div style="float: right">
                <el-input
                        placeholder="请输入用户昵称！"
                        size="small"
                        style="width: 140px"
                        v-model="params.name"
                        @clear="searchUser"
                        clearable>
                </el-input>
                <el-button @click="searchUser" type="success" icon="el-icon-search" size="small"></el-button>
            </div>
        </ToolBar>
        <el-table
                :data="usersData.data"
                border
                ref="table"
                style="width: 100%">
            <el-table-column
                    align="center"
                    width="150px"
                    prop="userName"
                    label="登录账号">
            </el-table-column>
            <el-table-column
                    align="center"
                    width="150px"
                    prop="nickName"
                    label="昵称">
            </el-table-column>
            <el-table-column
                    align="center"
                    width="500px"
                    prop="introduce"
                    label="帐号说明">
            </el-table-column>

            <el-table-column
                    align="center"
                    prop="status"
                    width="100px"
                    label="帐号状态">
                <div slot-scope="scope" style="width: 100%;text-align: center">
                    <el-tag v-if="scope.row.status">正常</el-tag>
                    <el-tag v-else type="danger">停用</el-tag>
                </div>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作"
                    :render-header="tableAction"
                    width="776">
                <template slot-scope="scope">
                    <el-button @click="resetting(scope.row.id)" type="warning" title="重置密码" style="transition: .4s;"
                               :ref="scope.row.id" icon="el-icon-refresh" size="small" circle></el-button>
                    <el-button @click="editUser(scope.row)" type="primary" title="编辑" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <el-button @click="deleteUser(scope.row.id)" title="停用账户" v-if="scope.row.status != '0'"
                               type="danger" icon="el-icon-close" circle size="small"></el-button>
                    <el-button @click="deleteUser(scope.row.id)" title="启用账户" v-else icon="el-icon-check" type="success"
                               circle size="small"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="usersData.current_page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="usersData.page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="usersData.total">
        </el-pagination>


        <el-dialog :title="title" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="form.nickName" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="账户" prop="userName">
                    <el-input v-model="form.userName" placeholder="请输入账户"></el-input>
                </el-form-item>
                <el-form-item label="密码" v-if="isCreate" placeholder="请输入密码" prop="password">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容"
                              v-model="form.introduce"></el-input>
                </el-form-item>
                <el-form-item label="帐号状态">
                    <el-switch v-model="form.status"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('form')">取 消</el-button>
                <el-button type="primary" @click="save('form')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import {getUserInfo, deleteUser, resetPwd, saveUser} from '../../api/user'

    export default {
        data() {
            return {
                rules: {
                    nickName: [
                        {
                            required: true,
                            message: '请输入用户昵称',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 20,
                            message: '长度在 3 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    userName: [
                        {
                            required: true,
                            message: '请输入账户',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 20,
                            message: '长度在 3 到 20 个字符',
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        },
                        {
                            min: 5,
                            max: 20,
                            message: '长度在 5 到 20 个字符',
                            trigger: 'blur'
                        }
                    ]
                },
                params: {
                    name: '',
                },
                title: '',
                dialogFormVisible: false,
                isCreate: true,
                form: {
                    id: 0,
                    userName: '',
                    password: '',
                    nickName: '',
                    introduce: '',
                    status: true
                },
                usersData: {
                    current_page: 1,
                    page_size: 10,
                    total: 0,
                    data: []
                }
            }
        },
        mounted: function () {
            this.searchUser("")
        },
        methods: {
            getUser(param) {
                getUserInfo(param).then(r => {
                    if (r.rel) {
                        this.usersData.total = r.data.total;
                        this.usersData.data = r.data.rows;
                    }
                }).catch()
            },
            searchUser(param) {
                this.usersData.current_page = 1;
                param = this.params.name + "&page=" + this.usersData.current_page + "&limit=" + this.usersData.page_size;
                this.getUser(param)
            },
            handleSizeChange(size) {
                this.usersData.current_page = 1;
                this.usersData.page_size = size;
                //size 发生变化时候
                let param = this.params.name + "&page=" + this.usersData.current_page + "&limit=" + this.usersData.page_size;

                this.getUser(param);
            },
            handleCurrentChange(page) {
                //size 发生变化时候
                this.usersData.current_page = page;
                let param = this.params.name + "&page=" + this.usersData.current_page + "&limit=" + this.usersData.page_size;
                this.getUser(param);
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: '重置密码为123456 / 编辑用户 / 删除或恢复用户'
                    }
                }, '操作');
            },
            editUser(data) {
                if (!data) {
                    this.form = {};
                    this.isCreate = true;
                    this.title = '用户新增';
                    this.dialogFormVisible = true;
                } else {
                    this.isCreate = false;
                    this.form = data;
                    this.title = '用户编辑';
                    this.dialogFormVisible = true;
                }
            },
            cancel(formName) {
                this.$message({
                    message: '用户取消编辑',
                    type: 'success'
                });
                this.dialogFormVisible = false;
            },
            save(formName) {
                console.log("111");
                let userFrom = this.form;
                saveUser(userFrom).then(r => {
                    this.$message({
                        message: r.message,
                        type: 'success'
                    });
                    this.dialogFormVisible = false;
                }).catch()
            },
            deleteUser(id) {
                deleteUser(id).then(r => {
                    if (r.rel) {
                        this.$message({
                            message: r.message,
                            type: 'success'
                        });
                        setTimeout(
                            function () {
                                getUserInfo("")
                            }, 1000);
                    } else {
                        this.$message({
                            message: r.message,
                            type: 'waring'
                        });
                    }
                }).catch();
            },
            resetting(id) {
                resetPwd(id).then(r => {
                    if (r.rel) {
                        this.$message({
                            message: r.message,
                            type: 'success'
                        });
                    } else {
                        this.$message({
                            message: r.message,
                            type: 'waring'
                        });
                    }
                }).catch();
            },
        },
        components: {
            ToolBar, HelpHint
        }
    }
</script>
<style lang="scss">

</style>
