<template>
    <div class="role-dialog">
        <el-dialog :title="'分配“'+role.roleName+'”下的用户'" :visible="dialogFormVisible" :show-close="false">
            <el-table
                    :data="usersData.data"
                    border
                    height="500"
                    ref="permissionsTable"
                    @select="changeOne"
                    @select-all="changeFun"
                    style="width: 100%">
                <el-table-column
                        type="selection"
                        width="35">
                </el-table-column>
                <el-table-column
                        width="200"
                        prop="userName"
                        label="登录名">
                </el-table-column>
                <el-table-column
                        width="200"
                        prop="nickName"
                        label="用户名称">
                </el-table-column>
                <el-table-column
                        align="center"
                        prop="status"
                        width="484px"
                        label="帐号状态">
                    <div slot-scope="scope" style="width: 100%;text-align: center">
                        <el-tag v-if="scope.row.status">正常</el-tag>
                        <el-tag v-else type="danger">停用</el-tag>
                    </div>
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
            <div slot="footer" class="dialog-footer">
                <div style="float: left">
                    <el-input
                            placeholder="搜索权限名称"
                            v-model="searchPermissionsDisplayName"
                            clearable>
                    </el-input>
                </div>
                <el-button type="primary" @click="dialogFormVisible = false, multipleSelection=[],$emit('cancel');">关 闭
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import AllRouter from '@/router/'
    import {getUserInfo} from '../../../api/user'
    import {getAllotUser, allotUser, removeUser} from '../../../api/role'

    export default {
        name: 'PermissionsEdit',
        props: {
            role: [Object, Boolean],

        },
        data() {
            return {
                dialogFormVisible: false,
                btnLoading: false,
                allPermissions: [],
                searchPermissionsDisplayName: '',
                multipleSelection: [],
                AllotUser: [],
                usersData: {
                    current_page: 1,
                    page_size: 10,
                    total: 0,
                    data: []
                }
            }
        },
        watch: {
            'role': {
                handler: function () {
                    console.log('watch')
                    let self = this;
                    if (!self.role) {
                        return;
                    }
                    self.AllotUser = [];
                    self.multipleSelection = [];
                    this.searchUser("");
                    this.findAllotUser(self.role.id);
                    self.dialogFormVisible = true;

                },
                deep: true
            },
            'searchPermissionsDisplayName': {
                handler: function () {
                    this.searchPermissions();
                }

            },
            'AllotUser': {
                handler: function () {
                    this.checkBind();
                }
            }
        },
        methods: {
            checkBind() {
                let checkList = [];
                this.usersData.data.forEach((user, index) => {
                    this.AllotUser.forEach(allotUser => {
                        this.$nextTick(function () {
                            this.$refs.permissionsTable.toggleRowSelection(this.usersData.data[index], false);
                        });
                        if (user.id == allotUser.id) {
                            checkList.push(user.id);
                        }
                    })
                });

                checkList.forEach(id => {
                    this.usersData.data.forEach((user, index) => {
                        if (user.id == id) {
                            this.$nextTick(function () {
                                this.$refs.permissionsTable.toggleRowSelection(this.usersData.data[index], true);
                            });
                        }
                    })
                })
            },
            findAllotUser(id) {
                getAllotUser(id).then(r => {
                    //数据绑定到
                    this.AllotUser = r.data;
                    this.checkBind();
                }).catch();
            },
            getUser(param) {
                getUserInfo(param).then(r => {
                    if (r.rel) {
                        this.usersData.total = r.data.total;
                        this.usersData.data = r.data.rows;
                        this.checkBind();
                    }
                }).catch()
            },
            searchUser(param) {
                this.usersData.current_page = 1;
                param = this.searchPermissionsDisplayName + "&page=" + this.usersData.current_page + "&limit=" + this.usersData.page_size;
                this.getUser(param)
            },
            handleSizeChange(size) {
                this.usersData.current_page = 1;
                this.usersData.page_size = size;
                //size 发生变化时候
                let param = this.searchPermissionsDisplayName + "&page=" + this.usersData.current_page + "&limit=" + this.usersData.page_size;
                this.getUser(param);
            },
            handleCurrentChange(page) {
                //size 发生变化时候
                this.usersData.current_page = page;
                let param = this.searchPermissionsDisplayName + "&page=" + this.usersData.current_page + "&limit=" + this.usersData.page_size;
                this.getUser(param);
            },
            searchPermissions() {
                this.searchUser("")
            },
            changeOne(selection, row) {
                let flag = true;
                let self = this;
                selection.forEach(s => {
                    if (s.id === row.id) {
                        flag = false;
                        //新增
                        let param = {
                            "roleId": self.role.id,
                            "members": row.id + ''
                        };
                        allotUser(param).then(r => {
                            if (r.rel) {
                                this.findAllotUser(self.role.id);
                                return;
                            }
                        }).catch();

                    }
                });
                if (flag) {
                    //移除
                    let param = {
                        "roleId": self.role.id,
                        "userIds": row.id + ''
                    };
                    removeUser(param).then(r => {
                            if (r.rel) {
                                this.findAllotUser(self.role.id)
                            }
                        }
                    ).catch()
                }


            },
            changeFun(val) {
                let self = this;
                if (val.length > 0) {
                    //新增
                    let members = '';
                    val.forEach(v => {
                        members = members + v.id + ",";
                    });
                    let param = {
                        "roleId": self.role.id,
                        "members": members
                    };
                    allotUser(param).then(r => {
                        if (r.rel) {
                            this.findAllotUser(self.role.id);
                            return;
                        }
                    }).catch();
                } else {
                    //移除 当页所有数据
                    //移除
                    let members = '';
                    self.usersData.data.forEach(
                        v => {
                            members = members + v.id + ",";
                        }
                    );
                    let param = {
                        "roleId": self.role.id,
                        "userIds": members
                    };
                    removeUser(param).then(r => {
                            if (r.rel) {
                                this.findAllotUser(self.role.id)
                            }
                        }
                    ).catch()
                }
            },
        },
        mounted: function () {
        },
        components: {}
    }
</script>
<style lang="scss">
    .permissions-dialog {

    }
</style>
