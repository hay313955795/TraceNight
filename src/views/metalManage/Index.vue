<template>
    <div>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="saveProduct()">系列新增</el-button>
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" closable @tab-remove="tabRemove">
            <el-tab-pane v-for="metalType in allMetalType " :key="metalType.id" :label="metalType.typeName"
                         :name="metalType.typeName" :id="metalType.id">
                <ToolBar>
                    <el-button type="primary" icon="el-icon-plus" size="small" @click="createProduct()">添加</el-button>
                    <div style="float: right">
                        <el-input
                                placeholder="请输入产品名称！"
                                size="small"
                                style="width: 140px"
                                v-model="allMetalProduct.search"
                                @clear="searchProduct"
                                clearable>
                        </el-input>
                        <el-button @click="searchProduct" type="success" icon="el-icon-search" size="small"></el-button>
                    </div>
                </ToolBar>
                <el-table
                        :data="allMetalProduct.data"
                        border
                        ref="table"
                        style="width: 100%">
                    <el-table-column
                            align="center"
                            width="200px"
                            prop="productName"
                            label="产品名称">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="269px"
                            prop="productImg"
                            label="产品图示">
                        <template scope="scope">
                            <img :src="scope.row.productImg" width="200" height="200" class="head_pic"/>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="100px"
                            prop="productSingleWeight"
                            label="单重">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="100px"
                            prop="productTotalWeight"
                            label="总重">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="100px"
                            prop="productTotalWeight"
                            label="单价">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            width="100px"
                            prop="productPrice"
                            label="产品价格">
                    </el-table-column>

                    <el-table-column
                            align="center"
                            label="操作"
                            width="776">
                        <template slot-scope="scope">

                            <el-button @click="editProduct(scope.row)" type="primary" title="编辑" icon="el-icon-edit"
                                       size="small"
                                       circle></el-button>
                            <el-button @click="deleteProduct(scope.row.id)" title="删除" icon="el-icon-delete"
                                       type="danger"
                                       circle size="small"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="allMetalProduct.current_page"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="allMetalProduct.page_size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="allMetalProduct.total">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="title" :visible.sync="productEditShow">
            <el-form :model="productInfo"  ref="productInfo" label-width="100px">
                <el-form-item label="昵称" prop="productType">
                    <el-input v-model="productInfo.productType" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="账户" prop="productName">
                    <el-input v-model="productInfo.productName" placeholder="请输入账户"></el-input>
                </el-form-item>
                <el-form-item label="密码"  placeholder="请输入密码" prop="password">
                    <el-input type="password" v-model="productInfo.productImg"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="password" v-model="productInfo.productSingleWeight"></el-input>
                </el-form-item>
                <el-form-item label="帐号状态">
                    <el-switch v-model="productInfo.productTotalWeight"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel('productInfo')">取 消</el-button>
                <el-button type="primary" @click="save()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import ToolBar from '@/components/ToolBar.vue';
    import {getAllMetalType, getAllMetalProductByTypeIdAndSearch, deleteProductById} from '../../api/metal'

    export default {
        name: "Index",
        data() {
            return {
                productEditShow:false,
                isCreate:false,
                allMetalType: [],
                activeName: 'first',
                acriveId: 0,
                allMetalProduct: {
                    search: "",
                    current_page: 1,
                    page_size: 10,
                    total: 0,
                    data: []
                },
                productInfo:{
                    id:0,
                    productType:0,
                    productName:'',
                    productImg:'',
                    productSingleWeight:'',
                    productTotalWeight:'',
                    productUnit:'',
                    productPrice:''
                }
            };
        },
        watch: {
            'acriveId': {
                handler: function () {
                    this.getProduct();
                }
            }
        },
        methods: {
            save(){
                console.log(this.productInfo);
                this.productEditShow = !this.productEditShow;},
            createProduct(){
                this.productEditShow = !this.productEditShow;
                this.productInfo = {}
            },
            cancel(){
                this.productEditShow = !this.productEditShow;
                this.productInfo = {}
            },
            editProduct(row){
                this.productEditShow = !this.productEditShow;
                this.productInfo = row;
            },
            deleteProduct(id) {
                this.$confirm('此操作将永久删除该产品数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteProductById(id).then(r=>{
                        console.log(id);
                        if (r.rel){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            this.$message({
                                type: 'warring',
                                message: r.message
                            });
                        }
                        this.getProduct();
                    }).catch();

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            tabRemove(targetName) {
                if (targetName != this.activeName) {
                    return;
                }
                //删除当前页签
                console.log(targetName)
            },
            handleSizeChange(size) {
                this.allMetalProduct.page_size = size;
                this.getProduct();
            },
            handleCurrentChange(page) {
                this.allMetalProduct.current_page = page;
                this.getProduct();
            },
            saveProduct() {
            },
            searchProduct() {
                this.getProduct();
            },
            handleClick(tab) {
                this.acriveId = this.allMetalType[tab.index].id
            },
            getProduct() {
                let param = this.acriveId + "?search=" + this.allMetalProduct.search + "&page=" + this.allMetalProduct.current_page + "&limit=" + this.allMetalProduct.page_size;
                getAllMetalProductByTypeIdAndSearch(param).then(r => {
                    if (r.rel) {
                        this.allMetalProduct.total = r.data.data.total;
                        this.allMetalProduct.data = r.data.data.rows;
                    }
                }).catch()
            }
        },
        mounted() {
            getAllMetalType().then(r => {
                if (r.rel) {
                    this.allMetalType = r.data;
                    this.activeName = this.allMetalType.length > 0 ? this.allMetalType[0].typeName : '';
                    this.acriveId = this.allMetalType.length > 0 ? this.allMetalType[0].id : 0;
                }
            }).catch()
        },
        components: {
            ToolBar
        }
    }
</script>

<style scoped>

</style>
