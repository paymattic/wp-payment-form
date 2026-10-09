<template>
    <div class="wpf-image-radio-btn">
        <label class="radio-img" v-for="(data, index) in btnData" :key="index">
            <input @change="triggerModel()" type="radio" name="layout" :value="data.value" v-model="model" />
            <div class="image">
                <img :src="getImageSrc(data)" alt="image" />
                <img class="active-icon" :src="activeIcon" alt="active" />
            </div>
        </label>
    </div>
</template>
<script>
export default {
    name: "ImageRadioBtn",
    props: ["btnData", "value"],
    data() {
        return {
            model: "",
            activeIcon: window.wpPayFormsAdmin.asset_url + 'images/form/tabular_choose.svg',
        }
    },
    methods: {
        triggerModel() {
            this.$emit('updateModal', this.model);
        },
        getImageSrc(data) {
            return window.wpPayFormsAdmin.asset_url + "images/leaderboard/template_" + data?.value + ".svg";
        }
    },
    mounted() {
        console.log(this.value)
        this.model = this.value;
    }
}
</script>

<style scoped lang="scss">
.wpf-image-radio-btn {

    $image-bg: gray;
    $image-border: white;
    $image-border-current: aqua;

    .image {
        opacity: 0.8;
        width: 200px;
        height: 160px;
        background-position: center center;
        display: inline-block;
        margin: 10px;
        border-radius: 10px;
        padding: 8px 16px;
        position: relative;
        .active-icon {
            position: absolute;
            top: 0;
            right: 0;
            display: none;
        }

        &:hover {
            opacity: 1;
        }
    }

    .radio-img {
        >input {
            display: none;
        }

        >.image {
            cursor: pointer;
            border: 1px solid #D6DAE1;

        }

        >input:checked+.image {
            border: 2px solid #F98435;
            .active-icon {
                display: block;
            }
        }

    }
}
</style>