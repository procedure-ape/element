<template>
    <div class="topbar">
        <div class="searchbar">
            
        </div>
        <ul class="topbarMenu">
            <li>
                <el-dropdown trigger="click" placement="bottom-start" divided="true">
                    <div class="el-dropedown-link">
                        &emsp;
                        <i class="fa fa-user-o"></i>
                        {{ user }}
                        &emsp;
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <!-- <el-dropdown-item>
                            <i class="fa fa-cogs"></i>
                            设置
                        </el-dropdown-item> -->
                        <el-dropdown-item @click.native="quit()">
                            <i class="fa fa-sign-out"></i>
                            退出
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'topbar',
    data(){
        return {
            user: 'admin'
        }
    },
    mounted: function(){
        this.user = sessionStorage.getItem('userstate')
    },
    methods: {
        quit(){
            sessionStorage.clear()
            this.$router.push('/login')
        }
    }
}
</script>

<style scoped>
    .topbar{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 0 25px;
        background-color: #f3f3f4;
        border-bottom: 1px solid #e7eaec!important;
        height: 51px;
        min-height: 51px;
    }
    .searchbar{
        flex-grow: 1;
    }
    .search{
        background-color: transparent;
        height: 55px;
        width: 300px;
        list-style: none;
        outline: none;
        border: none;
        font-size: 14px;
    }
    .el-dropedown-link{
        height: 50px;
    }
    .topbarMenu{
        margin: 0;
        height: 100%;
    }
    .topbarMenu li{
        display: inline-block;
        cursor: pointer;
        color: #999c9e;
        height: 100%;
        line-height: 50px;
        min-width: 40px;
        text-align: center;
    }
    .topbarMenu li:hover{
        background-color: #eee;
    }
</style>
