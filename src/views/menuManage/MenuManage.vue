<template>
    <div class="menuManageBox">
        <el-row>
            <el-button type="success" @click="newMenu">新增</el-button>
            <el-button type="success" @click="editMenu">编辑</el-button>
            <el-button type="success">删除</el-button>
        </el-row>
        <br/>
        <el-row>
            <el-col :span="6">
                <el-tree :data="allMenus" :props="defaultProps"
                         @node-click="handleNodeClick"
                         style="  background-color:#F5F5F5; border:#fff1ea;border-radius: 10px;margin-right: 15px ;box-shadow:0 0 5px #000 inset;"
                ></el-tree>
            </el-col>
            <el-col :span="18">
                <div style=" background-color:#F5F5F5; border:#fff1ea;padding: 15px 15px;border-radius: 10px;box-shadow:0 0 10px #000 inset;">
                    <el-tag type="success" v-if="isNew">菜单新增中</el-tag>
                    <el-tag type="success" v-if="isEdit">菜单编辑中</el-tag>
                    <el-form ref="form" :model="form" label-width="100px">
                        <!--如果是新增则选择父节点-->
                        <el-form-item label="父节点Id">
                            <el-select v-model="form.parentMenuId" placeholder="请选择菜单类型" :disabled="!isNew&&!isEdit">
                                <el-option label="根节点" value="0"></el-option>
                                <el-option :label="menus.cname" :value="menus.id" v-for="menus in allMenus"
                                           v-if="menus.cname!='首页'"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-row :span="14">
                            <el-col :span="6">
                                <el-form-item label="菜单名称">
                                    <el-input v-model="form.cname" style="width: 200px"
                                              :disabled="!isNew&&!isEdit"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="菜单代码">
                                    <el-input v-model="form.ename" :disabled="!isNew&&!isEdit"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="菜单图标">
                            <el-input v-model="form.icon" :disabled="!isNew&&!isEdit"></el-input>
                        </el-form-item>
                        <el-row :span="14">
                            <el-col :span="8">
                                <el-form-item label="前端地址">
                                    <el-input v-model="form.value" style="width: 300px"
                                              :disabled="!isNew&&!isEdit"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="菜单类型">
                                    <el-select v-model="form.type" placeholder="请选择菜单类型" :disabled="!isNew&&!isEdit">
                                        <el-option label="菜单" value="NONE"></el-option>
                                        <el-option label="按钮" value="LINK"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="菜单排序">
                            <el-input-number v-model="form.sort" :min="2" :max="1000" :disabled="!isNew&&!isEdit"
                                             label="计数器max=10,min=2"></el-input-number>
                        </el-form-item>
                        <el-form-item label="菜单说明">
                            <el-input type="textarea" v-model="form.discription" :disabled="!isNew&&!isEdit"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-button type="success" @click="save">保存</el-button>
                    <el-button type="success" @click="cancel">取消</el-button>
                </div>
                <br><br>
                <el-row style=" background-color:#F5F5F5; border:#fff1ea;padding: 15px 15px;border-radius: 10px;box-shadow:0 0 10px #000 inset;">
                    <el-button type="success" @click="isNewPath = !isNewPath ; pathForm.menuId = form.id" v-if=" typeof (form.id) != 'undefined'&&form.id !=0">新增</el-button>
                    <br><br>
                    <el-table
                            ref="multipleTable"
                            border
                            :data="allPath"
                            tooltip-effect="dark"
                            style="width: 100%">
                        <!--@selection-change="handleSelectionChange">-->
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


        <el-dialog :title="title" :visible.sync="isNewPath">
            <h3>正在为<<{{form.cname}}>>菜单编辑请求路径</h3>
            <el-form ref="pathForm" :model="pathForm" label-width="100px">
                <el-form-item label="路径名称">
                    <el-input v-model="pathForm.name" :disabled="!isNewPath"></el-input>
                </el-form-item>
                <el-form-item label="请求地址">
                    <el-input v-model="pathForm.url" :disabled="!isNewPath"></el-input>
                </el-form-item>
                <el-form-item label="请求方式">
                    <el-select v-model="pathForm.method" placeholder="请选择请求方式" :disabled="!isNewPath">
                        <el-option label="POST" value="POST"></el-option>
                        <el-option label="GET" value="GET"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isNewPath=!isNewPath">取 消</el-button>
                <el-button type="primary" @click="savePath()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getAllMenus, getPathByMenuId} from '../../api/auth'
    import {saveMenus,savePath} from '../../api/menus'

    export default {
        name: "MenuManage",
        data() {
            return {
                title: '路径',
                isNew: false,
                isEdit: false,
                isDelete: false,
                isNewPath: false,
                allMenus: [],
                allPath: [],
                defaultProps: {
                    children: 'childs',
                    label: 'cname'
                },
                form: {
                    id:0,
                    parentMenuId: '根节点',
                    cname: "",
                    ename: "",
                    icon: "",
                    value: "",
                    discription: "",
                    type: "",
                    sort: 2,
                },
                pathForm: {
                    name: '',
                    url: '',
                    method: '',
                    menuId:''
                }
            }
        },
        watch: {
            'form': {
                handler: function () {
                    let self = this;
                    if (typeof (self.form.id) != 'undefined' && self.form.id != 0) {
                        getPathByMenuId(self.form.id).then(
                            r => {
                                if (r.rel) {
                                    self.allPath = r.data;
                                }
                            }
                        ).catch()
                    }
                }
            }
        },
        methods: {
            findAllMenus() {
                getAllMenus().then(r => {
                    if (r.rel) {
                        this.allMenus = r.data;
                    }
                }).catch()
            },
            handleNodeClick(node) {
                //查看右侧页面是否在新增 或者编辑
                if (!this.isNew && !this.isEdit) {
                    if (node.cname != '首页') {
                        this.form = node
                    }
                } else {
                    this.$message({
                        message: '当前数据正在编辑中,请保存或取消当前操作',
                        type: 'warning'
                    });
                }

            },
            newMenu() {
                this.form = {};
                this.isNew = true;
            },
            editMenu() {
                this.isEdit = true;
            },
            cancel() {
                this.form = {};
                this.isEdit = false;
                this.isNew = false;
            },
            save() {
                saveMenus(this.form).then(r => {
                    if (r.rel) {
                        this.findAllMenus();
                        this.form = {};
                        this.isEdit = false;
                        this.isNew = false;
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    }
                }).catch()
            },
            editRole(param) {
                this.pathForm = param;
                this.isNewPath = true;
            },
            savePath() {
                savePath(this.pathForm).then(r=>{
                    getPathByMenuId(this.form.id).then(
                        r => {
                            if (r.rel) {
                                this.isNewPath=!this.isNewPath
                                self.allPath = r.data;
                            }
                        }
                    ).catch()
                }).catch()
            },
            cancelPath() {
                this.isNewPath = false;
            }
        },
        mounted() {
            this.findAllMenus();
        }
    }
</script>

<style lang="scss">

    .menuManageBox {
        background: white;
        margin: 15px 15px;
        padding: 15px 15px;
        border: 2px solid white;
        border-radius: 10px;
    }

    .menuInfo {
        background: lightgray;
    }
</style>
