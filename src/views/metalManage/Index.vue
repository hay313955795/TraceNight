<template>
    <div>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="createType()">系列编辑</el-button>
        <br>
        <el-tag
                v-if="typeEditShow"
                v-for="type in allMetalType"
                :key="type.id"
                closable
                @click="tagClick(type)"
                @close="tagClose(type)"
                type="">
            {{type.typeName}}
        </el-tag>
        <el-button v-if="typeEditShow" @click="typeEdit = !typeEdit;typeInfo.id=0;typeInfo.typeName=''" type="primary"
                   title="编辑" icon="el-icon-plus"
                   size="small"
                   circle></el-button>
        <br>
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabChange">
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
                                @clear="getProduct"
                                clearable>
                        </el-input>
                        <el-button @click="getProduct" type="success" icon="el-icon-search" size="small"></el-button>
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
                        @size-change="sizeChange"
                        @current-change="pageChange"
                        :current-page="allMetalProduct.current_page"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="allMetalProduct.page_size"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="allMetalProduct.total">
                </el-pagination>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="title" :visible.sync="productEditShow">
            <el-form :model="productInfo" ref="productInfo" label-width="100px">
                <el-form-item label="产品类型" prop="productType" v-if="isProductCreate">
                    <el-select v-model="productInfo.productTypeName" disabled placeholder="请选择">
                        <el-option
                                v-for="type in allMetalType"
                                :key="type.id"
                                :label="type.typeName"
                                :value="type.typeName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-row :span="14">
                    <el-form-item label="产品名称" prop="productName">
                        <el-input v-model="productInfo.productName" style="width: 200px"></el-input>
                    </el-form-item>
                </el-row>
                <el-row :span="14">
                    <el-col :span="6">
                        <el-form-item label="单产品重量:">
                            <el-input v-model="productInfo.productSingleWeight"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="单包产品重量:">
                            <el-input v-model="productInfo.productTotalWeight"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="计价单位">
                            <el-input v-model="productInfo.productUnit"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="产品价格">
                            <el-input v-model="productInfo.productPrice"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-form-item label="产品图片" prop="productImg">
                    <img :src="productInfo.productImg" width="200" height="200"/>
                    <el-upload
                            ref="upload"
                            name="img"
                            class="upload-demo"
                            :action="url+'/admin/img/upload'"
                            :on-success="imgUploadSuccess"
                            :headers=headers
                            multiple
                            :show-file-list="false"
                            :limit="1"
                    >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelProductEdit()">取 消</el-button>
                <el-button type="primary" @click="saveProduct()">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="title" :visible.sync="typeEdit">
            <el-form :model="productInfo" ref="productInfo" label-width="100px">
                <el-row :span="14">
                    <el-form-item label="类型名称" prop="productName">
                        <el-input v-model="typeInfo.typeName" style="width: 200px"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelTypeEdit()">取 消</el-button>
                <el-button type="primary" @click="saveType()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getToken} from '../../utils/dataStorage.js'
    import config from '../../config/app'
    import ToolBar from '@/components/ToolBar.vue';
    import {getAllMetalType, getAllMetalProductByTypeIdAndSearch, deleteProductById, saveProduct} from '../../api/metal'

    export default {
        name: "Index",
        data() {
            return {
                headers: {
                    Authorization: getToken()
                },
                imgShow: false,
                url: config.apiUrl,
                productEditShow: false,
                typeEditShow: false,
                typeEdit: false,
                isProductCreate: false,
                isProductEdit: false,
                activeName: 'first',
                activeId: 0,
                activeType: {},
                allMetalType: [],
                allMetalProduct: {
                    search: "",
                    current_page: 1,
                    page_size: 10,
                    total: 0,
                    data: []
                },
                productInfo: {
                    id: 0,
                    productType: 0,
                    productTypeName: '',
                    productName: '',
                    productImg: '',
                    productSingleWeight: '',
                    productTotalWeight: '',
                    productUnit: '',
                    productPrice: ''
                },
                typeInfo: {
                    id: 0,
                    typeName: ''
                }
            };
        },
        watch: {
            'activeId': {
                handler: function () {
                    this.getProduct();
                }
            }
        },
        methods: {

            imgUploadSuccess(response) {
                if (response.rel) {
                    console.log("上传成功");
                    console.log(response);
                    this.productInfo.productImg = response.data;
                    this.$refs.upload.clearFiles();
                }
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //新增产品 修改显示标志
            createProduct() {
                this.isProductCreate = true;
                this.productEditShow = !this.productEditShow;
                this.productInfo = {
                    id: 0,
                    productType: this.activeType.id,
                    productTypeName: this.activeType.typeName,
                    productName: '',
                    productImg: "http://iph.href.lu/200x200?text=%E7%AD%89%E5%BE%85%E4%B8%8A%E4%BC%A0",
                    productSingleWeight: '',
                    productTotalWeight: '',
                    productUnit: '',
                    productPrice: ''
                };

            },
            //编辑产品 修改显示标志
            editProduct(row) {
                this.isProductEdit = true;
                this.productEditShow = !this.productEditShow;
                this.productInfo = row;
            },
            //取消产品的新增或编辑 修改显示标志
            cancelProductEdit() {
                this.isProductEdit = false;
                this.isProductCreate = false;
                this.productEditShow = !this.productEditShow;
                this.productInfo = {
                    id: 0,
                    productType: this.activeType.id,
                    productTypeName: this.activeType.typeName,
                    productName: '',
                    productImg: "http://iph.href.lu/200x200?text=%E7%AD%89%E5%BE%85%E4%B8%8A%E4%BC%A0",
                    productSingleWeight: '',
                    productTotalWeight: '',
                    productUnit: '',
                    productPrice: ''
                };
                this.getProduct();
            },
            //保存产品信息
            saveProduct() {
                console.log(this.productInfo);
                this.productEditShow = !this.productEditShow;
                saveProduct(this.productInfo).then(r => {
                    if (r.rel) {
                        this.getProduct();
                    }
                }).catch()
            },
            deleteProduct(id) {
                this.$confirm('此操作将永久删除该产品数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteProductById(id).then(r => {
                        console.log(id);
                        if (r.rel) {
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
            //下面是类型的接口管理
            //页签点击了删除按钮
            tagClick(tag) {
                //修改大类信息
                this.typeInfo = tag;
                this.typeEdit = !this.typeEdit;
            },
            tagClose(tag) {
                //删除大类
                this.$confirm('此操作将永久删除该类型数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log("确认")
                }).catch(() => {
                    console.log("取消")
                });
                console.log(tag)
            },
            createType() {
                this.typeEditShow = !this.typeEditShow;
            },
            cancelTypeEdit() {
                this.typeEdit = !this.typeEdit;
            },
            saveType() {
            },
            tabRemove(targetName) {
                if (targetName != this.activeName) {
                    //当页签选中时才允许进行下一步操作
                    this.$message({
                        showClose: true,
                        message: '当前页签未选中,无法进行下一步操作',
                        type: 'warning'
                    });
                    return;
                }
                //删除当前页签
                console.log(targetName)
            },
            //分页标签的页面显示数量变化
            sizeChange(size) {
                this.allMetalProduct.page_size = size;
                this.getProduct();
            },
            //分页标签显示页码发生变化
            pageChange(page) {
                this.allMetalProduct.current_page = page;
                this.getProduct();
            },

            //当页签点击变化的时候
            tabChange(tab) {
                this.activeId = this.allMetalType[tab.index].id;
                this.activeType = this.allMetalType[tab.index];
            },
            //根据类型获取产品数据
            getProduct() {
                let param = this.activeId + "?search=" + this.allMetalProduct.search + "&page=" + this.allMetalProduct.current_page + "&limit=" + this.allMetalProduct.page_size;
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
                    this.activeId = this.allMetalType.length > 0 ? this.allMetalType[0].id : 0;
                    this.activeType = this.allMetalType.length > 0 ? this.allMetalType[0] : false;
                }
            }).catch()
        },
        components: {
            ToolBar
        }
    }
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
