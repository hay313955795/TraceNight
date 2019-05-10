<template>
    <div class="role-list">
        <ToolBar>
            <el-button type="primary" icon="el-icon-plus" size="small" @click="beforeEdit(false)">添加</el-button>
            <div style="float: right">
                <el-input
                        placeholder="请输入角色名称！"
                        size="small"
                        style="width: 140px"
                        v-model="search.name"
                        @clear="searchRole"
                        clearable>
                </el-input>
                <el-button @click="searchRole" type="success" icon="el-icon-search" size="small"></el-button>
            </div>
        </ToolBar>
        <el-table
                :data="roleData.data"
                border
                ref="roleDataTable"
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
                    <el-button @click="beforeEdit(scope.row)" type="warning" icon="el-icon-edit" size="small"
                               circle></el-button>
                    <el-button @click="allotUser = scope.row" type="success" icon="el-icon-star-on"
                               size="small"
                               circle></el-button>
                    <el-button @click="MenuAndPathPermission = scope.row" type="primary" icon="el-icon-tickets"
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
                :dialogFormVisible="roleEditShow"
                :data="chooseRole"
                @val-change="roleEditChange"
                @cancel="roleEditShow = false"
        >
        </RoleEdit>
        <AllotUserEdit
                :role="allotUser"
                @success="allotUser = false;"
                @cancel="allotUser = false;"
        ></AllotUserEdit>

        <MenuAndPathPermissionsEdit
                :role="MenuAndPathPermission"
                :dialogFormVisible="MenuAndPathPermissionShow"
                @cancel="MenuAndPathPermission = false"
        >
        </MenuAndPathPermissionsEdit>

    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import HelpHint from '@/components/HelpHint.vue';
    import RoleEdit from './RoleEdit.vue'
    import AllotUserEdit from './AllotUserEdit.vue'
    import MenuAndPathPermissionsEdit from './MenuAndPathPermissionsEdit.vue'
    import {getRoleInfo, saveRoleInfo, deleteRole} from '../../../api/role'

    export default {
        data() {
            return {
                roleEditTitle: '角色编辑',
                chooseRole: false,
                MenuAndPathPermission: false,
                roleEditShow: false,
                allotUser: false,
                MenuAndPathPermissionShow: false,
                search: {
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
            searchRole() {
                this.roleData.current_page = 1;
                let param = this.search.name + "&page=" + this.roleData.current_page + "&limit=" + this.roleData.page_size;
                this.getRole(param)
            },
            handleSizeChange(size) {
                this.roleData.current_page = 1;
                this.roleData.page_size = size;
                //size 发生变化时候
                let param = this.search.name + "&page=" + this.roleData.current_page + "&limit=" + this.roleData.page_size;

                this.getRole(param);
            },
            handleCurrentChange(page) {
                //size 发生变化时候
                this.roleData.current_page = page;
                let param = this.search.name + "&page=" + this.roleData.current_page + "&limit=" + this.roleData.page_size;
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
                let self = this;
                saveRoleInfo(data).then(r => {
                    if (r.rel) {
                        self.$notify({
                            title: self.roleEditTitle + '成功！',
                            message: '',
                            type: 'success'
                        });
                        this.searchRole("");
                        self.roleEditShow = false;
                    }
                }).catch();
            },
            beforeEdit(data) {
                if (data) {
                    this.roleEditTitle = '角色编辑';
                    this.chooseRole = data;
                } else {
                    this.roleEditTitle = '角色新增';
                    this.chooseRole = false;
                }
                this.roleEditShow = true;

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
            ToolBar, HelpHint, RoleEdit, AllotUserEdit, MenuAndPathPermissionsEdit
        }
    }
</script>
<style lang="scss">

</style>
