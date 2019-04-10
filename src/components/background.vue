<template>
    <div id="background">
        <div class="left_top">
            <span class="left_top_content">
                禾苗云科技
            </span>
            <div class="left_top_back">
                SPROCOMM
            </div>
        </div>
        <div class="back_block">

        </div>
        <div class="bottom_content">
            Cloud Technology
        </div>
        <div class="number_back">
            098
        </div>
    </div>
</template>

<script>
export default {
    name: 'background'
}
</script>

<style scoped>
    #background{
        background-color: #232a3d;
        overflow: hidden;
        position: fixed;
        top: -1px;
        bottom: -1px;
        left: -1px;
        right: -1px;
        z-index: -1;
    }
    .left_top{
        padding-left: 80px;
        padding-top: 40px;
        position: absolute;
    }
    .left_top_content{
        left: 120px;
        top: 80px;
        position: absolute;
        color: #fff;
        width: 200px;
        font-size: 40px;
        border-bottom: solid 20px #2eea9d;
    }
    .left_top_back{
        font-size: 120px;
        position: absolute;
        color: #3a4154;
        z-index: -1;
    }
    .number_back{
        font-size: 800px;
        position: absolute;
        bottom: -500px;
        color: #293146;
        z-index: -1;
        left: -300px;
    }
    .back_block{
        border: solid 200px #2eea9d;
        width: 200px;
        height: 200px;
        border-radius: 1000px;
        position: absolute;
        bottom: -300px;
        right: -300px;
        z-index: -1;
    }
    .bottom_content{
        color: #fff;
        font-size: 60px;
        position: absolute;
        bottom: 80px;
        right: 100px;
    }
</style>
