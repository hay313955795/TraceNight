<template>
    <div>
        <el-dialog :title="'正在为角色组:'+role.roleName+';分配权限'" :visible="dialogFormVisible" :show-close="false"
                   width="80%">
            <el-row style="height: 600px">
                <el-col :span="6">
                    <el-tree
                            ref="menusTree"
                            :data="allMenus"
                            show-checkbox
                            node-key="id"
                            :props="defaultProps"
                            @node-click="handleNodeClick"
                            @check="checkNodeIsCheck"
                    >
                    </el-tree>
                </el-col>
                <el-col :span="18">
                    <el-table
                            ref="multipleTable"
                            border
                            :data="pathByMenuId"
                            tooltip-effect="dark"
                            style="width: 100%"
                            @select="changeOne"
                            @select-all="changeFun">
                        <!--@selection-change="handleSelectionChange">-->
                        <el-table-column
                                type="selection"
                                width="55">
                        </el-table-column>
                        <el-table-column
                                prop="name"
                                label="路径名称"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="url"
                                label="路径地址"
                                width="320">
                        </el-table-column>
                        <el-table-column
                                prop="method"
                                label="请求方式"
                                show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>

            <el-button type="primary" @click="dialogFormVisible = false ,$emit('cancel');">关 闭
            </el-button>
        </el-dialog>
    </div>
</template>

<script>

    import {getAllMenus, getPermissions, addPermissions, removePermissions, getPathByMenuId} from '../../../api/auth'

    export default {
        name: 'MenuPermissionsEdit',
        props: {
            role: [Object, Boolean],
        },
        data() {
            return {
                dialogFormVisible: false,
                allMenus: [],
                pathByMenuId: [],
                defaultProps: {
                    children: 'childs',
                    label: 'cname'
                },
                menuPermission: [],
                pathPermission: []
            }
        },
        watch: {
            'role': {
                handler: function () {
                    let self = this;
                    if (!self.role) {
                        return;
                    }
                    console.log(self.role);
                    self.dialogFormVisible = true;
                    this.findPermissions(self.role.id)
                }
            },

        },
        methods: {
            findPermissions(roleId) {
                this.menuPermission = [];
                getPermissions(roleId).then(r => {
                    if (r.rel) {
                        r.data.menus.forEach(id => {
                            this.menuPermission.push(id.id);
                        });
                        r.data.path.forEach(id => {
                            this.pathPermission.push(id.id);
                        });
                        this.$nextTick(function () {
                            this.$refs.menusTree.setCheckedKeys(this.menuPermission);
                        });
                    }
                }).catch();
            },
            findAllMenus() {
                getAllMenus().then(r => {
                    if (r.rel) {
                        this.allMenus = r.data
                    }
                }).catch()
            },
            handleNodeClick(node) {
                //当菜单节点被点击的时候回调函数
                getPathByMenuId(node.id).then(r => {
                    if (r.rel) {
                        this.pathByMenuId = r.data;
                        this.$nextTick(function () {
                            if (this.pathPermission.length > 0) {
                                this.pathByMenuId.forEach((path, index) => {
                                    if (this.pathPermission.indexOf(path.id) >= 0) {
                                        console.log('匹配上的权限');
                                        this.$refs.multipleTable.toggleRowSelection(this.pathByMenuId[index], true);
                                    } else {
                                        this.$refs.multipleTable.toggleRowSelection(this.pathByMenuId[index], false);
                                    }
                                });
                            } else {
                                this.$refs.multipleTable.clearSelection();
                            }
                        });
                    }
                }).catch();
            },
            checkNodeIsCheck(checkedNodes, checkedKeys) {
                let self = this;
                let idList = [];

                idList.push(checkedNodes.id);
                if (checkedNodes.childs) {
                    checkedNodes.childs.forEach(node => {
                        idList.push(node.id);
                    })
                }
                let removeId = [];
                let addId = [];
                idList.forEach(key => {
                    if (checkedKeys.checkedKeys.indexOf(key) < 0) {
                        //该id是被移除的id
                        removeId.push(key);
                    }
                    if (checkedKeys.checkedKeys.indexOf(key) >= 0) {
                        addId.push(key);
                    }
                });
                if (removeId.length > 0) {
                    let rolePermission = [];
                    removeId.forEach(r => {
                        rolePermission.push({
                            id: 0,
                            roleId: self.role.id,
                            resourceId: r,
                            resourceType: 'menus'
                        })
                    });
                    removePermissions(rolePermission).then().catch()
                }

                if (addId.length > 0) {
                    let rolePermission = [];
                    addId.forEach(r => {
                        rolePermission.push({
                            id: 0,
                            roleId: self.role.id,
                            resourceId: r,
                            resourceType: 'menus'
                        })
                    });
                    addPermissions(rolePermission).then().catch()
                }
            },
            changeOne(selection, row) {
                let flag = true;
                let self = this;
                let rolePermission = [];
                rolePermission.push({
                    id: 0,
                    roleId: self.role.id,
                    resourceId: row.id,
                    resourceType: 'path'
                });
                selection.forEach(s => {
                    if (s.id === row.id) {
                        flag = false;
                        //新增
                        addPermissions(rolePermission).then().catch()
                    }
                });
                if (flag) {
                    //移除
                    removePermissions(rolePermission).then().catch()
                }
            },
            changeFun(val) {
                let self = this;
                let rolePermission = [];
                if (val.length > 0) {
                    //新增
                    val.forEach(v => {
                        rolePermission.push({
                            id: 0,
                            roleId: self.role.id,
                            resourceId: v.id,
                            resourceType: 'path'
                        })
                    });
                    addPermissions(rolePermission).then().catch();
                } else {
                    //移除 当页所有数据
                    self.pathByMenuId.forEach(v => {
                        rolePermission.push({
                            id: 0,
                            roleId: self.role.id,
                            resourceId: v.id,
                            resourceType: 'path'
                        })
                    });
                    removePermissions(rolePermission).then().catch();
                }
            }
        },
        mounted: function () {
            this.findAllMenus();
        },
        components: {}
    }
</script>
<style lang="scss">
    .role-dialog {

    }
</style>
