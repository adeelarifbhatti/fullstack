<template>

    <h1> Courses </h1>
    <div v-for="course in courses" :key="course.id" class=job> 
        <router-link :to="{ name: 'cdetails',params: {id: course.id}}">
        {{course.name}}        
        </router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            courses: []
        }
    },
    mounted() {
        fetch('http://localhost:82/api/v1/courses',{'method': 'get',
        headers: {
            'content-type': 'application/json'
         }
        })
        .then(res => res.json())
        .then(res => this.courses = res.data.data)
        // to display the response
        .then(adeel => {console.log(adeel);})
        .catch(err => console.log(err.message))
    }

}
</script>

<style>
.job {

    background: grey;
    padding: 10px;
    margin: 20px auto;
    max-width: 300px;
    cursor: pointer;
    border-radius: 20px;
}
.job:hover {
    background: rgb(145, 145, 160);
}

</style>