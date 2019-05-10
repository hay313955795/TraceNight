<template>
    <div class="role-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="editRole(false)">添加</el-button>
            <div style="float: right">
                <el-input
                        placeholder="请输入角色名称！"
                        size="small"
                        style="width: 140px"
                        v-model="params.name"
                        @clear="searchRole"
                        clearable>
                </el-input>
                <el-button @click="searchRole" type="success" icon="el-icon-search" size="small"></el-button>
            </div>
        </ToolBar>
        <el-table
                :data="roleData.data"
                border
                ref="table"
                style="width: 100%">
            <el-table-column
                    header-align="center"
                    align="center"
                    width="100"
                    prop="id"
                    label="序号">
            </el-table-column>
            <el-table-column
                    header-align="center"
                    align="center"
                    width="300"
                    prop="roleName"
                    label="角色名称">
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="introduce"
                    label="描述">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作"
                    :render-header="tableAction"
                    width="300">
                <template slot-scope="scope">
                    <el-button @click="editRole(scope.row)" type="warning" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <el-button @click="currentEditPermissions = scope.row" type="success" icon="el-icon-star-on"
                               size="small"
                               circle></el-button>
                    <el-button @click="MenuPermissionsEditRole = scope.row" type="primary" icon="el-icon-tickets"
                               size="small"
                               circle></el-button>
                    <el-button @click="deleteRole(scope.row.id)" title="删除角色组"
                               type="danger" icon="el-icon-close" circle size="small"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="roleData.current_page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="roleData.page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="roleData.total">
        </el-pagination>

        <RoleEdit
                :title="roleEditTitle"
                :dialogFormVisible="dialogFormVisible"
                :data="currentEditRole"
                @val-change="roleEditChange"
                @cancel="dialogFormVisible = false"
        >
        </RoleEdit>
        <PermissionsEdit
                :role="currentEditPermissions"
                @success="currentEditPermissions = false;"
                @cancel="currentEditPermissions = false;"
        ></PermissionsEdit>

        <MenuPermissionsEdit
                :role="MenuPermissionsEditRole"
                :dialogFormVisible="MenuPermissionsDialogFormVisible"
                @cancel="MenuPermissionsEditRole = false"
        >
        </MenuPermissionsEdit>

    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import RoleEdit from './RoleEdit.vue'
    import PermissionsEdit from './PermissionsEdit.vue'
    import MenuPermissionsEdit from './MenuPermissionsEdit.vue'
    import {getRoleInfo, saveRoleInfo, deleteRole} from '../../../api/role'
    export default {
        data() {
            return {
                roleEditTitle: '角色编辑',
                currentEditRole: false,
                MenuPermissionsEditRole:false,
                dialogFormVisible: false,
                currentEditPermissions: false,
                MenuPermissionsDialogFormVisible:false,
                params: {
                    name: '',
                },
                roleData: {
                    current_page: 1,
                    page_size: 10,
                    total: 0,
                    data: []
                }
            }
        },
        mounted: function () {
            this.searchRole("")
        },
        methods: {
            getRole(param) {
                getRoleInfo(param).then(r => {
                    if (r.rel) {
                        this.roleData.total = r.data.total;
                        this.roleData.data = r.data.rows;
                    }
                }).catch()
            },
            searchRole(param) {
                this.roleData.current_page = 1;
                param = this.params.name + "&page=" + this.roleData.current_page + "&limit=" + this.roleData.page_size;
                this.getRole(param)
            },
            handleSizeChange(size) {
                this.roleData.current_page = 1;
                this.roleData.page_size = size;
                //size 发生变化时候
                let param = this.params.name + "&page=" + this.roleData.current_page + "&limit=" + this.roleData.page_size;

                this.getRole(param);
            },
            handleCurrentChange(page) {
                //size 发生变化时候
                this.roleData.current_page = page;
                let param = this.params.name + "&page=" + this.roleData.current_page + "&limit=" + this.roleData.page_size;
                this.getRole(param);
            },
            tableAction() {
                return this.$createElement('HelpHint', {
                    props: {
                        content: '编辑角色 / 绑定指定用户 / 分配权限 / 删除角色'
                    }
                }, '操作');
            },
            roleEditChange(data) {
                console.log(data);
                let self = this;
                saveRoleInfo(data).then(r => {
                    if (r.rel) {
                        self.$notify({
                            title: self.roleEditTitle + '成功！',
                            message: '',
                            type: 'success'
                        });
                        this.searchRole("");
                        self.dialogFormVisible = false;
                    }
                }).catch();
            },
            editRole(data) {
                console.log(data);
                if (data) {
                    this.roleEditTitle = '角色编辑';
                    this.currentEditRole = data;
                } else {
                    this.roleEditTitle = '角色新增';
                    this.currentEditRole = false;
                }
                this.dialogFormVisible = true;

            },
            UploadRole(data) {

            },
            deleteRole(id) {
                deleteRole(id)
                    .then(r => {
                        if (r.rel) {
                            this.$message({
                                message: r.message,
                                type: 'success'
                            });
                            this.searchRole("");

                        }
                    })
                    .catch();
            },
        },
        components: {
            ToolBar, HelpHint, RoleEdit, PermissionsEdit,MenuPermissionsEdit
        }
    }
</script>
<style lang="scss">

</style>
