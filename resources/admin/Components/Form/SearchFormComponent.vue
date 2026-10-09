<template>
    <div style="display: flex">
        <el-aside
            width="100%"
            class="wpf_editor_fields_wrapper"
            id="wpf_editor_fields_wrapper"
        >
            <div v-if="!hideSearchBar" class="wpf_editor_field_search">
                <el-input size="large"
                    ref="searchInput"
                    @input="searchComponent"
                    placeholder="Search (name, email..)"
                    v-model="search"
                    clearable
                >
                    <i slot="suffix" v-if="!search.length > 0" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
            <div class="wpf_scrollable_elem" style="padding: 0px !important;">
                <div v-if="checkElementsLength(fieldGroups) === 0" style="text-align:center; padding: 150px;">
                    <h1><i style="font-size: 18px; color: #FF7518" class="el-icon-info">
                        {{ $t('Field Not Found') }}
                    </i></h1>
                </div>
                <el-collapse v-model="activeNames" v-else v-for="(componentGroup,componentGroupIndex) in fieldGroups "
                    :key="componentGroupIndex"
                    v-show="fieldGroups[componentGroupIndex].elements.length"
                    :class="isActiveGroup(componentGroupIndex)"
                    @change="handleChange(componentGroup.title)">
                    <el-collapse-item :name="componentGroup.title">  
                        <template #title>  
                            <div class="title-content"> 
                                <img :src="assetsUrl(componentGroup.icon)" alt="">  
                                <span>{{ componentGroup.title }}</span>  
                            </div>  
                        </template>  
                    <div style="min-height: 50px"
                        element-loading-spinner="el-icon-loading" v-loading="fetching">
                        <draggable v-model="fieldGroups[componentGroupIndex].elements"
                            class="dragArea" :clone="cloneItem"
                            :options="{ draggable:'.item_active', group:{ name:'components',  pull:'clone', put:false }, sort: false }">
                            <el-button
                                v-for="(component,componentIndex) in componentGroup.elements"
                                :key="'item_'+componentIndex" size="mini"
                                :data-item_name="component.type" type="plain"
                                class="wpf_element_items"
                                :class="getItemClasses(component)"
                                @click="handleClick(component)"
                                :style="dynamicStyleRender(component)"
                            >
                                <img :src="renderIcons(component)" alt="">
                                <span class="field_title">{{ component.editor_title
                                }}</span>
                                <span v-if="component.is_pro == 'yes' && has_pro === ''" style="position:absolute; right: 10px; color: #ffbb64; font-size: 18px;">
                                   <Icon icon="wpf-pro-icon" />
                                </span>
                            </el-button>
                        </draggable>
                    </div>
                    </el-collapse-item>  
                </el-collapse>
            </div>
        </el-aside>
    </div>
</template>
<script>
    import draggable from 'vuedraggable';
    import each from 'lodash/each';
    import size from 'lodash/size';
    import Icon from '../Icons/Index.vue';

    export default {
        components: { draggable, Icon },
        name: 'SearchFormComponent',
        props: ['renderIcons','componentsProp','allComponents','hideSearchBar', 'addComponent', 'fieldsContract', 'fetching', 'toggleActiveGroup', 'isActiveGroup', 'getItemClasses', 'assetsUrl', 'cloneItem'],
        data() {
            return {
                formSearchForm: this.form,
                components: {},
                visible: true,
                search: '',
                activeNames: [],
                has_pro: window.wpPayFormsAdmin.has_pro
            }
        },
        computed: {
            fieldGroups() {
                let componentGroups = {
                    general: {
                        title: 'General Fields',
                        icon: 'generals.svg',
                        elements: []
                    },
                    payment: {
                        title: 'Donation & Product Fields',
                        elements: [],
                        icon: 'products.svg'
                    },
                    payment_method: {
                        title: 'Payment Method Fields',
                        elements: [],
                        icon: 'payments.svg'
                    }
                }
                each(this.components, (component, componentName) => {
                    if (componentGroups[component.postion_group]) {
                        componentGroups[component.postion_group].elements.push(component);
                    }
                });

                // Sort the elements in each group: non-pro first, pro last  
                Object.keys(componentGroups).forEach((groupKey) => {  
                    componentGroups[groupKey].elements = componentGroups[groupKey].elements.slice().sort((a, b) => {  
                        if (a.is_pro === 'yes' && b.is_pro !== 'yes') {  
                            return 1;
                        } else if (a.is_pro !== 'yes' && b.is_pro === 'yes') {  
                            return -1;  
                        }  
                        return 0;  
                    });  
                });  
                return componentGroups;
            }
        },
        methods: {
            focusSearchInput() {
                // Use nextTick to ensure the DOM has updated
                this.$nextTick(() => {
                    if (this.$refs.searchInput) {
                        this.$refs.searchInput.focus();
                    }
                });
            },
            initializeActiveNames() {
                // Populate activeNames with titles of all groups to keep them open
                this.activeNames = Object.values(this.fieldGroups).map(group => group.title);
            },
            dynamicStyleRender(component) {
                let style = {};
                if (component?.is_pro === 'yes') {
                    style = {
                        'position': 'relative',
                    }
                }
                return style;
            },
            searchComponent (str, allComponents) {
                this.components = allComponents || this.allComponents;
                let filtered = {};
                str = str || this.search;
                if (str.length) {
                    for (let item in this.components) {
                        let editorTitle = this.components[item].editor_title.toLowerCase();
                        if (editorTitle.indexOf(str.toLowerCase()) !== -1) {
                            filtered[item] = this.components[item];
                        }
                    }
                    this.components = filtered;
                }
                return this.components;
            },
            checkElementsLength (fieldGroups) {
                let count = 0;
                each(fieldGroups, (group) => {
                    count += size(group.elements);
                });
                return count;
            },
            handleClick (component) {
                this.addComponent(component);
                this.search = '';
                this.components = this.allComponents;
            },
            handleChange(val) {
                this.activeNames = val;
            }
        },
        mounted() {
            this.components = this.componentsProp;
            this.initializeActiveNames();
            
            // Listen for a custom event from parent component
            this.$root.$on('modal-opened', this.focusSearchInput);
            console.log(this.has_pro, 'has_pro');
        },
        beforeDestroy() {
            // Clean up event listener
            this.$root.$off('modal-opened', this.focusSearchInput);
        }
    }
</script>
