<template>
    <div class="menuManageBox">
        <el-row>
            <el-button type="primary" @click="createMenu">新增</el-button>
            <el-button type="success" @click="editMenu" v-if=" typeof (menuFrom.id) != 'undefined'&&menuFrom.id !=0">
                编辑
            </el-button>
            <el-button type="danger" @click="deleteMenu" v-if=" typeof (menuFrom.id) != 'undefined'&&menuFrom.id !=0">
                删除
            </el-button>
        </el-row>
        <br/>
        <el-row>
            <el-col :span="6">
                <el-tree :data="allMenus" :props="defaultProps"
                         @node-click="menuTreeNodeClick"
                         style="  background-color:#F5F5F5; border:#fff1ea;border-radius: 10px;margin-right: 15px ;box-shadow:4px 4px 10px #000;"
                ></el-tree>
            </el-col>
            <el-col :span="18">

                <div style=" background-color:#F5F5F5; border:#fff1ea;padding: 15px 15px;border-radius: 10px;box-shadow:4px 4px 10px #000;">

                    <el-tag type="success" v-if="menuIsCreated">菜单新增中</el-tag>
                    <el-tag type="success" v-if="menuIsEdited">菜单编辑中</el-tag>
                    <el-form ref="menuFrom" :model="menuFrom" label-width="100px">
                        <!--如果是新增则选择父节点-->
                        <el-form-item label="父节点Id">
                            <el-select v-model="menuFrom.parentMenuId" placeholder="请选择菜单类型"
                                       :disabled="!menuIsCreated&&!menuIsEdited">
                                <el-option label="根节点" value="0"></el-option>
                                <el-option :label="menus.cname" :value="menus.id" v-for="menus in allMenus"
                                           v-if="menus.cname!='首页'"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-row :span="14">
                            <el-col :span="6">
                                <el-form-item label="菜单名称">
                                    <el-input v-model="menuFrom.cname" style="width: 200px"
                                              :disabled="!menuIsCreated&&!menuIsEdited"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="菜单代码">
                                    <el-input v-model="menuFrom.ename"
                                              :disabled="!menuIsCreated&&!menuIsEdited"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="菜单图标">
                            <el-input v-model="menuFrom.icon" :disabled="!menuIsCreated&&!menuIsEdited"></el-input>
                        </el-form-item>
                        <el-row :span="14">
                            <el-col :span="8">
                                <el-form-item label="前端地址">
                                    <el-input v-model="menuFrom.value" style="width: 300px"
                                              :disabled="!menuIsCreated&&!menuIsEdited"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="菜单类型">
                                    <el-select v-model="menuFrom.type" placeholder="请选择菜单类型"
                                               :disabled="!menuIsCreated&&!menuIsEdited">
                                        <el-option label="菜单" value="NONE"></el-option>
                                        <el-option label="按钮" value="LINK"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="菜单排序">
                            <el-input-number v-model="menuFrom.sort" :min="2" :max="1000"
                                             :disabled="!menuIsCreated&&!menuIsEdited"
                                             label="计数器max=10,min=2"></el-input-number>
                        </el-form-item>
                        <el-form-item label="菜单说明">
                            <el-input type="textarea" v-model="menuFrom.discription"
                                      :disabled="!menuIsCreated&&!menuIsEdited"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button type="success" @click="save" v-if="menuIsCreated||menuIsEdited">保存</el-button>
                    <el-button type="info" @click="cancel" v-if="menuIsCreated||menuIsEdited">取消</el-button>
                </div>
                <br><br>
                <el-row style=" background-color:#F5F5F5; border:#fff1ea;padding: 15px 15px;border-radius: 10px;box-shadow:4px 4px 10px #000;">
                    <el-button type="primary" @click="pathIsCreated = !pathIsCreated ; pathForm.menuId = menuFrom.id"
                               v-if=" typeof (menuFrom.id) != 'undefined'&&menuFrom.id !=0">新增
                    </el-button>
                    <br><br>
                    <el-table
                            ref="multipleTable"
                            border
                            stripe
                            :data="pathByMenuId"
                            tooltip-effect="dark"
                            style="width: 100%">
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
                        <el-table-column
                                align="center"
                                label="操作"
                                width="300">
                            <template slot-scope="scope">
                                <el-button @click="editRole(scope.row)" type="warning"
                                >编辑
                                </el-button>
                                <el-button @click="deleteRole(scope.row.id)"
                                           type="danger">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-col>

        </el-row>
        <br>
        <el-dialog :title="'正在为<'+menuFrom.cname+'>菜单编辑请求路径'" :visible.sync="pathIsCreated">
            <el-form ref="pathForm" :model="pathForm" label-width="100px">
                <el-form-item label="路径名称">
                    <el-input v-model="pathForm.name" :disabled="!pathIsCreated"></el-input>
                </el-form-item>
                <el-form-item label="请求地址">
                    <el-input v-model="pathForm.url" :disabled="!pathIsCreated"></el-input>
                </el-form-item>
                <el-form-item label="请求方式">
                    <el-select v-model="pathForm.method" placeholder="请选择请求方式" :disabled="!pathIsCreated">
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="GET" value="GET"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="pathIsCreated=!pathIsCreated">取 消</el-button>
                <el-button type="primary" @click="savePath()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getAllMenus, getPathByMenuId} from '../../api/auth'
    import {saveMenus, savePath} from '../../api/menus'

    export default {
        name: "MenuManage",
        data() {
            return {
                title: '路径',
                menuIsCreated: false,
                menuIsEdited: false,
                isDelete: false,
                pathIsCreated: false,
                allMenus: [],//系统内的所有菜单
                pathByMenuId: [],//
                //菜单form
                menuFrom: {
                    id: 0,
                    parentMenuId: '根节点',
                    cname: "",
                    ename: "",
                    icon: "",
                    value: "",
                    discription: "",
                    type: "",
                    sort: 2,
                },
                //请求路径form
                pathForm: {
                    name: '',
                    url: '',
                    method: '',
                    menuId: ''
                },
                //请求路径表格渲染
                defaultProps: {
                    children: 'childs',
                    label: 'cname'
                },
            }
        },
        watch: {
            'menuFrom': {
                handler: function () {
                    //菜单选中 刷新请求路径
                    this.refreshPath();
                }
            }
        },
        methods: {
            refreshPath() {
                let self = this;
                if (typeof (self.menuFrom.id) != 'undefined' && self.menuFrom.id != 0) {
                    getPathByMenuId(self.menuFrom.id).then(
                        r => {
                            if (r.rel) {
                                self.pathByMenuId = r.data;
                            }
                        }
                    ).catch()
                }
            },
            findAllMenus() {
                getAllMenus().then(r => {
                    if (r.rel) {
                        this.allMenus = r.data;
                    }
                }).catch()
            },
            menuTreeNodeClick(node) {
                //查看右侧页面是否在新增 或者编辑
                if (!this.menuIsCreated && !this.menuIsEdited) {
                    if (node.cname != '首页') {
                        this.menuFrom = node
                    }
                } else {
                    this.$message({
                        message: '当前数据正在编辑中,请保存或取消当前操作',
                        type: 'warning'
                    });
                }

            },
            createMenu() {
                this.menuFrom = {};
                this.menuIsCreated = true;
            },
            editMenu() {
                this.menuIsEdited = true;
            },
            deleteMenu() {

            },
            cancel() {
                this.menuFrom = {};
                this.menuIsEdited = false;
                this.menuIsCreated = false;
            },
            save() {
                saveMenus(this.menuFrom).then(r => {
                    if (r.rel) {
                        this.findAllMenus();
                        this.menuFrom = {};
                        this.menuIsEdited = false;
                        this.menuIsCreated = false;
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                }).catch()
            },
            editRole(param) {
                this.pathForm = param;
                this.pathIsCreated = true;
            },
            savePath() {
                savePath(this.pathForm).then(r => {
                    if (r.rel) {
                        //保存路径之后修正状态
                        this.pathIsCreated = !this.pathIsCreated;
                        //重新请求路径
                        this.refreshPath();
                    }
                }).catch()
            },
            cancelPath() {
                this.pathIsCreated = false;
            }
        },
        mounted() {
            this.findAllMenus();
        }
    }
</script>

<style lang="scss">

    .el-table {
        background-color: rgb(245, 245, 245);
    }
    .el-table__header{
        background-color: rgb(245, 245, 245);
    }

    .menuManageBox {
        margin: 15px 15px;
        padding: 15px 15px;
        border-radius: 10px;
    }

    .menuInfo {
        background: lightgray;
    }
</style>
