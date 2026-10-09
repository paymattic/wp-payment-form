<template>
    <div class="wpf_empty_text">
        <img :src="getAssetUrl()" alt="" :style="{ width: imageSize + 'px' }"/>
        <p>{{ text }}</p>
    </div>
</template>

<script>
export default {
    props: ['src', 'text', 'image-size'],

    methods: {
        getAssetUrl() {
            return `${window.wpPayFormsAdmin.assets_url}${this.src}`;
        },
    },
}
</script>

<style>
.wpf_empty_text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 60vh;
}
</style>
