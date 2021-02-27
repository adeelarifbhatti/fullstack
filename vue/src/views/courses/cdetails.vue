<template>
<div v-if="course">
  <h1>Course Details</h1>
  <p> Course ID {{course.id}}  </p>
    <p> Course fee {{course.fee}}  </p>
    <p> Course level {{course.level}}  </p>
  <p> Course description {{course.description}}  </p>
</div>

</template>

<script>
export default {
    props: ['id'],
    data() {
        return {
            course: null
        }
    },
    mounted() {
        fetch('http://localhost:82/api/v1/courses/' +this.id ,{'method': 'get',
        headers: {
            'content-type': 'application/json'
         }
        })
        .then(res => res.json())
        .then(res => this.course = res.data.data)
        .then(adeel => {console.log(adeel);})
        .catch(err => console.log(err.message))
    }

}
</script>

<style>

</style>