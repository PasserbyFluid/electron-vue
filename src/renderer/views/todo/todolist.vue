<template>
    <div class="block">
        <el-card class="box-card">
            <el-input v-model="todoName" placeholder="任务内容" style="width: 50%;" class="filter-item"  />
            <el-date-picker
                v-model="todoTime"
                align="right"
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                >
            </el-date-picker>
            <el-button  type="primary" @click="addTodo">
                添加
            </el-button>
        </el-card>
        <el-card class="box-card">
            <!-- <el-steps direction="vertical" :active="1">
                <el-step :title="activity.content"  :description="activity.timestamp" v-for="(activity, index) in activities" :key="index">
                    <div style="display:inline-block;margin-left:20px;">
                        <el-button  class="button-new-tag" size="mini" @click="del(index,activity)">删除</el-button>
                        <el-button type="primary"  class="button-new-tag" size="mini" @click="did(activity)">已完成</el-button>
                    </div>
                </el-step>
            </el-steps> -->
            <!-- <el-timeline>
                <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :icon="activity.icon"
                :type="activity.type"
                :color="activity.color"
                :size="activity.size"
                :class="{'did':activity.status == '1'}"
                :timestamp="activity.timestamp">
                {{activity.content}}
                    
                <div style="display:inline-block;margin-left:20px;">
                    <el-button  class="button-new-tag" size="mini" @click="del(index,activity)">删除</el-button>
                    <el-button type="primary"  class="button-new-tag" size="mini" @click="did(activity)">已完成</el-button>
                </div>
                </el-timeline-item>
            </el-timeline> -->
            <timeline timeline-theme="black" timeline-bg="#3a3939">
                <!-- <timeline-title font-color="#fff">2018</timeline-title>
                <timeline-item bg-color="#9dd8e0" font-color="#e166ab">Welcome to the new year!</timeline-item>
                <timeline-item :hollow="true" font-color="#fff">My first 100 stars on Github 🎉</timeline-item>
                <timeline-item bg-color="#b0e6d1" font-color="#fff">keep going</timeline-item>
                <timeline-title bg-color="#f2d7e1" font-color="#fff">2017</timeline-title>
                <timeline-item bg-color="#b0e6d1" font-color="#fff" icon-size="small">icon small size</timeline-item>
                <timeline-item bg-color="#b0e6d1" font-color="#fff" icon-size="medium">icon medium size</timeline-item>
                <timeline-item bg-color="#b0e6d1" font-color="#fff" icon-size="large">icon large size</timeline-item> -->
                <timeline-item :class="{'did':activity.status == '1'}" :bg-color="activity.color" :font-color="activity.color" v-for="(activity, index) in activities" :key="index">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <p class="append">{{activity.content}}</p>
                            <p class="append">{{activity.timestamp}}</p>
                        </el-col>
                        <el-col :span="6">
                            <el-button  class="button-new-tag" size="mini" @click="del(index,activity)">删除</el-button>
                            <el-button type="primary"  class="button-new-tag" size="mini" @click="did(activity)">已完成</el-button>
                        </el-col>
                    </el-row>
                </timeline-item>
                <!-- <timeline-item line-color="#a6ade4">
                    <p style="color: #fff;">And <a href="https://github.com/luyilin/Maltose">Maltose</a></p>
                    <p style="color: #fff;" class="append">A cute emoticon and emoji keyboard which can generate random emoticon or emoji and no xss.</p>
                </timeline-item> -->
            </timeline>
            <p style="text-align:center;" v-if="activities.length == 0">暂无待办事项</p>
        </el-card>
    </div>

</template>

<script>
import { getToken} from '@/utils/auth'
import { Timeline, TimelineItem, TimelineTitle } from 'vue-cute-timeline'
  export default {
    components: {
        Timeline,
        TimelineItem,
        TimelineTitle
    },
    data() {
      return {
        activities: [],
        // isdid:false,
        todoName:'',
        todoTime:new Date(),
        inputVisible: false,
        inputValue: '',
        dynamicTags:[['ddd']]
      };
    },
    mounted(){
        this.getList()
    },
    methods:{
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
            // this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        did(item){
            if (item.status == '0') {
                this.$http({
                    url: '/login/todo/updateStatus',
                    method: 'post',
                    data:{
                        uid:getToken(),
                        id:item.id,
                    }
                }).then((res) => {
                    this.getList()
                })
            }
        },
        del(i,item){
            this.activities.splice(i,1);
            this.$http({
                url: '/login/todo/deltodo',
                method: 'post',
                data:{
                    uid:getToken(),
                    id:item.id
                }
            }).then((res) => {
                // console.log(res)
            })
        },
        leInputConfirm(i) {
            let inputValue = this.inputValue;
            if (inputValue) {
               if (!this.dynamicTags[i]) {
                   this.dynamicTags[i] = []
            this.dynamicTags[i].push(inputValue);
               }
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        addTodo(){
            if (this.todoName == '') {
                this.$message.warning('请输入待办事项名称')
                return
            }else{
                let obj = {
                    content: this.todoName,
                    timestamp: new Date(this.todoTime).format('yyyy-MM-dd hh:mm:ss'),
                    isdid:false,
                    uid:getToken()
                }
                this.$http({
                    url: '/login/todo/addtodo',
                    method: 'post',
                    data:obj
                }).then((res) => {
                    // console.log(res)
                    if (res.code == 1) {
                        this.getList()
                        this.$message.success('添加成功')
                    }
                })
                this.todoName = '';
            }
            
        },
        getList(){
            this.$http({
                url: '/login/todo/getTodoList',
                method: 'post',
                data:{
                    uid:getToken(),
                    page:1,
                    pageSize:10
                }
            }).then((res) => {
                this.activities = res.list
                // console.log(res)
                this.$store.dispatch('setList',res.list)
            })
        },
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },

    }
  };
</script>

<style>
.did,.did .el-timeline-item__timestamp,.did .el-timeline-item__content{
    text-decoration: line-through;
    color:#409EFF
}
 .append {
    font-size: .8em;
    margin-top: 3px;
    color: #646C7C;
  }
  a {
    color: #bf6dcf;
    font-weight: bold;
    text-decoration: none;
  }
  .icon-heart {
    width: 20px;
  }
  .demo {
    display: grid;
    grid-template-columns: repeat(2, 50%);
    grid-gap: 1rem;
  }
  .demo-theme.dark {
    background: #3a3939;
  }
  .timeline-item{
      padding: 0
  }
  .github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}
</style>
